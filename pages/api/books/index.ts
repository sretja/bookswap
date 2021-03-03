import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q: query } = req.query
  if (query) {
    try {
      const names = await client.query(
        q.Filter(
          q.Paginate(q.Match(q.Index('books_by_name'))),
          q.Lambda(
            ['name', 'ref'],
            q.ContainsStr(q.LowerCase(q.Var('name')), q.LowerCase(query))
          )
        )
      )

      const books = await client.query(
        q.Map(
          [
            ...names.data.map((name) => {
              return name[1]
            }),
          ],
          q.Lambda('ref', q.Get(q.Var('ref')))
        )
      )

      // console.log(books)

      return res.status(200).json(books)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }
  try {
    const books = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('all_books'))), (ref) => q.Get(ref))
    )
    return res.status(200).json(books.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
