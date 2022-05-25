import { derived } from 'svelte/store'
import { entries } from './store.js'

const locales = 'de-DE'
const oneDayFormat = { timeStyle: 'short' }
const mulDayFormat = { weekday: 'short', hour: '2-digit', minute: '2-digit' }
let startDay = false
let currentFormatOneday = true
let formater = new Intl.DateTimeFormat(locales, oneDayFormat)
const doFormat = date => formater.format(date)

export default derived(
  entries,
  function (entries) {
    const last = entries.length - 1
    if (!startDay && last >= 0) {
      startDay = new Date(entries[0].date).getDay()
    }
    if (currentFormatOneday && (last > 0) && (startDay !== new Date(entries[last].date).getDay())) {
      currentFormatOneday = false
      formater = new Intl.DateTimeFormat(locales, mulDayFormat)
    }
    return doFormat
  }
)
