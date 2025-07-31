const predictUrl = "http://localhost:5000/predict";

// Categorize email using ML service based on subject line
export async function categorizeEmail(subject: string): Promise<string> {
  try {
    const response = await fetch(predictUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject }), // Only subject for now
    });

    const result = await response.json();
    return result.label || "Uncategorized";
  } catch (error) {
    console.error("Categorization error:", error);
    return "Uncategorized";
  }
}

// Uncomment the following code if you want to use the full email body+subject for categorization

// const predictUrl = "http://localhost:5000/predict";
// const parseUrl = "http://localhost:5000/parse";

// export async function categorizeEmail(
//   subject: string,
//   rawMime: string
// ): Promise<string> {
//   try {
//     const parseRes = await fetch(parseUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ raw: rawMime }),
//     });
//     const parsed = await parseRes.json();
//     const plainTextBody = parsed.text || "";

//     const fullText = `${subject}\n\n${plainTextBody}`;

//     const predictRes = await fetch(predictUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text: fullText }),
//     });

//     const result = await predictRes.json();
//     return result.label || "Uncategorized";
//   } catch (error) {
//     console.error("Categorization error:", error);
//     return "Uncategorized";
//   }
// }
