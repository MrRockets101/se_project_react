const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get("/", (req, res) => {
  res.json({
    message: "Welcome to the JSON Server API",
    endpoints: ["/items"],
  });
});

server.use((req, res, next) => {
  if (req.method === "POST" && req.body && req.body._id !== undefined) {
    req.body.id = req.body._id;
    delete req.body._id;
  }
  next();
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});
