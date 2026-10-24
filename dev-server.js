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
    response.setHeader("Cache-Control", [".html", ".css", ".js"].includes(extension) ? "no-store" : "public, max-age=31536000, immutable");

    if (extension === ".mp4" && request.headers.range) {
      const [startText, endText] = request.headers.range.replace("bytes=", "").split("-");
      const start = Number(startText);
      const end = endText ? Number(endText) : data.length - 1;
      response.statusCode = 206;
      response.setHeader("Accept-Ranges", "bytes");
      response.setHeader("Content-Range", `bytes ${start}-${end}/${data.length}`);
      response.setHeader("Content-Length", end - start + 1);
      response.end(data.subarray(start, end + 1));
      return;
    }

    response.setHeader("Content-Length", data.length);
    response.end(data);
  });
}).listen(8765, "127.0.0.1");
