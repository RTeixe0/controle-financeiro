import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/models/Transaction'
import { Category } from '@/models/Category'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  await connectToDatabase()

  try {
    const { mensagem, tipo, userId } = req.body as {
      mensagem?: string
      tipo?: 'texto' | 'audio' | 'imagem'
      userId?: string
    }

    if (!mensagem || !tipo || !userId) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    if (tipo !== 'texto') {
      return res.status(200).json({ message: 'Mensagem recebida' })
    }

    const text = mensagem.toLowerCase()
    let match = text.match(/gastei\s+(\d+(?:[.,]\d+)?)(?:.*(?:com|em)\s+(.+))?/)
    let valor: number | null = null
    let descricao = ''
    let ttype: 'receita' | 'despesa' | null = null

    if (match) {
      valor = parseFloat(match[1].replace(',', '.'))
      descricao = match[2]?.trim() || ''
      ttype = 'despesa'
    } else {
      match = text.match(/recebi\s+(\d+(?:[.,]\d+)?)(?:.*(?:do|da|de)\s+(.+))?/)
      if (match) {
        valor = parseFloat(match[1].replace(',', '.'))
        descricao = match[2]?.trim() || ''
        ttype = 'receita'
      }
    }

    if (!match || valor === null || !descricao) {
      return res.status(200).json({ message: 'Mensagem recebida' })
    }

    let categoria = await Category.findOne({ nome: descricao, tipo: ttype, userId })
    if (!categoria) {
      categoria = await Category.create({ nome: descricao, tipo: ttype, userId })
    }

    const transacao = await Transaction.create({
      userId,
      data: new Date(),
      valor,
      tipo: ttype,
      categoriaId: categoria._id,
      descricao,
      origem: 'whatsapp',
      status: 'pendente'
    })

    return res.status(201).json({
      message: 'Transação registrada',
      valor: transacao.valor,
      descricao: transacao.descricao,
      tipo: transacao.tipo
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao processar mensagem' })
  }
}
