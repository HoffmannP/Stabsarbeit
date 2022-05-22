<script>
import Router from 'svelte-spa-router'
import {wrap} from 'svelte-spa-router/wrap'

import Login from './Login.svelte'
import Register from './Register.svelte'
import Home from './Home.svelte'

export let backend
const globalProp = component => wrap({ component, props: { backend } })

const routes = {
    '/login': globalProp(Login),
    '/register': globalProp(Register),
    '/home': globalProp(Home),
    '*': globalProp(Login)
}
</script>

<main>
    <Router {routes}/>
</main>

