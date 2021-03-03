import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { school, lvl } = req.query
  if (school && lvl) {
    try {
      let result = []
      const booksBySchool = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('books_by_school'), school)), (e) =>
          q.Get(e)
        )
      )
      await booksBySchool.data.forEach((e) => {
        if (e.data.level === Number(lvl)) result.push(e)
      })

      return res.status(200).json(result)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  } else if (school) {
    try {
      const booksBySchool = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('books_by_school'), school)), (e) =>
          q.Get(e)
        )
      )
      return res.status(200).json(booksBySchool.data)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  } else if (lvl) {
    try {
      const booksByLevel = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index('books_by_level'), Number(lvl))),
          (e) => q.Get(e)
        )
      )
      return res.status(200).json(booksByLevel.data)
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  } else {
    const books = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('all_books'))), (ref) => q.Get(ref))
    )
    return res.status(200).json(books.data)
  }
}
