import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, username, name, email, phone, picture } = req.body
  if (req.method !== 'POST')
    return res.status(500).json({ error: 'Invalid request method. <POST> ' })
  if (!id || !username || !name || !email || !picture)
    return res.status(500).json({
      error: 'Required query parameters missing. <id & name & email & picture>',
    })
  try {
    const user = await client.query(
      q.Create(q.Collection('users'), {
        data: {
          id: id,
          username: username,
          name: name,
          email: email,
          phone: phone,
          picture: picture,
        },
      })
    )
    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
