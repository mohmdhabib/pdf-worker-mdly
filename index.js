import express from "express";
import * as pdf from "pdf-parse";   // 👈 FIXED

const app = express();
app.use(express.raw({ type: "*/*", limit: "50mb" }));

app.post("/extract", async (req, res) => {
  try {
    const data = await pdf.default(req.body);  // 👈 FIXED
    res.json({ text: data.text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "PDF extraction failed" });
  }
});

app.listen(3000, () => console.log("PDF worker running"));
