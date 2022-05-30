import { writable } from 'svelte/store'
import { onNewEntry } from './tagebuch'

const MARKER = 'E!'
const NUMERIC = '\\d+'
const TEXTUAL = '[^)]+'

const splitter = new RegExp(`${MARKER}(?:\\(${TEXTUAL}\\)|${NUMERIC})`, 'g')
const matcher = new RegExp(`${MARKER}(?:\\((${TEXTUAL})\\)|(${NUMERIC}))`, 'g')
const tagname = 'mission'

const missionMap = new Map()
const missionRemap = new Map()
const missionsWritable = writable([])

onNewEntry(function (newEntry) {
  const parts = newEntry.text.split(splitter)
  const matches = [...newEntry.text.matchAll(matcher)].map((match) => match[1] || match[2]).map(function (mission) {
    if (isFinite(mission)) {
      mission -= 1
      if (missionMap.has(mission)) {
        return [mission, missionMap.get(mission)]
      }
      const text = '<i>Einsatz nicht gefunden</i>'
      missionMap.set(mission, text)
      missionRemap.set(text, mission)
      return [mission, text]
    }
    if (missionRemap.has(mission)) {
      return [missionRemap.get(mission), mission]
    }
    const key = missionMap.size
    missionMap.set(key, mission)
    missionRemap.set(mission, key)
    return [key, mission]
  })
  missionsWritable.set([...missionMap])
  const processed = parts[0] + matches.map(
    ([key, mission], index) => `<${tagname}>${MARKER}${key + 1}: ${mission}</${tagname}>${parts[index + 1]}`
  ).join()
  return { ...newEntry, text: processed, missions: matches.map(([key, mission]) => key) }
})

export const missions = { subscribe: missionsWritable.subscribe }
