import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, username, phone } = req.body
  const { id } = req.query
  if (req.method !== 'PATCH')
    return res.status(500).json({ error: 'Invalid request method. <PATCH> ' })
  if (!name || !username || !phone || !id)
    return res.status(500).json({
      error:
        'Required query parameters missing. <name & username & phone & [user]id>',
    })
  try {
    const user: {
      [key: string]: any
    } = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('users_by_id'), id)), (e) => q.Get(e))
    )
    const updatedUser: {
      [key: string]: any
    } = await client.query(
      q.Update(user.data[0].ref, {
        data: {
          name: name,
          username: username,
          phone: phone,
        },
      })
    )
    return res.status(200).json(updatedUser.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
