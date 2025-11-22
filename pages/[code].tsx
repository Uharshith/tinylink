import { GetServerSideProps } from "next";
import { query } from "../lib/db";

export default function RedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  // Look up the link
  const result = await query("SELECT * FROM links WHERE code = $1", [code]);

  if (result.rowCount === 0) {
    return {
      notFound: true,
    };
  }

  const link = result.rows[0];

  // Update clicks + last clicked
  await query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
    [code]
  );

  return {
    redirect: {
      destination: link.target_url,
      permanent: false,
    },
  };
};
