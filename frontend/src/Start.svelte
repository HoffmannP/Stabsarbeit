<script>
    import { onMount } from "svelte"
    import UIkit from 'uikit'
    import currentTime from './currentTime'
    import { dateFormater } from './dateTimeFormat'
    import { MinusIcon, PlusIcon, PlayIcon } from 'svelte-feather-icons'

    let meta = []
    let addPropertyInput
    let modal
    let step = 3

    onMount(_ => {
        const uimodal = UIkit.modal(modal)
        uimodal.show()
        console.log(meta)
    })

    function inc () {
        step++
    }

    function direction(direction) {
        console.log(direction)
        inc()
    }

    function add() {
        meta = [...meta, addPropertyInput.value.trim()]
        addPropertyInput.value = ''
    }

    function remove(i) {
        meta = [...meta.slice(0, i), ...meta.slice(i + 1)]
    }

    function start() {

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
                    <form class="uk-form-horizontal">
                        <div class="uk-margin">
                            <label for="leader" class="uk-form-label">Einsatzleitung</label>
                            <div class="uk-form-controls">
                                <input id="leader" class="uk-input" type="text">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label for="writer" class="uk-form-label">Tagebuchführung</label>
                            <div class="uk-form-controls">
                                <input id="writer" class="uk-input" type="text">
                            </div>
                        </div>
                        {#each Array.from(meta) as prop, i}
                        <div class="uk-margin">
                            <label for={`id_${prop}`} class="uk-form-label">{prop}</label>
                            <div class="uk-form-controls uk-grid">
                                <input id={`id_${prop}`} class="uk-input uk-width-expand uk-margin-right" type="text">
                                <button type="button" class="uk-button uk-button-default" on:click={_ => remove(i)} style="padding-left:30px;">
                                    <MinusIcon size="20" />
                                </button>
                            </div>
                        </div>
                        {/each}
                        <div class="uk-margin">
                            <label class="uk-form-label" style="margin-top:0;">
                                <input bind:this={addPropertyInput} class="uk-input" type="text">
                            </label>
                            <div class="uk-form-controls">
                                <button type="button" class="uk-button uk-button-default" on:click={add}>
                                    <PlusIcon size="20" /> hinzufügen
                                </button>
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label for="date" class="uk-form-label">Datum</label>
                            <div class="uk-form-controls">
                                <input id="date" class="uk-input" type="text" value="{dateFormater($currentTime)}" disabled>
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label for="keyword" class="uk-form-label">Einsatzstichwort</label>
                            <div class="uk-form-controls">
                                <input id="keyword" class="uk-input" type="text">
                            </div>
                        </div>
                        <div>
                            <div class="uk-form-controls">
                                <button type="button" class="uk-button uk-button-primary" on:click={start}>
                                    <PlayIcon size="20" /> Tagebuch anlegen
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>