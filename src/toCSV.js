import { fetchLand, FROM, TO } from "./index.js";
import { stringify } from "csv-stringify";
import { join } from "path";
import fs from "fs";
import { logChunks, transformData, todaysDate } from "./utils.js";
import csv from "csv-parser";

const columns = {
  landId: "landId",
  name: "name",
  devRank: "devRank",
  devPoint: "devPoint",
  statsToken: "statsToken",
  statsResources: "statsResources",
  statsResource: "statsResource",
  storageToken: "storageToken",
  storageResources: "storageResources",
  storageResource: "storageResource",
  profileComment: "profileComment",
  profileImage: "profileImage",
  profileColor: "profileColor",
  owner: "owner",
  saleStatus: "saleStatus",
  salePrice: "salePrice",
  salePriceUSD: "salePriceUSD",
  contributed: "contributed",
};

run();

async function run() {
  let lastFROM = await readCSV();
  const data = [];
  for (let i = +lastFROM || FROM; i < TO; i += 1) {
    console.log("Retrieving landId:", i);

    let values;
    try {
      values = await parsedForCSV({
        landId: `${i}`,
      });
    } catch (err) {
      console.error(err);
    }
    data.push(values);
  }

  if (lastFROM) {
    // resume by appending
    stringify(data, { header: false, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.appendFile(join("csv", todaysDate()), output, (err) => {
        if (err) throw err;
        console.log("CSV resuming saved.");
      });
    });
  }
  //  write new csv
  else
    stringify(data, { header: true, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile(join("csv", todaysDate()), output, (err) => {
        if (err) throw err;
        console.log("CSV saved.");
      });
    });
}

function parsedForCSV({ landId }) {
  return fetchLand({ landId }).then(async (response) => {
    const result = await logChunks(response.body);
    const parsed = transformData(result);
    const values = Object.values(parsed);
    return values;
  });
}

async function readCSV() {
  return new Promise((resolve, reject) => {
    let lastRowLandId;
    const stream = fs.createReadStream(`csv/${todaysDate()}`);
    stream
      .pipe(csv())
      .on("data", (row) => {
        lastRowLandId = row.landId;
      })
      .on("end", () => {
        console.log("Resuming from lastId", lastRowLandId);
        resolve(lastRowLandId);
      });
    stream.on("error", (err) => {
      console.log("No CSV found for today");
      resolve();
    });
  });
}
