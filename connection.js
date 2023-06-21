const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "event_management_system",
  port: 4306,
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connection created SUCCESSFULLY...!!");
});

module.exports.con = con;
