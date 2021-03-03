import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  if (req.method !== 'COPY')
    return res.status(500).json({
      error: 'Invalid request method. <COPY>',
    })
  if (!id)
    return res.status(500).json({
      error: 'Required query parameters missing. <[book]id>',
    })
  try {
    const book: {
      [key: string]: any
    } = await client.query(q.Get(q.Ref(q.Collection('books'), id)))
    const newBook = await client.query(
      q.Create(q.Collection('sold_books'), {
        data: book.data,
      })
    )
    await client.query(q.Delete(book.ref))
    return res.status(200).json(newBook)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
