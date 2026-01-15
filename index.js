import express from "express";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const app = express();
app.use(express.raw({ type: "*/*", limit: "50mb" }));

app.post("/extract", async (req, res) => {
  try {
    const uint8Array = new Uint8Array(req.body);

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(" ") + "\n";
    }

    res.json({ text });
  } catch (e) {
    console.error("PDF ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log("PDF worker running on localhost"));
