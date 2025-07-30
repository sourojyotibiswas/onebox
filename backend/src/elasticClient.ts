import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({ node: "http://localhost:9200" });

// Create Elasticsearch index if it doesn't exist
export async function ensureIndex(index: string) {
  const exists = await esClient.indices.exists({ index });
  if (!exists) {
    await esClient.indices.create({
      index,
      mappings: {
        properties: {
          account: { type: "keyword" },
          folder: { type: "keyword" },
          uid: { type: "long" },
          date: { type: "date" },
          from: { type: "text" },
          to: { type: "text" },
          subject: { type: "text" },
          body: { type: "text" },
          category: { type: "keyword" },
        },
      },
    });
    console.log(`Created index "${index}"`);
  }
}
