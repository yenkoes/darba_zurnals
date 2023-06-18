const express = require("express");
const path = require("path");
const cors = require("cors");
var mysql = require("mysql2");

var DB_Prefix = `fadejevs`;

const app = express();

app.use(express.json());
app.use(cors());

app.set("trust proxy", true);

const connection = mysql.createPool({
  host: "auth-db483.hstgr.io",
  user: "u353443769_aras",
  password: `testadmin`,
  database: `u353443769_aras`,
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

app.get("/user", (req, res) => {
  connection.query(`SELECT id, vards, uzv FROM employer`, (error, result) => {
    res.send(result);
  });
});

app.get("/source", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_source`, (error, result) => {
    res.send(result);
  });
});

app.get("/object", (req, res) => {
  connection.query(`SELECT id, name FROM object`, (error, result) => {
    res.send(result);
  });
});

app.get("/device", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_device`, (error, result) => {
    res.send(result);
  });
});

app.get("/type", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_type`, (error, result) => {
    res.send(result);
  });
});

app.post("/post_issue", (req, res) => {
  const o = req.body;

  connection.query(
    `INSERT INTO ${DB_Prefix}_issue (date, time, id_user, id_source, name, id_obj, id_device, id_type, note) VALUES ("${o.date}", "${o.time}", "${o.user}", "${o.source}", "${o.name}", "${o.object}", "${o.device}", "${o.typeofissue}", "${o.remarks}")`
  );
});

app.post("/post_action", (req, res) => {
  const o = req.body;

  connection.query(
    `INSERT INTO ${DB_Prefix}_action (name, id_status, date, time, id_user, id) VALUES ("${o.name}", "${o.status}", "${o.date}", "${o.time}", "${o.user}", "${o.issue}")`
  );
});

app.get("/getfromid", (req, res) => {
  connection.query(`SELECT vards FROM employer`, (error, result) => {
    res.send(result);
  });
});

app.get("/issue", (req, res) => {
  connection.query(
    `SELECT ${DB_Prefix}_issue.id, ${DB_Prefix}_issue.date, ${DB_Prefix}_issue.time, employer.uzv AS id_user,report_source.name_lv AS id_source, object.name AS id_obj ,${DB_Prefix}_issue.name,report_device.name_lv AS id_device,report_type.name_lv AS id_type, note FROM ${DB_Prefix}_issue    
  LEFT JOIN object ON ${DB_Prefix}_issue.id_obj = object.id
  LEFT JOIN employer ON ${DB_Prefix}_issue.id_user = employer.id
  LEFT JOIN report_source ON ${DB_Prefix}_issue.id_source = report_source.id
  LEFT JOIN report_device ON ${DB_Prefix}_issue.id_device = report_device.id
  LEFT JOIN report_type ON ${DB_Prefix}_issue.id_device = report_type.id
  order by id ASC`,
    (error, result) => {
      res.send(result);
    }
  );
});

app.get("/action", (req, res) => {
  connection.query(
    `SELECT ${DB_Prefix}_action.id,  ${DB_Prefix}_action.name, report_status.name_en AS id_status, ${DB_Prefix}_action.date, ${DB_Prefix}_action.time, person.fname AS id_user, ${DB_Prefix}_issue.id AS id_report FROM ${DB_Prefix}_action    
  LEFT JOIN person ON ${DB_Prefix}_action.id_user = person.id
  LEFT JOIN report_status ON ${DB_Prefix}_action.id_status = report_status.id
  LEFT JOIN ${DB_Prefix}_issue ON ${DB_Prefix}_action.id_report = ${DB_Prefix}_issue.id
  order by id ASC`,
    (error, result) => {
      res.send(result);
    }
  );
});

app.get("/status", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_status`, (error, result) => {
    res.send(result);
  });
});

app.get("/issues", (req, res) => {
  connection.query(`SELECT id FROM ${DB_Prefix}_issue`, (error, result) => {
    res.send(result);
  });
});

app.get("/submit_issue", (req, res) => {
  res.sendFile(`${__dirname}/public/issue/index.html`);
});

app.get("/submit_action", (req, res) => {
  res.sendFile(`${__dirname}/public/action/index.html`);
});

app.use("/static", express.static(path.join(__dirname, "public")));

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port 3000`);
  }
});
