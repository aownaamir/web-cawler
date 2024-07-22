const { normalizeUrl, getUrlsFromHTML } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("normalizeUrl strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});
test("normalizeUrl strip http", () => {
  const input = "http://blog.boot.dev/path";
  const actual = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});
test("normalizeUrl strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});
test("normalizeUrl capitals", () => {
  const input = "https://BLOG.boot.dev/path";
  const actual = normalizeUrl(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getUrlsFromHTML absolute", () => {
  const inputHTMLBody = `<html>
                    <body>
                        <a href="https://blog.boot.dev/path/">
                            Boot.dev Blog
                        </a>
                    </body>
                </html>`;
  const inputBaseUrl = "https://blog.boot.dev/path/";
  const actual = getUrlsFromHTML(inputHTMLBody, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getUrlsFromHTML relative", () => {
  const inputHTMLBody = `<html>
                    <body>
                        <a href="/path/">
                            Boot.dev Blog
                        </a>
                    </body>
                </html>`;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getUrlsFromHTML(inputHTMLBody, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getUrlsFromHTML both", () => {
  const inputHTMLBody = `<html>
                    <body>
                        <a href="https://blog.boot.dev/path1/">
                            Boot.dev Blog Path 1
                        </a>
                        <a href="/path2/">
                            Boot.dev Blog Path 2
                        </a>
                    </body>
                </html>`;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getUrlsFromHTML(inputHTMLBody, inputBaseUrl);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getUrlsFromHTML invalid", () => {
  const inputHTMLBody = `<html>
                      <body>
                          <a href="invalid">
                              Invalid Url
                          </a>
                      </body>
                  </html>`;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getUrlsFromHTML(inputHTMLBody, inputBaseUrl);
  const expected = [];
  expect(actual).toEqual(expected);
});
