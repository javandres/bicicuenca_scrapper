/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.SCRAPER_DATABASE_DB || "bicicuenca",
      user: process.env.SCRAPER_DATABASE_USER || "superset",
      password: process.env.SCRAPER_DATABASE_PASSWORD || "superset",
      host: process.env.SCRAPER_DATABASE_HOST || "localhost",
      port: process.env.SCRAPER_DATABASE_PORT || "55432",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./data_postgis/migrations",
    },
    seeds: { directory: "./data_postgis/seeds" },
  },
};
