import { readable, derived, get } from 'svelte/store'
import { Client as ClientStorage } from './storage'

const storage = ClientStorage('Tagebuch')
export let addEntry
export let initEntries
export const entries = readable([], async set => {
  addEntry = function (entry) {
    const currentEntries = get(entries)
    storage.add(currentEntries.length, entry)
    currentEntries.push(entry)
    set(currentEntries)
  }
  set(await storage.load())
})

export let setDtFormat
export const dtFormatOptions = readable({ timeStyle: 'short' }, set => {
  setDtFormat = format => set(format)
})
export const dtFormat = derived(
  dtFormatOptions,
  options => new Intl.DateTimeFormat('de-DE', options)
)

const unitRegExp = /\d+-\d\d-\d+/g
export const units = derived(
  entries,
  entries => Array.from(
    new Set(
      entries.map(
        entry => [...entry.text.matchAll(unitRegExp)].map(m => m[0])
      ).flat()
    )
  )
)
