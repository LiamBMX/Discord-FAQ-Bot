const puppeteer = require('puppeteer');
const fs = require('fs');
const { URL } = require('url');
const config = require('../config.json');

async function scrapeWebsite() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(config.website_url, { waitUntil: 'networkidle2' });
  
  const scrapedData = await page.evaluate(() => {
    const text = document.body.innerText;

    const anchors = Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }));

    const buttons = Array.from(document.querySelectorAll('button')).map(btn => ({
      text: btn.innerText.trim(),
      onclick: btn.getAttribute('onclick')
    }));

    return { text, anchors, buttons };
  });

  const baseDomain = new URL(config.website_url).hostname;
  const visited = new Set();

  async function recursiveScrape(url) {
    if (visited.has(url)) return null;
    visited.add(url);
    try {
      const newPage = await browser.newPage();
      await newPage.goto(url, { waitUntil: 'networkidle2' });
      const data = await newPage.evaluate(() => {
        return {
          text: document.body.innerText,
          anchors: Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.innerText.trim(),
            href: a.href
          })),
          buttons: Array.from(document.querySelectorAll('button')).map(btn => ({
            text: btn.innerText.trim(),
            onclick: btn.getAttribute('onclick')
          }))
        };
      });
      await newPage.close();
      return data;
    } catch (err) {
      console.error('Error scraping', url, err);
      return null;
    }
  }

  let linkedPages = [];
  for (const anchor of scrapedData.anchors) {
    try {
      const anchorUrl = new URL(anchor.href);
      if (anchorUrl.hostname === baseDomain && !visited.has(anchor.href)) {
        const pageData = await recursiveScrape(anchor.href);
        if (pageData) {
          linkedPages.push({ url: anchor.href, data: pageData });
        }
      }
    } catch (e) {
    }
  }

  await browser.close();

  const fullData = {
    base: scrapedData,
    linkedPages
  };

  if (!fs.existsSync('./data')) fs.mkdirSync('./data');
  fs.writeFileSync('./data/knowledge.json', JSON.stringify(fullData, null, 2), 'utf8');
  console.log("Website data scraped and stored in /data/knowledge.json");

  return fullData;
}

module.exports = { scrapeWebsite };
