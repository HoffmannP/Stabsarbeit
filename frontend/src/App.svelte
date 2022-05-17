<script>
import Router from 'svelte-spa-router'
import Login from './Login.svelte'
import Register from './Register.svelte'
import Home from './Home.svelte'

const routes = {
    '/login': Login,
    '/register': Register,
    '/home': Home,
    '*': Login
}
</script>

<main>
    <h1>App</h1>

    <Router {routes}/>
</main>

