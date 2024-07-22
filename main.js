const { crawlPage } = require("./crawl");
// https://wagslane.dev
// 404: http://wagslane.dev/okl

function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  } else if (process.argv.length < 3) {
    console.log("too many websites provided");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(`Starting to crawl: ${baseURL}`);
  crawlPage(baseURL);
}

main();
