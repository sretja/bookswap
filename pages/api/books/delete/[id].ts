import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  if (req.method !== 'DELETE')
    return res.status(500).json({
      error: 'Invalid request method. <DELETE>',
    })
  if (!id)
    return res.status(500).json({
      error: 'Required query parameters missing. <[book]id>',
    })
  try {
    const book = await client.query(q.Get(q.Ref(q.Collection('books'), id)))
    const deletedBook = await client.query(q.Delete(book.ref))
    return res.status(200).json(deletedBook)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
