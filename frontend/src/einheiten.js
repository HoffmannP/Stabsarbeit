import { readable } from 'svelte/store'
import { entries } from './tagebuch'

const unitRegExp = /\d+-\d\d-\d+/g




const deployRegExp = /E!\([^)]+\)/g
extractor (regex, tagname) {
  return function (entryParts) {
    const parts = entryParts.map(part => part.split(unitRegExp)).flat()
    const matches = entryParts.map(part => Array.from(part.matchAll(unitRegExp))).flat().map(match => match[0])
    const construct = (parts, matches) => parts[0] + matches.map((match, index) => `<${tagname}>${match}</${tagname}>${parts[index + 1]}`).join()
    return (parts, matches, construct)
  }
}
