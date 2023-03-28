require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const schedule = require("node-schedule");

console.log("INIT SCRIPT");
const url = "https://www.bicicuenca.com/mapaestacao.aspx";
const knexDb = require("./db.js");

let estaciones = null;

async function scrapeData() {
  try {
    estaciones = estaciones ?? (await knexDb.db("estaciones").select());
    const { data: rawData } = await axios.get(url);
    const $ = cheerio.load(rawData);
    const scriptData = $("script:not([src])")[2].children[0].data;

    const js = scriptData
      .replace("//<![CDATA[", "")
      .replace("//]]>", "")
      .replace("var beaches = ", "")
      .replace(",];", ",]");

    const dataList = eval(js);

    const timestamp = new Date().toISOString();

    const dataPromises = dataList.map(async (el) => {
      const [
        nombre,
        lat,
        lon,
        direccion,
        und1,
        status1,
        status2,
        disponible1,
        disponible2,
        vacante,
        tipo_estacion,
        icono,
      ] = el;

      const estacion = estaciones.find((est) => est.name_web === nombre);

      await knexDb.db("bicicuenca_data").insert({
        timestamp,
        nombre,
        ref: estacion?.ref,
        lat,
        lon,
        direccion,
        capacity: estacion?.capacity,
        status1,
        status2,
        disponible1,
        disponible2,
        vacante,
        tipo_estacion,
        icono,
      });

      console.log(`${timestamp} - ${nombre} was saved to database`);
      return {
        timestamp,
        nombre,
        lat,
        lon,
        direccion,
        status1,
        status2,
        disponible1,
        disponible2,
        vacante,
        tipo_estacion,
        icono,
      };
    });

    await Promise.all(dataPromises);
    console.log("==========");
  } catch (err) {
    console.error(err);
  }
}

const job = schedule.scheduleJob("*/1 * * * *", async function () {
  console.log("Running...");
  await scrapeData();
  console.log("Finished");
});

// scrapeData();
