import { esClient } from "./elasticClient";

// Index an email document in Elasticsearch
export async function indexEmail(index: string, id: string, doc: any) {
  await esClient.index({ index, id, document: doc });
  console.log(`Indexed: ${id}`);
}
