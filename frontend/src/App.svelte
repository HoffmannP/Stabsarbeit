<script>
import Router from 'svelte-spa-router'
import { wrap } from 'svelte-spa-router/wrap'
import active from 'svelte-spa-router/active'

import NotFound from './NotFound.svelte'

import Tagebuch from './Tagebuch.svelte'
import Einsätze from './Einsätze.svelte'
import Einheiten from './Einheiten.svelte'
import download from './download'

const globalProp = component => wrap({ component, props: {
    // backend = 'http://localhost:5001/api/v1'
}})

const routes = {
    '/tagebuch': globalProp(Tagebuch),
    '/einsaetze': globalProp(Einsätze),
    '/einheiten': globalProp(Einheiten),
    '*': globalProp(NotFound)
}
</script>

<main>
    <nav class="uk-navbar-container" uk-navbar uk-sticky>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
                <li use:active={{path: '/tagebuch',  className: 'uk-active'}}><a href="#/tagebuch">Tagebuch</a></li>
                <li use:active={{path: '/einsaetze', className: 'uk-active'}}><a href="#/einsaetze">Einsätze</a></li>
                <li use:active={{path: '/einheiten', className: 'uk-active'}}><a href="#/einheiten">Einheiten</a></li>
            </ul>
        </div>
        <div class="uk-navbar-right">
            <button class="uk-navbar-item uk-logo" on:click={download}>
                <span uk-icon="download"></span> Download
            </button>
        </div>
    </nav>

    <Router {routes}/>
</main>

