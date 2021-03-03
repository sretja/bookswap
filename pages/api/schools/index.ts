import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const schools = await client.query(
      q.Paginate(q.Match(q.Index('all_schools')))
    )
    return res.status(200).json(schools.data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
