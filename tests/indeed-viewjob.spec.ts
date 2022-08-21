import { test } from '@playwright/test';
import keywords from '../keywords-script/out.json'
import extraKeywords from '../keywords-script/extra-keywords.json'
import synonymsList from '../keywords-script/synoyms.json'

const masterKeywords = [...keywords, ...extraKeywords]

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function isKeywordInText(k: string, text: string) {
  const regex1 = new RegExp(`[\ \,\.\:\n\/\()]${escapeRegExp(k.toLowerCase())}[\ \,\.\:\n\/\)]`)

  return regex1.exec(text.toLowerCase())
}

const parseKeywords = (jobDescriptionText: string) => {
  const result = new Set<string>()
  masterKeywords.forEach(k => {
    if (isKeywordInText(k, jobDescriptionText)) {
      result.add(k)
    }
  })

  Object.entries(synonymsList).forEach(([keyword, synonyms]) => {
    synonyms.forEach(s => {
      if (isKeywordInText(s, jobDescriptionText)) {
        result.add(keyword)
      }
    })
  })

  return Array.from(result)
}

test('scrape viewjob page', async ({ page }) => {
  const jobId1 = 'ecbb3a4e1408b26c'
  const jobId2 = '5f55437238c8fcc7'
  const jobId3 = 'a9f9ed259248e5cb'
  const jobId4 = '89ff9c47cf504485'

  await page.goto(`https://ca.indeed.com/viewjob?hl=en&jk=${jobId4}`)

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