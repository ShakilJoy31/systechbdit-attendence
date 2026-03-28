const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Use production mode in cPanel
const dev = false; // Force production mode
const port = process.env.PORT || 3000; // cPanel provides PORT env variable

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
  .listen(port, "0.0.0.0", (err) => { // Listen on all interfaces
    if (err) throw err;
    console.log(`> Server started on port ${port}`);
  });
});