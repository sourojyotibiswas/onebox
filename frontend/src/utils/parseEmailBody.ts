// utils/parseEmailBody.ts
// Parse raw email content using the ML service API
export async function parseEmailBody(raw: string): Promise<string> {
  try {
    const res = await fetch("http://localhost:5000/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw }),
    });

    const data = await res.json();
    return data.text || "Unable to parse content";
  } catch (err) {
    console.error("Error parsing email body:", err);
    return "Error parsing email body";
  }
}
