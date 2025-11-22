import { GetServerSideProps } from "next";
import { query } from "../../lib/db";

export default function StatsPage({ link }: any) {
  return (
    <div>
      <h1>Stats for: {link.code}</h1>
      <p><strong>Target URL:</strong> {link.target_url}</p>
      <p><strong>Total Clicks:</strong> {link.clicks}</p>
      <p><strong>Last Clicked:</strong> {link.last_clicked ? new Date(link.last_clicked).toString() : "Never"}</p>
      <p><strong>Created At:</strong> {new Date(link.created_at).toString()}</p>

      <a href="/" style={{ color: "blue" }}>⬅ Back to Dashboard</a>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  const result = await query("SELECT * FROM links WHERE code = $1", [code]);

  if (result.rowCount === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      link: result.rows[0],
    },
  };
};
