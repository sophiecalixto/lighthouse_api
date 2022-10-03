const express = require("express");
const cors = require("cors");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const { url } = req.query;
  var response = {error: false , content: ""};

  try {
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = { logLevel: "info", output: "json", port: chrome.port };
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();

    response.error = false;
    response.content = runnerResult.lhr;
    return res.json(response);
  }
  catch(erro) {
    response.error = true;
    response.content = "Falha ao executar a requisição " + erro;
    return res.json(response);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
