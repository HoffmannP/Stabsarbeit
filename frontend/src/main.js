import App from './App.svelte'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import 'uikit/dist/css/uikit.css'

UIkit.use(Icons)

const app = new App({
  target: document.body,
  props: {
    backend: 'http://localhost:5001'
  }
})

export default app
