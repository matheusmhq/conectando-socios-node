require("dotenv").config();

async function connect() {
  // if (global.connection && global.connection.state !== "disconnected") {
  //   return global.connection;
  // }

  const mysql = require("mysql2/promise");
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URL);
    console.log("connect to MySQL!");
    global.connection = connection;
    return connection;
  } catch (error) {
    console.log("error to connect MySQL!" + error);
  }
}

module.exports = { connect };
