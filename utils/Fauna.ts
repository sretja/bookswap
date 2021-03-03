import faunadb from 'faunadb'

export const FaunaClient: faunadb.Client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_KEY,
})
