import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users: {
      [key: string]: any
    } = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('all_users'))), (ref) => q.Get(ref))
    )
    return res.status(200).json(users.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
