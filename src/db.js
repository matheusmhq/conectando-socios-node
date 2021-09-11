require("dotenv").config();

async function connect() {
  const mysql = require("mysql2/promise");
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URL);
    console.log("connect to MySQL!");
    return connection;
  } catch (error) {
    console.log("error to connect MySQL! " + error);
  }
}

module.exports = { connect };
