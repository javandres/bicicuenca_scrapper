const knex = require("knex");
const knexPostgis = require("knex-postgis");

const knexfile = require("./knexfile");
console.log("KNEX config:", knexfile);

const env = process.env.NODE_ENV || "development";
const configOptions = knexfile[env];

const db = knex(configOptions);

const st = knexPostgis(db);

exports.db = db;
exports.st = st;

module.exports = {
  db,
  st,
};
