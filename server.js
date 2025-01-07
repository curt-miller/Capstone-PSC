const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const loginRoute = require("./src/API/login");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/API", require("./src/API"));
app.use("/API/login", loginRoute);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
