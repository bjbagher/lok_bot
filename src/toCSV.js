import { fetchLand, FROM, TO } from "./index.js";
import { stringify } from "csv-stringify";
import { join } from "path";
import fs from "fs";
import { logChunks, transformData, sleep } from "./utils.js";

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
  const data = [];
  for (let i = FROM; i < TO; i += 1) {
    console.log("landId:", i);
    await sleep(1000);

    const values = await parsedForCSV({
      landId: `${i}`,
    });
    data.push(values);
  }
  stringify(data, { header: true, columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFile(
      join(
        "csv",
        `${new Date().toLocaleString().split(",")[0].replaceAll("/", ".")}.csv`
      ),
      output,
      (err) => {
        if (err) throw err;
        console.log("csv saved.");
      }
    );
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
