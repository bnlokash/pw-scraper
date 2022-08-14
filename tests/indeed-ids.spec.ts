import { test, expect } from '@playwright/test';

test('scrape indeed job ids', async ({ page }) => {
    const startUrl = 'https://ca.indeed.com/jobs?q=Software%20Engineer&l=North%20York%2C%20ON'

    let offset = 0
    const ids: string[] = []

    await page.goto(startUrl)

    do {
        const newIds = await scrapeIdsFromCurrentPage(page)
        ids.push(...newIds)
        await page.goto(startUrl + `&start=${offset}`)
        offset += 10 
        console.log(new Set(ids).size)
    } while (true)

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