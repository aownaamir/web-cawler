const { crawlPage } = require("./crawl");
// https://wagslane.dev
// 404: http://wagslane.dev/okl

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  } else if (process.argv.length < 3) {
    console.log("too many websites provided");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(`Starting to crawl: ${baseURL}`);
  const pages = await crawlPage(baseURL, baseURL, {});
  for (const page of Object.entries(pages)) {
    console.log(page);
  }
}

main();
