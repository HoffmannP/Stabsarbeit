import { writable } from 'svelte/store'
import { onNewEntry } from './tagebuch'

const matcher = /\d+-\d\d-\d+/g
const tagname = 'unit'

const unitsSet = new Set()
const unitsWritable = writable([])

onNewEntry(function (newEntry) {
  const parts = newEntry.text.split(matcher)
  const matches = [...newEntry.text.matchAll(matcher)].map((match) => match[0])
  matches.forEach((unit) => unitsSet.add(unit))
  unitsWritable.set([...unitsSet])
  const processed = parts[0] + matches.map((match, index) => `<${tagname}>${match}</${tagname}>${parts[index + 1]}`).join()
  return { ...newEntry, text: processed }
})

export const units = { subscribe: unitsWritable.subscribe }
