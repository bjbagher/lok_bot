const fetch = require("node-fetch");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmMxYmI3OTZlNGJkMzU3MGQ5ZTAwODUiLCJraW5nZG9tSWQiOiI2MmMxYmI3OTZlNGJkMzU3MGQ5ZTAwODYiLCJ3b3JsZElkIjo0MiwidmVyc2lvbiI6MTQ2OCwiYnVpbGQiOjAsInBsYXRmb3JtIjoid2ViIiwidGltZSI6MTY1Njg2NTE0NTQwNSwiY2xpZW50WG9yIjoiMCIsImlhdCI6MTY1Njg2NTE0NSwiZXhwIjoxNjU3NDY5OTQ1LCJpc3MiOiJub2RnYW1lcy5jb20iLCJzdWIiOiJ1c2VySW5mbyJ9.q8-kjczMBxiuFYFs60WcpHvgDzpglUUaaNjUO6SpMEQ";
const from = 164148;
const to = 164200;
main();

async function main() {
  for (let i = from; i < to; i += 1) {
    console.log("landId:", i);
    await findLandAndInsertInDB({
      landId: `${i}`,
      accessToken: accessToken,
    });
  }
}

function findLandAndInsertInDB({ landId, accessToken }) {
  return fetchLand({ landId, accessToken }).then(async (response) => {
    let result = "";
    async function logChunks(readable) {
      for await (const chunk of readable) {
        const string = new TextDecoder().decode(chunk);
        result += string;
      }
    }
    await logChunks(response.body);
    const parsed = [JSON.parse(result)].map((r) => ({
      id: JSON.stringify(r.land.landId),
      name: JSON.stringify(r.land.landName),
      devRank: JSON.stringify(r.land.attributes.devRank),
      devPoint: JSON.stringify(r.land.attributes.devPoint),
      statsToken: JSON.stringify(r.land.attributes.stats.token),
      statsResources: JSON.stringify(r.land.attributes.stats.resources),
      statsResource: JSON.stringify(r.land.attributes.stats.resource),
      storageToken: JSON.stringify(r.land.attributes.storage.token),
      storageResources: JSON.stringify(r.land.attributes.storage.resources),
      storageResource: JSON.stringify(r.land.attributes.storage.resource),
      profileComment: JSON.stringify(r.land.attributes.profile.comment),
      profileImage: JSON.stringify(r.land.attributes.profile.image),
      profileColor: JSON.stringify(r.land.attributes.profile.color),
      owner: JSON.stringify(r.land.owner),
      saleStatus: JSON.stringify(r.land.sale.status),
      salePrice: JSON.stringify(r.land.sale.price),
      salePriceUSD: JSON.stringify(r.land.sale.priceUSD),
      contributed: JSON.stringify(r.land.contributed),
    }));
    try {
      await db.land.create({ data: parsed[0] });
    } catch (err) {
      console.error(err);
    }
  });
}

function fetchLand({ landId, accessToken }) {
  return fetch("https://api-lok-live.leagueofkingdoms.com/api/land/info", {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": accessToken,
    },
    body: "json=" + encodeURIComponent(`{"landId":${landId}}`),
    method: "POST",
  });
}

module.export = { findLandAndInsertInDB };
