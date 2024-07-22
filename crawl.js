const { JSDOM } = require("jsdom");

function getUrlsFromHTML(htmlBody, baseUrl) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObJ = new URL(`${baseUrl}${linkElement.href}`);
        urls.push(urlObJ.href);
      } catch (err) {
        console.log(`error with relative url: ${err.message}`);
      }
    } else {
      // aboslute
      try {
        const urlObJ = new URL(linkElement.href);
        urls.push(urlObJ.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
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
  getUrlsFromHTML,
};
