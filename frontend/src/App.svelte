<script>
import Router from 'svelte-spa-router'
import {wrap} from 'svelte-spa-router/wrap'

import Tagebuch from './Tagebuch.svelte'

export let backend
const globalProp = component => wrap({ component, props: { backend } })

const routes = {
    '/*': globalProp(Tagebuch)
}
</script>

<main>
    <Router {routes}/>
</main>

