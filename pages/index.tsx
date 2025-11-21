import Head from 'next/head';
import { useEffect, useState } from 'react';

type Link = {
  code: string;
  target_url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
};

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch {
      setError('Failed to load links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const createLink = async () => {
    if (!targetUrl) return alert("Enter URL");

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_url: targetUrl,
        code: customCode || undefined
      }),
    });

    if (res.status === 409) {
      return alert("Code already exists");
    }

    const data = await res.json();

    setLinks([data, ...links]);
    setTargetUrl('');
    setCustomCode('');
  };

  return (
    <>
      <Head>
        <title>TinyLink Dashboard</title>
      </Head>

      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>TinyLink Dashboard</h1>

        {/* Create Link Section */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter target URL"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            style={{ padding: "10px", width: "300px" }}
          />
          <input
            type="text"
            placeholder="Custom Code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            style={{ padding: "10px", width: "200px", marginLeft: "10px" }}
          />

          <button onClick={createLink} style={{ marginLeft: "10px", padding: "10px 20px" }}>
            Create
          </button>
        </div>

        {/* Links Table */}
        <h2>All Links</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border={1} cellPadding={10}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Target URL</th>
                <th>Clicks</th>
                <th>Last Clicked</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr key={link.code}>
                  <td>
                    <a href={`/code/${link.code}`}>{link.code}</a>
                  </td>
                  <td>{link.target_url}</td>
                  <td>{link.clicks}</td>
                  <td>{link.last_clicked || "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
