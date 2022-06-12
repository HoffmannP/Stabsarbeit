<script>
    import { onMount } from "svelte"
    import UIkit from 'uikit'
    import currentTime from './currentTime'
    import { dateFormater } from './dateTimeFormat'
    import { PlusIcon, MinusIcon } from 'svelte-feather-icons'

    const meta = {}
    let modal
    let step = 3

    onMount(_ => {
        const uimodal = UIkit.modal(modal)
        uimodal.show()
    })

    function inc () {
        step++
    }

    function direction(direction) {
        console.log(direction)
        inc()
    }

    function add() {
        meta[`Eigenschaft ${Object.values(meta).length}`] = ""
    }

    function remove(name) {
        delete meta[name]
    }
    /*
    Workflow: Prüfen ob alte Einsatzdaten vorhanden sind
    ja: fortsetzen?
        ja: Einsatz mit bekanntem Stichwort fortsetzen
        nein: vorhandene Daten löschen
    Modus abfragen:
        Schreiber:
            Abfrage Einsatzstichwort/Ort
            Soll synchronisiert werden?
            ja: Synchro starten
        Leser:
            Synchro starten
    */

</script>
<div bind:this={modal} class="uk-modal-full" uk-modal>
    <div class="uk-modal-dialog">
        <div class="uk-grid-collapse uk-flex-middle" uk-grid>
            <div class="uk-width-1-4 uk-background-cover" style="background-image: url('fire-fighters.webp');" uk-height-viewport></div>
            <div class="uk-width-expand uk-padding-large">
                <h1>Einsatztagebuch</h1>
                <div class="procede" class:uk-hidden={step != 1}>
                    <p class="uk-text-lead">
                        Es wurden Tagebucheinträge eines laufenden Einsatzes gefunden
                    </p>
                    <button class="uk-button uk-button-primary uk-margin-right">
                        Vorhandenen Einsatz fortsetzen
                    </button>
                    <button class="uk-button uk-button-secondary" on:click={inc}>
                        Neuen Einsatz starten
                    </button>
                </div>
                <div class="direction" class:uk-hidden={step != 2}>
                    <p class="uk-text-lead">
                        Tagebuch nutzen als
                    </p>
                    <label on:click|self={_ => direction("write")} class="uk-button uk-button-primary uk-margin-right">
                        <input class="uk-hidden" type="radio" value="write" name="direction">
                        Tagebuchschreiber
                    </label>
                    <label on:click|self={_ => direction("read")} class="uk-button uk-button-secondary">
                        <input class="uk-hidden" type="radio" value="read" name="direction">
                        Leser/Beobachter
                    </label>
                </div>
                <div class="metainformation" class:uk-hidden={step != 3}>
                    <p class="uk-text-lead">Einsatz anlegen</p>
                    <form class="uk-form-stacked">
                        <label class="uk-form-label">
                            Einsatzleitung <input class="uk-input" type="text">
                        </label>
                        <label class="uk-form-label">
                            Tagebuchführung <input class="uk-input" type="text">
                        </label>
                        <label class="uk-form-label">
                            Datum <input class="uk-input" type="text" value="{dateFormater($currentTime)}" disabled>
                        </label>
                        <label class="uk-form-label">
                            Einsatzstichwort <input class="uk-input" type="text">
                        </label>
                        {#each Object.entries(meta) as name, value}
                            <label class="uk-form-label">
                                <span editable>{{name}}</span> <input class="uk-input" type="text" value="{value}">
                            </label>
                            <button type="button" class="uk-button uk-button-default uk-button-small" on:click={remove(name)}><MinusIcon size="20" /></button>
                        {/each}
                        <button type="button" class="uk-button uk-button-default uk-button-small" on:click={add()}>
                            <PlusIcon size="20" /> weitere Zeile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>