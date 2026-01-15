import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");

// Handle all export shapes safely
const pdf =
  typeof pdfModule === "function"
    ? pdfModule
    : typeof pdfModule.default === "function"
      ? pdfModule.default
      : pdfModule.pdf || pdfModule.parse;

const app = express();
app.use(express.raw({ type: "*/*", limit: "50mb" }));

app.post("/extract", async (req, res) => {
  try {
    if (typeof pdf !== "function") {
      throw new Error("pdf-parse export not resolved");
    }

    const data = await pdf(req.body);
    res.json({ text: data.text });
  } catch (e) {
    console.error("PDF ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log("PDF worker running"));
