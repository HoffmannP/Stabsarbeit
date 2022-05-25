import { readable, derived, get } from 'svelte/store'
import { Client as ClientStorage } from './storage'

const storage = ClientStorage('Tagebuch')
export let addEntry
export const entries = readable([], set => {
  addEntry = function (entry) {
    const currentEntries = get(entries)
    storage.add(currentEntries.length, entry)
    currentEntries.push(entry)
    set(currentEntries)
  }
  storage.load().then(data => set(data))
})

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
