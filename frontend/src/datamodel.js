import { writeable, get } from 'svelte/storage'
import { Storage } from './storage'

const unitRegExp = /\d+-\d\d-\d+/g

export class DataModel {
  construct (location = 'ClientIDB') {
    const storageProvider = Storage(location)
    this.storage = {
      Tagebuch: storageProvider(location)
    }
    this.memory = {
      Tagebuch: writeable([]),
      Units: writeable([]),
      TagebuchView: writeable([])
    }
  }

  async init () {
    this.memory.Tagebuch.set(await this.storage.Tagebuch.load())

    this.memory.Units.set(
      new Set(
        get(this.memory.Tagebuch).map((entry) =>
          [...entry.text.matchAll(unitRegExp)].map((m) => m[0])
        ).flat()
      )
    )
  }

  addTagebuch (entry) {
    const currentEntries = get(this.memory.Tagebuch)
    const currentUnits = get(this.memory.Units)

    currentEntries.push(entry)
    Array.from(entry.text.matchAll(unitRegExp)).map((m) => m[0])
      .forEach(unit => currentUnits.add(unit))

    this.memory.Tagebuch.set(currentEntries)
    this.memory.Units.set(currentUnits)

    this.storage.Tagebuch.add(currentEntries.length, entry)
  }

  extractor (regex, tagname) {
    return function (entryParts) {
      const parts = entryParts.map(part => part.split(unitRegExp)).flat()
      const matches = entryParts.map(part => Array.from(part.matchAll(unitRegExp))).flat().map(match => match[0])
      const construct = (parts, matches) => parts[0] + matches.map((match, index) => `<${tagname}>${match}</${tagname}>${parts[index + 1]}`).join()
      return (parts, matches, construct)
    }
  }
}
