const http = require("http");
const fs = require("fs");
const path = require("path");
const root = __dirname;

http.createServer((request, response) => {
  let pathname = decodeURIComponent(request.url.split("?")[0]);
  if (pathname === "/" || !path.extname(pathname)) pathname = "/index.html";
  const file = path.join(root, pathname);
  fs.readFile(file, (error, data) => {
    if (error) { response.statusCode = 404; response.end("Not found"); return; }
    const extension = path.extname(file);
    const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mp4": "video/mp4", ".jpg": "image/jpeg", ".png": "image/png" };
    response.setHeader("Content-Type", types[extension] || "application/octet-stream");
    response.end(data);
  });
}).listen(8765, "127.0.0.1");
