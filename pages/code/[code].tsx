import { GetServerSideProps } from "next";
import { query } from "@/lib/db";

type Link = {
  code: string;
  target_url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
};

interface Props {
  link: Link | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const code = ctx.params?.code as string;

  const result = await query(
    "SELECT code, target_url, clicks, last_clicked, created_at FROM links WHERE code = $1 LIMIT 1",
    [code]
  );

  if (result.rowCount === 0) {
    return { notFound: true };
  }

  const row = result.rows[0];

  const link: Link = {
    code: row.code,
    target_url: row.target_url,
    clicks: Number(row.clicks),
    last_clicked: row.last_clicked ? String(row.last_clicked) : null,
    created_at: String(row.created_at),
  };

  return {
    props: {
      link,
    },
  };
};

export default function CodeStatsPage({ link }: Props) {
  if (!link) return <h1>Not Found</h1>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Stats for: {link.code}</h1>

      <p><strong>Target URL:</strong> {link.target_url}</p>
      <p><strong>Total Clicks:</strong> {link.clicks}</p>
      <p><strong>Last Clicked:</strong> {link.last_clicked || "Never"}</p>
      <p><strong>Created At:</strong> {link.created_at}</p>

      <br />
      <a href="/">⬅ Back to Dashboard</a>
    </div>
  );
}
