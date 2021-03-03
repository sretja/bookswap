import type { NextApiRequest, NextApiResponse } from 'next'

import _ from 'lodash'

import { query as q } from 'faunadb'
import { FaunaClient as client } from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authors: {
      [key: string]: any
    } = await client.query(q.Paginate(q.Match(q.Index('all_authors'))))
    return res.status(200).json(_.sortedUniq(authors.data))
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
