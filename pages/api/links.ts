import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

function isValidCode(code: string) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function generateRandomCode(len = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await query(
        'SELECT code, target_url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC'
      );
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  if (req.method === 'POST') {
    const { code, target_url } = req.body ?? {};

    if (!target_url) {
      return res.status(400).json({ error: 'target_url required' });
    }

    try {
      new URL(target_url);
    } catch {
      return res.status(400).json({ error: 'invalid target_url' });
    }

    let finalCode = code || generateRandomCode(6);

    if (!isValidCode(finalCode)) {
      return res.status(400).json({ error: 'code must match [A-Za-z0-9]{6,8}' });
    }

    try {
      const insert =
        'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING code, target_url, clicks, last_clicked, created_at';
      const result = await query(insert, [finalCode, target_url]);
      return res.status(201).json(result.rows[0]);
    } catch (err: any) {
      if (err.code === '23505') return res.status(409).json({ error: 'code exists' });
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
