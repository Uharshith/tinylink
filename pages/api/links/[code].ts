import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query as { code: string };

  if (req.method === 'GET') {
    const result = await query(
      'SELECT code, target_url, clicks, last_clicked, created_at FROM links WHERE code=$1 LIMIT 1',
      [code]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'not_found' });

    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'DELETE') {
    const result = await query('DELETE FROM links WHERE code=$1', [code]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'not_found' });

    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, DELETE');
  return res.status(405).end();
}
