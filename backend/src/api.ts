import express from "express";
import cors from "cors";
import { esClient } from "./elasticClient";
import { accounts } from "./accounts";

interface EmailDocument {
  account: string;
  folder: string;
  uid: number;
  date: Date;
  from: string;
  to: string;
  subject: string;
  body: string;
}

const origin = "http://localhost:5173";

// Start Express API server with email search endpoint
export function startApi(port = 3000) {
  const app = express();
  app.use(cors({ origin }));

  app.get("/api/emails", async (req, res) => {
    const {
      q,
      fromDate,
      toDate,
      folder,
      page = "1",
      size = "50",
    } = req.query as Record<string, string>;

    const from = (parseInt(page) - 1) * parseInt(size);
    const limit = parseInt(size);

    const email1 = accounts[0]?.auth?.user;
    const email2 = accounts[1]?.auth?.user;

    const groupedResult: any = { email1: {}, email2: {} };

    for (const [label, account] of Object.entries({ email1, email2 })) {
      const must: any[] = [{ term: { account } }];

      if (folder) must.push({ term: { folder } });
      if (q) must.push({ query_string: { query: q } });
      if (fromDate || toDate) {
        const range: any = {};
        if (fromDate) range.gte = fromDate;
        if (toDate) range.lte = toDate;
        must.push({ range: { date: range } });
      }

      const result = await esClient.search({
        index: "emails",
        query: { bool: { must } },
        sort: [{ date: "desc" }],
        from,
        size: limit,
      });

      for (const hit of result.hits.hits) {
        const email = hit._source as EmailDocument;
        groupedResult[label][email.folder] ??= [];
        groupedResult[label][email.folder].push(email);
      }
    }

    res.json({
      page: parseInt(page),
      size: limit,
      emails: groupedResult,
    });
  });

  app.listen(port, () =>
    console.log(`API started → http://localhost:${port}/api/emails`)
  );
}
