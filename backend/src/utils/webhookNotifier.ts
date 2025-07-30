import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const WEBHOOK_URL = process.env.WEBHOOK_URL as string;

// Send webhook notification when interested email is detected
export async function sendWebhookNotification(data: {
  subject: string;
  from: string;
  category: string;
}) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Webhook failed:", res.status, text);
    } else {
      console.log("Webhook POST success:", res.status);
    }
  } catch (err) {
    console.error("Webhook error:", err);
  }
}
