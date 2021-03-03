import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { school, name, author, price, level, picture } = req.body
  const { id } = req.query
  if (req.method !== 'POST')
    return res.status(500).json({ error: 'Invalid request method. <POST> ' })
  if (!school || !name || !author || !price || !level || !picture || !id)
    return res.status(500).json({
      error:
        'Required query parameters missing. <school & name & author & price & level & picture & [seller]id>',
    })
  try {
    const book = await client.query(
      q.Create(q.Collection('books'), {
        data: {
          school: school,
          name: name,
          author: author,
          price: price,
          level: level,
          picture: picture,
          seller: id,
        },
      })
    )
    return res.status(200).json(book)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
