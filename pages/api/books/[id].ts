import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  if (id.includes('lvl-')) {
    try {
      const lvl = Number(id[id.length - 1])
      if (lvl > 5 || lvl < 1 || lvl === undefined)
        return res.status(500).json({ error: 'Level is invalid.' })

      const books = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('books_by_level'), lvl)), (e) =>
          q.Get(e)
        )
      )

      return res.status(200).json(books)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }
  try {
    const books: {
      [key: string]: any
    } = await client.query(q.Get(q.Ref(q.Collection('books'), id)))
    return res.status(200).json(books.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
