import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  try {
    const books: {
      [key: string]: any
    } = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('books_by_seller'), id)), (e) =>
        q.Get(e)
      )
    )
    return res.status(200).json(books.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
