import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  try {
    const refs: {
      [key: string]: any
    } = await client.query(q.Paginate(q.Match(q.Index('users_by_id'), id)))
    const user: {
      [key: string]: any
    } = await client.query(q.Get(refs.data[0]))
    return res.status(200).json(user.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
