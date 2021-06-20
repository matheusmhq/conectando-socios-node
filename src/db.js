async function connect() {
  if (global.connection && global.connection.state != "disconnected")
    return global.connection;

  const mysql = require("mysql2/promise");
  try {
    const connection = await mysql.createConnection(
      "mysql://b0b62b28e972c6:78896713@us-cdbr-east-04.cleardb.com/heroku_3afc90ae818cec7"
    );
    console.log("connect to MySQL!");
    global.connection = connection;
    return connection;
  } catch (error) {
    console.log("error to connect MySQL!" + error);
  }
}

module.exports = { connect };
