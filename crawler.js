const { JSDOM } = require("jsdom");
const { chromium } = require("playwright");

const crawlMyPage = async (baseURL, currentURL, pages) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeUrl(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;
  console.log(`actively crawling: ${currentURL}`);

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(currentURL);
    await page.waitForSelector("body");
    const htmlBody = await page.content();
    await browser.close();
    // console.log(htmlBody);

    const nextURLs = urlExtracter(htmlBody, baseURL, currentURL);

    for (const nextURL of nextURLs) {
      pages = await crawlMyPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }
  return pages;
};

// const urls = [
//   "https://www.masterworks.com/research/about/how-it-works",
//   "https://www.masterworks.com/research/about/why-art",
//   "https://www.masterworks.com/research/about/about-masterworks",
//   "https://www.masterworks.com/research/research",
//   "https://www.masterworks.com/research/trading",
//   "https://www.masterworks.com/research/art-challenge",
//   "https://masterworks.breezy.hr/",
//   "https://www.masterworks.com/research/about/press",
//   "https://www.masterworks.com/research/transact-with-masterworks",
//   "https://knowledge.masterworks.com/en/knowledge",
//   "https://knowledge.masterworks.com/en/knowledge/kb-tickets/new",
//   "https://www.masterworks.com/research/about/terms-of-use",
//   "https://www.masterworks.com/research/about/privacy",
//   "https://www.masterworks.com/research/about/disclosure",
//   "https://www.facebook.com/masterworks/",
//   "https://twitter.com/masterworks",
//   "https://instagram.com/masterworks.io",
//   "https://www.linkedin.com/company/masterworks-io",
//   "https://www.youtube.com/@Masterworks",
//   "https://www.sec.gov/edgar/searchedgar/companysearch",
//   "https://www.sec.gov/",
//   /////////////////////////////////////////
//   "https://www.masterworks.com/about/how-it-works/",
//   "https://www.masterworks.com/about/how-it-works/about/how-it-works",
//   "https://www.masterworks.com/about/how-it-works/about/why-art",
//   "https://www.masterworks.com/about/how-it-works/about/about-masterworks",
//   "https://www.masterworks.com/about/how-it-works/research",
//   "https://www.masterworks.com/about/how-it-works/trading",
//   "https://www.masterworks.com/about/how-it-works/art-challenge",
//   "https://www.masterworks.com/about/how-it-works/about/press",
//   "https://www.masterworks.com/about/how-it-works/transact-with-masterworks",
//   "https://www.masterworks.com/about/how-it-works/about/terms-of-use",
//   "https://www.masterworks.com/about/how-it-works/about/privacy",
//   "https://www.masterworks.com/about/how-it-works/about/disclosure",
//   ///////////////////////////////////////////
//   "https://www.masterworks.com/about/why-art/",
//   "https://www.masterworks.com/about/why-art/about/how-it-works       ",
//   "https://www.masterworks.com/about/why-art/about/why-art",
//   "https://www.masterworks.com/about/why-art/about/about-masterworks  ",
//   "https://www.masterworks.com/about/why-art/research",
//   "https://www.masterworks.com/about/why-art/trading",
//   "https://www.masterworks.com/about/why-art/art-challenge",
//   "https://www.masterworks.com/about/why-art/about/press",
//   "https://www.masterworks.com/about/why-art/transact-with-masterworks",
//   "https://www.masterworks.com/about/why-art/about/terms-of-use       ",
//   "https://www.masterworks.com/about/why-art/about/privacy",
//   "https://www.masterworks.com/about/why-art/about/disclosure",
//   "https://www.masterworks.com/about/why-art/about/disclosure#general-disclosure",
//   ///////////////////////////////////////////

//   "https://www.masterworks.com/about/about-masterworks/",
//   "https://www.masterworks.com/about/about-masterworks/about/how-it-works       ",
//   "https://www.masterworks.com/about/about-masterworks/about/why-art",
//   "https://www.masterworks.com/about/about-masterworks/about/about-masterworks  ",
//   "https://www.masterworks.com/about/about-masterworks/research",
//   "https://www.masterworks.com/about/about-masterworks/trading",
//   "https://www.masterworks.com/about/about-masterworks/art-challenge",
//   "https://www.masterworks.com/about/about-masterworks/about/press",
//   "https://www.masterworks.com/about/about-masterworks/transact-with-masterworks",
//   "https://www.masterworks.com/about/about-masterworks/about/terms-of-use       ",
//   "https://www.masterworks.com/about/about-masterworks/about/privacy",
//   "https://www.masterworks.com/about/about-masterworks/about/disclosure",
//   ///////////////////////////////////////////
//   "https://www.masterworks.com/trading/bulletin/",
//   "https://www.masterworks.com/trading/bulletin/about/how-it-works     ",
//   "https://www.masterworks.com/trading/bulletin/about/why-art",
//   "https://www.masterworks.com/trading/bulletin/about/about-masterworks",
//   "https://www.masterworks.com/trading/bulletin/research",
//   "https://www.masterworks.com/trading/bulletin/trading",
//   "https://www.masterworks.com/trading/bulletin/art-challenge",
//   "https://www.masterworks.com/trading/bulletin/about/press",
//   "https://www.masterworks.com/trading/bulletin/transact-with-masterworks",
//   "https://www.masterworks.com/trading/bulletin/about/terms-of-use",
//   "https://www.masterworks.com/trading/bulletin/about/privacy",
//   "https://www.masterworks.com/trading/bulletin/about/disclosure",
//   ///////////////////////////////////////////
//   ///////////////////////////////////////////
// ];
function urlExtracter(htmlBody, baseURL, currentURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  let urlObj;

  for (const linkElement of linkElements) {
    try {
      if (linkElement.href.slice(0, 1) === "/") {
        urlObj = new URL(`${baseURL}${linkElement.href}`);
      } else {
        urlObj = new URL(linkElement.href);
      }

      if (urls.includes(urlObj.href)) {
        // console.log("skipping the already included");
        continue;
      }

      console.log("currently being pushed: ", urlObj.href);
      urls.push(urlObj.href);
    } catch (err) {
      console.log(`error with  url: ${err.message}`);
    }
  }
  return urls;
}

function normalizeUrl(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeUrl,
  urlExtracter,
  crawlMyPage,
};
