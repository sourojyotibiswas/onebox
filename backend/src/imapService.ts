import { ImapFlow } from "imapflow";
import dayjs from "dayjs";
import { indexEmail } from "./emailIndexer";
import { categorizeEmail } from "./aiService";
import { getLastUID, setLastUID } from "./utils/uidTracker";
import { sendSlackNotification } from "./utils/notifier";
import { sendWebhookNotification } from "./utils/webhookNotifier";

const INDEX_NAME = "emails";

export class ImapService {
  private client: ImapFlow;

  constructor(private config: any) {
    this.client = new ImapFlow({
      ...config,
      socketTimeout: 0,
    });
  }

  // Connect to IMAP server and sync emails from all folders
  async connectAndSync() {
    await this.client.connect();

    const since = dayjs().subtract(1, "day").toDate();
    const mailboxes = await this.client.list();

    const foldersToForceInclude = ["[Gmail]/Sent Mail"];
    for await (let mbox of mailboxes) {
      if (
        mbox.flags?.has("\\Noselect") &&
        !foldersToForceInclude.includes(mbox.path)
      )
        continue;
      await this.processFolder(mbox.path, since);
    }

    await this.client.mailboxOpen("INBOX", { readOnly: true });

    this.client.on("exists", async (newCount) => {
      console.log(`New message in INBOX, total count now ${newCount}`);
      await this.processFolder("INBOX", since);
    });

    await this.client.idle();
  }

  // Process emails in a specific folder since a given date
  private async processFolder(folder: string, since: Date) {
    await this.client.mailboxOpen(folder, { readOnly: true });
    const lock = await this.client.getMailboxLock(folder);

    const account = this.config.auth.user;
    const lastSeenUID = getLastUID(account, folder);

    try {
      const uids = await this.client.search({ since });
      const uidArray = Array.isArray(uids) ? uids : [];
      const newUIDs = uidArray.filter((uid: number) => uid > lastSeenUID);

      for (const uid of newUIDs) {
        try {
          const msg = await this.client.fetchOne(uid, {
            envelope: true,
            source: true,
          });

          if (msg && msg.envelope && msg.source && msg.envelope.date) {
            const subject = msg.envelope.subject || "No Subject";
            const category = await categorizeEmail(subject);
            // const category = await categorizeEmail(
            //   subject,
            //   msg.source.toString()
            // );

            if (category.toLowerCase() === "interested") {
              console.log("Detected INTERESTED. Sending Slack + Webhook...");

              await sendSlackNotification(
                subject,
                msg.envelope.from?.map((f: any) => f.address).join(",") ||
                  "Unknown",
                category
              );

              await sendWebhookNotification({
                subject,
                from:
                  msg.envelope.from?.map((f: any) => f.address).join(",") ||
                  "Unknown",
                category,
              });
            }

            const doc = {
              account,
              folder,
              uid,
              date: msg.envelope.date,
              from: msg.envelope.from?.map((f: any) => f.address).join(","),
              to: msg.envelope.to?.map((t: any) => t.address).join(","),
              subject,
              body: msg.source.toString(),
              category,
            };

            const id = `${account}-${folder}-${uid}`;
            await indexEmail(INDEX_NAME, id, doc);

            setLastUID(account, folder, uid);
          }
        } catch (err) {
          console.error(`Failed to process UID ${uid} in ${folder}`, err);
        }
      }
    } finally {
      lock.release();
    }
  }
}
