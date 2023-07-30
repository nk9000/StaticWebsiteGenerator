const fs = require('fs');
const axios = require('axios');
const ejs = require('ejs');

const apiUrl = 'https://www.boredapi.com/api/activity'; 

async function fetchData() {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Generate 10 unique pages
async function generatePages() {
  const pages = [];
  for (let i = 1; i <= 10; i++) {
    const data = await fetchData();
    if (data) {
      pages.push({ pageId: i, data });
    }
  }
  return pages;
}

// Render each page using EJS template and write to file
async function renderPages(pages) {
  const template = fs.readFileSync('./views/page.ejs', 'utf-8');
  for (const page of pages) {
    const renderedPage = ejs.render(template, { page });
    fs.writeFileSync(`./generated-pages/page${page.pageId}.html`, renderedPage);
  }
}

// Main function to generate and render pages
async function main() {
  try {
    const pages = await generatePages();
    await renderPages(pages);
    console.log('Pages generated successfully!');
  } catch (error) {
    console.error('Error generating pages:', error);
  }
}

main();
