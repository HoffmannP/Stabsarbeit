import { writeable } from 'svelte/store'
import { ClientIndexDB } from './storage'

const currentProcessedEntries = []

const processedEntries = writeable([])

const rawStorage = new ClientIndexDB('Tagebuch')
const rawSubscribers = new Set()
export const rawEntries = []
rawEntries.subscribe = function (subscriber) {
  rawSubscribers.add(subscriber)
  return _ => rawSubscribers.delete(subscriber)
}
rawEntries.set = function (newEntry) {
  rawStorage.add(rawEntries.length, newEntry)
  rawEntries.push(newEntry)

  let modifiedEntry = newEntry
  for (const subscriber in rawSubscribers) {
    modifiedEntry = subscriber(modifiedEntry)
  }

  currentProcessedEntries.push(modifiedEntry)
  processedEntries.set(currentProcessedEntries)
}

export const entries = {
  set: rawEntries.set,
  subscribe: processedEntries.subscribe
}

window.setTimeout(_ => rawStorage.load().then(data => data.forEach(date => rawEntries.set(date))), 0)
