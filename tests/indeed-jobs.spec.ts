import { test, expect } from '@playwright/test';
const fs = require('fs')

test('scrape indeed job ids', async ({ page }) => {
    const startUrl = 'https://ca.indeed.com/jobs?q=Software%20Engineer&l=North%20York%2C%20ON'

    let offset = 0
    const ids: Set<string> = new Set([])

    // stop when list is same size two loops in a row
    let previousSize = 0

    do {
        previousSize = ids.size
        await page.goto(startUrl + `&start=${offset}`)
        const newIds = await scrapeIdsFromCurrentPage(page)
        newIds.forEach(id => ids.add(id))
        offset += 10 
    } while (ids.size < 100)

    fs.writeFileSync('out/job-ids.json', JSON.stringify({ ids: Array.from(ids.values()) }, undefined, 2))

})

const scrapeIdsFromCurrentPage = async (page) => {
    const jobsList = await page.locator('.jobsearch-ResultsList li a')

    const jobIds = await jobsList.evaluateAll(list => list.map(el => el.getAttribute('data-jk')))

    return jobIds.filter(Boolean)
}


/*

    cy.get('.jobsearch-ResultsList li a')
      .then((lis) => {
        console.log('lis.length', lis.length)
        lis.each((i, li) => {
          console.log('li', li)
          ids.push(li.getAttribute('data-jk'))
        }) 
      })
      .then(() => {
        console.log('ids', ids.filter(id => !!id));
      })
  })

  */