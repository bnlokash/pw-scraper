import { test } from '@playwright/test';
import keywords from '../keywords-script/out.json'
import extraKeywords from '../keywords-script/extra-keywords.json'

const masterKeywords = [...keywords, ...extraKeywords]

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const parseKeywords = (jobDescriptionText: string) => {
  const result = new Set<string>()
  masterKeywords.forEach(k => {
    const regex1 = new RegExp(`[\ \,\.\:\n\/]${escapeRegExp(k.toLowerCase())}[\ \,\.\:\n\/]`)
    const regex2 = new RegExp(`${escapeRegExp(k.toLowerCase())}[\ \,\.\:\n]`)

    const isKeywordInText =
      regex1.exec(jobDescriptionText.toLowerCase())
      || regex2.exec(jobDescriptionText.toLowerCase())

    if (isKeywordInText) {
      result.add(k)
    }
  })
  return Array.from(result)
}

test('scrape viewjob page', async ({ page }) => {
  const jobId1 = 'ecbb3a4e1408b26c'
  const jobId2 = '5f55437238c8fcc7'

  await page.goto(`https://ca.indeed.com/viewjob?hl=en&jk=${jobId2}`)

  const jobTitle = await (await page.locator('.jobsearch-JobInfoHeader-title')).innerText()

  const companyName = await (await page.locator('.jobsearch-InlineCompanyRating a')).first().innerText()

  const location = await (await page.locator('.jobsearch-JobInfoHeader-subtitle.jobsearch-DesktopStickyContainer-subtitle > div:not(.jobsearch-InlineCompanyRating) > div')).innerText()

  // const jobType = await (await page.locator('span.jobsearch-JobMetadataHeader-item')).innerText()

  const jobDescriptionText = await (await (await page.locator('#jobDescriptionText')).allInnerTexts()).join('')

  const jdKeywords = parseKeywords(jobDescriptionText) 

  const final = {
    jobTitle,
    companyName,
    location,
    keywords: jdKeywords
  }
  console.log(final)

  await page.pause()
})