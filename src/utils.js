export async function logChunks(readable) {
  let result = "";
  for await (const chunk of readable) {
    const string = new TextDecoder().decode(chunk);
    result += string;
  }
  return result;
}

export function transformData(data) {
  const json = JSON.parse(data);
  return [json].map((r) => ({
    landId: `${r.land.landId}` ?? "",
    name: r.land.landNam ?? "",
    devRank: `${r.land.attributes.devRank}` ?? "",
    devPoint: `${r.land.attributes.devPoint}` ?? "",
    statsToken: `${r.land.attributes.stats.token}` ?? "",
    statsResources: `${r.land.attributes.stats.resources}` ?? "",
    statsResource: `${r.land.attributes.stats.resource}` ?? "",
    storageToken: r.land.attributes.storage.token ?? "",
    storageResources: `${r.land.attributes.storage.resources}` ?? "",
    storageResource: `${r.land.attributes.storage.resource}` ?? "",
    profileComment: r.land.attributes.profile.comment ?? "",
    profileImage: r.land.attributes.profile.image ?? "",
    profileColor: `${r.land.attributes.profile.color}` ?? "",
    owner: `${r.land.owner}` ?? "",
    saleStatus: `${r.land.sale.status}` ?? "",
    salePrice: `${r.land.sale.price}` ?? "",
    salePriceUSD: `${r.land.sale.priceUSD}` ?? "",
    contributed: `${r.land.contributed}` ?? "",
  }))[0];
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function todaysDate() {
  return `${new Date()
    .toLocaleString()
    .split(",")[0]
    .replaceAll("/", ".")}.csv`;
}
