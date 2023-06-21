const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("./connection").con;
const port = 5000;


const staticPath = path.join(__dirname, "./static");
const viewsPath = path.join(__dirname, "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", viewsPath);

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/adminindex", (req, res) => {
  res.render("adminindex.hbs");
});

app.get("/add", (req, res) => {
  res.render("add.hbs");
});

app.get("/search", (req, res) => {
  res.render("search.hbs");
});

app.get("/update", (req, res) => {
  res.render("update.hbs");
});

app.get("/delete", (req, res) => {
  res.render("delete.hbs");
});

app.get("/view", (req, res) => {
  let qry = "select * from participent ";
  mysql.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.render("view.hbs", { data: results });
    }
  });
});

app.get("/studentregitration", (req, res) => {
  //fetching data

  const { full_name, email, phone_no, clg_name, event_name } = req.query;

  let qry = "select * from participent where name=? or phone_no=?";
  mysql.query(qry, [full_name, phone_no], (err, results) => {
    if (err) throw err;
    else {
      // if result is not empty
      if (results.length > 0) {
        res.render("index", { mesg1: true });
      } else {
        let qry2 = `INSERT INTO participent 
        (name,
          email,
          phone_no,
          event_name,
          college_name
          ) VALUES (?,?,?,?,?);`;
        mysql.query(
          qry2,
          [full_name, email, phone_no, event_name, clg_name],
          (err, results) => {
            if (err) throw err;
            if (results.affectedRows > 0) {
              res.render("index", { mesg: true });
            }
          }
        );
      }
    }
  });
});

app.get("/adminaddstudent", (req, res) => {
  //fetching data
  const { full_name, email, phone_number, event_name, clg_name } = req.query;

  let qry = "select * from participent where name=? or phone_no=?";
  mysql.query(qry, [full_name, phone_number], (err, results) => {
    if (err) throw err;
    else {
      // if result is not empty
      if (results.length > 0) {
        res.render("add", { mesg1: true });
      } else {
        let qry2 = "insert into participent values(?,?,?,?,?)";
        mysql.query(
          qry2,
          [full_name, email, phone_number, event_name, clg_name],
          (err, results) => {
            if (results.affectedRows > 0) {
              res.render("add", { mesg: true });
            }
          }
        );
      }
    }
  });
});

// Viewing database
app.get("/adminviewstudent", (req, res) => {
  const { event_name, phone_no } = req.query;

  let qry = "select * from participent where event_name=?";

  mysql.query(qry, [event_name], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("search", { mesg1: true, mesg2: false, data: results });
      } else {
        res.render("search", { mesg1: false, mesg2: true });
      }
    }
  });
});

// Searching to update Student
app.get("/adminupdatesearch", (req, res) => {
  const { full_name, phone_number, event_name } = req.query;

  let qry =
    "select * from participent where name=? and phone_no=? and event_name=?";
  mysql.query(qry, [full_name, phone_number, event_name], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("update", { mesg1: true, mesg2: false, data: results });
      } else {
        res.render("update", { mesg1: false, mesg2: true });
      }
    }
  });
});

// Actually updating data inside database
app.get("/adminupdatestudent", (req, res) => {
  // fetch data

  const { full_name, email, phone_number, event_name, clg_name } = req.query;
  let qry =
    "update participent set name=?, email=?,college_name=? where phone_no=? and event_name=?";

  mysql.query(
    qry,
    [full_name, email, clg_name, phone_number, event_name],
    (err, results) => {
      if (err) throw err;
      else {
        if (results.affectedRows > 0) {
          res.render("update", { umesg: true });
        }
      }
    }
  );
});

// Deleting data from database
app.get("/admindeletestudent", (req, res) => {
  // fetch data from the form
  const { phone_number, event_name } = req.query;

  let qry = "delete from participent where phone_no=? and event_name=?";
  mysql.query(qry, [phone_number, event_name], (err, results) => {
    if (err) throw err;
    else {
      if (results.affectedRows > 0) {
        res.render("delete", { dmesg1: true, dmesg2: false });
      } else {
        res.render("delete", { dmesg1: false, dmesg2: true });
      }
    }
  });
});

// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
