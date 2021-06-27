const express = require("express");
const db = require("./db");
const cors = require("cors");
const routes = require("./routes");

const app = express();

db.connect();

app.use(cors());
app.use(express.json());
app.use(routes);

var port = process.env.PORT || 8000;
app.listen(port);
