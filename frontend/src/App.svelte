<script>
import Router from 'svelte-spa-router'
import Login from './Login.svelte'
import Register from './Register.svelte'

const routes = {
    '/register': Register,
    '/login': Login,
    '*': Login
}
</script>

<main>
    <h1>App</h1>

    <Router {routes}/>
</main>

