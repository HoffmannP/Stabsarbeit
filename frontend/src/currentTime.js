import { readable } from 'svelte/store'

export default readable(new Date(), set => {
  setTimeout(
    function () {
      set(new Date())
      setInterval(_ => set(new Date()), 60 * 1e3)
    },
    60050 - (new Date()).getSeconds() * 1e3
  )
})
