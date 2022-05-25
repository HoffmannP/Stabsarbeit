import { utils as xlsxUtils, writeFile } from 'xlsx/xlsx.mjs'
import { get } from 'svelte/store'
import { entries } from './store'
import dtFormater from './dateTimeFormat'

export default async function () {
  const wb = xlsxUtils.book_new()
  const ws = xlsxUtils.aoa_to_sheet(
    [['Nummer', 'Zeitpunkt', 'Eintrag']].concat(
      get(entries).map((entry, index) => [index + 1, get(dtFormater)(new Date(entry.date)), entry.text])
    )
  )
  xlsxUtils.book_append_sheet(wb, ws, 'Einsatztagebuch')
  writeFile(wb, 'Einsatztagebuch.xlsx', { bookType: 'xlsx' })
}
