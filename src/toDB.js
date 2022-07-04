import { fetchLand, FROM, TO } from "./index.js";
import { logChunks, transformData, sleep } from "./utils.js";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

run();

async function run() {
  for (let i = FROM; i < TO; i += 1) {
    console.log("landId:", i);
    await sleep(1000);
    await findLandAndInsertInDB({
      landId: `${i}`,
    });
  }
}

function findLandAndInsertInDB({ landId }) {
  return fetchLand({ landId }).then(async (response) => {
    const result = await logChunks(response.body);
    const parsed = transformData(result);
    try {
      await db.land.create({ data: parsed });
    } catch (err) {
      console.error(err);
    }
  });
}
