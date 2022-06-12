<script>
import Router from 'svelte-spa-router'
import { wrap } from 'svelte-spa-router/wrap'
import active from 'svelte-spa-router/active'

import NotFound from './NotFound.svelte'

import Start from './Start.svelte'
import Tagebuch from './Tagebuch.svelte'
import Einsätze from './Einsätze.svelte'
import Einheiten from './Einheiten.svelte'
import Filter from './Filter.svelte'
import Sync from './Sync.svelte'
import download from './download'
import { DownloadIcon } from 'svelte-feather-icons'

const globalProp = component => wrap({ component, props: {
    // backend = 'http://localhost:5001/api/v1'
}})

const routes = {
    '/': globalProp(Start),
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
                <Filter />
            </ul>
        </div>
        <div class="uk-navbar-right">
            <Sync />
            <button class="uk-navbar-item uk-button uk-button-link" on:click={download}>
                <DownloadIcon size="20" /> Download
            </button>
        </div>
    </nav>

    <Router {routes}/>
</main>

