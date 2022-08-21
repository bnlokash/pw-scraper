var fs = require('fs').promises;
var { parse } = require('csv-parse/sync');

const properties = [
  'LanguageHaveWorkedWith',
  'LanguageWantToWorkWith', 
  'DatabaseHaveWorkedWith',
  'DatabaseWantToWorkWith',
  'PlatformHaveWorkedWith',
  'PlatformWantToWorkWith',
  'WebframeHaveWorkedWith',
  'WebframeWantToWorkWith',
  'MiscTechHaveWorkedWith', 
  'MiscTechWantToWorkWith',
  'ToolsTechHaveWorkedWith',
  'ToolsTechWantToWorkWith',
  'NEWCollabToolsHaveWorkedWith',
  'NEWCollabToolsWantToWorkWith',
  'VersionControlSystem',
  'OfficeStackAsyncHaveWorkedWith',
  'OfficeStackAsyncWantToWorkWith',
  'OfficeStackSyncHaveWorkedWith',
  'OfficeStackSyncWantToWorkWith'
]

const getKeywordsFromRecordProperty = (record: { [key: string]: string}, propertyName: string) => {
  return record[propertyName]?.split(';')
}

(async function () {
    const fileContent = await fs.readFile(__dirname+'/survey_results_public.csv');
    const records = parse(fileContent, {columns: true});

    const keywords = new Set()
    records?.forEach(r => {
      properties?.forEach(p => {
        const keywordsFromProperty = getKeywordsFromRecordProperty(r, p)
        keywordsFromProperty?.forEach(k => {
          keywords.add(k)
        })
      })
    })

    console.log(keywords)

    await fs.writeFile(__dirname+'/out.json', JSON.stringify(Array.from(keywords)))
})();