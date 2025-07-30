import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

// Send notification to Slack when interested email is detected
export async function sendSlackNotification(
  subject: string,
  from: string,
  category: string
) {
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL is not defined");
    return;
  }

  const text = `*${category} Email Detected!*\n*Subject:* ${subject}\n*From:* ${from}`;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    console.log("Slack notification sent");
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
}
