import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('⚠️ Defina MONGODB_URI no arquivo .env')
}

interface MongooseGlobal {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extensão do tipo globalThis com cache tipado
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseGlobal
}

if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = {
    conn: null,
    promise: null
  }
}

export async function connectToDatabase() {
  const cache = globalWithMongoose._mongooseCache!

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'controlefinanceiro'
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}
