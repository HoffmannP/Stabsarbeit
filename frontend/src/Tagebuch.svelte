<script>
    import Export from './Export.svelte'
    import { onMount } from 'svelte';
    import { Client as ClientStorage } from './storage'

    export let params = {}
    export let backend = ''
    const storage = ClientStorage('Tagebuch')
    let entries = []
    let index = 0
    let input

    let start = new Date()
    let dtFormatOptions = { timeStyle: 'short' }
    $: dtFormat = new Intl.DateTimeFormat('de-DE', dtFormatOptions)
    let currentTime = new Date()

    onMount(async function () {
        setTimeout(function () {
            currentTime = new Date()
            setInterval(_ => (currentTime = new Date()), 60*1e3)
        }, 60050 - currentTime.getSeconds() * 1e3)
        input.focus()
        entries = await storage.load()
        index = entries.length
    })

    async function checkEntry (keypressEvent) {
        if (keypressEvent.key !== 'Enter') {
            return
        }
        entries[index] = {
            date: currentTime.getTime(),
            text: input.value.trim()
        }
        this.value = ''
        storage.add(index, entries[index])

        if (index === 0) {
            start = new Date(entries[0].date)
        }
        if (currentTime.getDay() != start.getDay()) {
            dtFormatOptions = { weekday: 'short', hour: '2-digit', minute: '2-digit' }
        }
        index++
    }
</script>

<main>
    <nav class="uk-navbar-container" uk-navbar uk-sticky>
        <div class="uk-navbar-left">
            <a href="/tagebuch" class="uk-button uk-button-default">Tagebuch</a>
            <a href="/einsatz" class="uk-button uk-button-default">Einsätze</a>
            <a href="/einheit" class="uk-button uk-button-default">Einheiten</a>
        </div>
        <div class="uk-navbar-right">
            <Export {entries}><span uk-icon="download"></span> Download</Export>
        </div>
    </nav>
    <table class="uk-table uk-table-striped">
        <tbody>
            {#each entries as entry, index}
            <tr>
                <th class="uk-table-shrink">{index + 1}</th>
                <td class="uk-table-shrink">{dtFormat.format(new Date(entry.date))}</td>
                <td>{entry.text}</td>
            </tr>
            {/each}
            <tr>
                <th class="uk-table-shrink">{index + 1}</th>
                <td class="uk-table-shrink uk-text-primary">{dtFormat.format(currentTime)}</td>
                <td><input bind:this={input} type="text" on:keypress={checkEntry}></td>
            </tr>
        </tbody>
    </table>
</main>

<style>
    table input {
        margin: 0;
        padding: 0;
        background: transparent;
        border: none;
        width: 100%;
        font-size: 1.2em;
    }
    table input:focus-visible {
        outline: none;
    }
</style>