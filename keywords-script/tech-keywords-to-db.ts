import techs from './out.json'
import synonyms from './synoyms.json'
import extra from './extra-keywords.json'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getKeywordCreates (tech: string){
  const syns = synonyms[tech]

  const result = [{name: tech}]

  if (syns) {
    syns.forEach(s => result.push({name: s}))
  }
  
  return  result
}

async function main() {
  for (const tech of [...techs, ...extra]) {
    await prisma.tech.create({
      data: {
        name: tech,
        keywords: {
          create: getKeywordCreates(tech)
        }
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })