import multer from 'multer'
import nextConnect from 'next-connect'
import { parse } from 'csv-parse/sync'
import { getSessionUser } from '@/utils/auth' // função para pegar o user autenticado
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

const upload = multer({ storage: multer.memoryStorage() })

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Erro: ${error.message}` })
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Método ${req.method} não permitido` })
  }
})

apiRoute.use(upload.single('file'))

apiRoute.post(async (req, res) => {
  await connectDB()
  const user = await getSessionUser(req)

  if (!user) {
    return res.status(401).json({ error: 'Não autenticado' })
  }

  try {
    const content = req.file.buffer.toString('utf-8')
    const registros = parse(content, { columns: true, skip_empty_lines: true })

    const transacoes = registros.map(item => ({
      userId: user._id,
      data: new Date(item.data),
      valor: parseFloat(item.valor),
      tipo: item.tipo,
      categoriaId: null, // categoria pode ser detectada ou preenchida depois
      descricao: item.descricao || '',
      formaPagamento: item.formaPagamento || 'outro',
      origem: 'importacao',
      anexo: null,
      status: 'realizada'
    }))

    await Transaction.insertMany(transacoes)

    res.status(201).json({ sucesso: true, quantidade: transacoes.length })
  } catch (error) {
    console.error('Erro ao importar CSV:', error)
    res.status(400).json({ error: 'Erro ao importar CSV' })
  }
})

export default apiRoute
export const config = {
  api: {
    bodyParser: false
  }
}
