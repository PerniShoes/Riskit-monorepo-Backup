const http = require("http");

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "backend_mock" }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/risk") {
    // simple mock payload
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ risk: "mock", probability: 0.42 }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(port, () => {
  console.log(`backend_mock listening on http://localhost:${port}`);
});

module.exports = server;
