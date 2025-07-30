import { ensureIndex } from "./elasticClient";
import { ImapService } from "./imapService";
import { accounts } from "./accounts";
import { startApi } from "./api";

// Main application entry point
async function main() {
  await ensureIndex("emails");
  for (const cfg of accounts) {
    const svc = new ImapService(cfg);
    svc.connectAndSync().catch((err) => {
      console.error(`Account ${cfg.auth?.user || "unknown"} failed:`, err);
    });
  }
  startApi(3000);
}

main().catch(console.error);
