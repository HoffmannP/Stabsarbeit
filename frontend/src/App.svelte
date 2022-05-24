<script>
import Router from 'svelte-spa-router'
import {wrap} from 'svelte-spa-router/wrap'
import NotFound from './NotFound.svelte'

import Tagebuch from './Tagebuch.svelte'
import Einsätze from './Einsätze.svelte'
import Einheiten from './Einheiten.svelte'
import Export from './Export.svelte'

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
            <a href="#/tagebuch" class="uk-button uk-button-default">Tagebuch</a>
            <a href="#/einsaetze" class="uk-button uk-button-default">Einsätze</a>
            <a href="#/einheiten" class="uk-button uk-button-default">Einheiten</a>
        </div>
        <div class="uk-navbar-right">
            <Export priority="default"><span uk-icon="download"></span> Download</Export>
        </div>
    </nav>

    <Router {routes}/>
</main>

