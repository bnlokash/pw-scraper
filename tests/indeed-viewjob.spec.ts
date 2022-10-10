import { test } from '@playwright/test';
import keywords from '../keywords-script/out.json'
import extraKeywords from '../keywords-script/extra-keywords.json'
import synonymsList from '../keywords-script/synoyms.json'
import { ids } from '../out/job-ids.json'
import fs from 'fs'

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

const scrapeJob = async (page: any, jobId: string) => {
  await page.goto(`https://ca.indeed.com/viewjob?hl=en&jk=${jobId}`)


  const jobTitle = await (await page.locator('.jobsearch-JobInfoHeader-title')).innerText()

  let companyName
  const doesCompanyNameLinkExist = await page.$('.jobsearch-InlineCompanyRating a')
  console.log(doesCompanyNameLinkExist)
  if (doesCompanyNameLinkExist) {
    companyName = await (await page.locator('.jobsearch-InlineCompanyRating a')).first().innerText()
  } else {
    companyName = await (await page.locator('.jobsearch-InlineCompanyRating-companyHeader')).first().innerText()
  }

  const location = await (await page.locator('.jobsearch-JobInfoHeader-subtitle.jobsearch-DesktopStickyContainer-subtitle > div:not(.jobsearch-InlineCompanyRating) > div')).first().innerText()

  // const jobType = await (await page.locator('span.jobsearch-JobMetadataHeader-item')).innerText()

  const jobDescriptionText = await (await (await page.locator('#jobDescriptionText')).allInnerTexts()).join('')

  const jdKeywords = parseKeywords(jobDescriptionText) 

  const final = {
    jobTitle,
    companyName,
    location,
    keywords: jdKeywords
  }

  return final
}

test('scrape viewjob page', async ({ page }) => {
  const result: Record<string, Object> = {}

  for(const id of ids) {
    const scraped = await scrapeJob(page, id)
    result[id] = scraped
  }

  fs.writeFileSync('out/scraped.json', JSON.stringify(result, undefined, 2))

  console.log('done')
})