require("dotenv").config();
const puppeteer = require("puppeteer");
const spauth = require("node-sp-auth");
(async () => {
  const pageUrl = process.env.PAGE_URL;
  const data = await spauth.getAuth(pageUrl, {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  // Add the authentication headers
  await page.setExtraHTTPHeaders(data.headers);
  // Set default viewport
  await page.setViewport({
    height: 2500,
    width: 1200
  });
  const startTime = new Date();
  // Open the page
  await page.goto(pageUrl, {
    waitUntil: "networkidle0"
  });
  const endTime = new Date();
  const diff = endTime - startTime;
  console.log("Navigating to Home, cold-start", diff);

  const startDocs = new Date();
  const docLinkSelector =
    ".ms-HorizontalNav > .ms-FocusZone > .ms-HorizontalNavItems > .ms-HorizontalNavItem:nth-child(4) > .ms-HorizontalNavItem-link";

  await page.waitForSelector(docLinkSelector);
  let pageNavigation = page.waitForNavigation();
  await page.click(docLinkSelector);
  await pageNavigation;
  const endDocs = new Date();
  console.log("navigating to docs", endDocs - startDocs);
  const homeLink =
    ".ms-Nav-navItem:nth-child(1) > .ms-Nav-compositeLink > .ms-Button > .ms-Button-flexContainer > .ms-Nav-linkText";
  await page.waitForSelector(homeLink);
  const startHome = new Date();
  pageNavigation = page.waitForNavigation();
  page.click(homeLink);
  await pageNavigation;
  const endHome = new Date();
  console.log("navigating to Home", endHome - startHome);
  await browser.close();
})();
