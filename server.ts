import playwright, { Page } from 'playwright'
import fs from 'fs'

const scrabeJobIds = async (page: Page) => {
  const startUrl = 'https://ca.indeed.com/jobs?q=Software%20Engineer&l=North%20York%2C%20ON'

  let offset = 0
  const ids: Set<string> = new Set([])

  // stop when list is same size two loops in a row
  let previousSize = 0

  do {
      console.log('start')
      previousSize = ids.size
      await page.goto(startUrl + `&start=${offset}`, { waitUntil: 'load'})
      const newIds = await scrapeIdsFromCurrentPage(page)
      console.log('newIds', newIds)
      newIds.forEach(id => ids.add(id))
      offset += 10 
  } while (ids.size < 100)

  fs.writeFileSync('out/job-ids.json', JSON.stringify({ ids: Array.from(ids.values()) }, undefined, 2))

  return ids
}


const scrapeIdsFromCurrentPage = async (page: Page) => {
    const jobsList = await page.locator('.jobsearch-ResultsList li a')

    const jobIds = await jobsList.evaluateAll(list => list.map(el => el.getAttribute('data-jk')))

    return jobIds.filter(Boolean)
}

(async () => {
  const browser = await playwright.chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await scrabeJobIds(page)
  } catch(err) {
    console.error(err)
  }

  console.log('done')
})()