<script>
import { onMount } from "svelte";
    export let params = {}
    export let backend = ''
    let entries = []
    let index = 0
    let input

    let start = new Date()
    let dtFormatOptions = { timeStyle: "short" }
    $: dtFormat = new Intl.DateTimeFormat('de-DE', dtFormatOptions)
    let currentTime = new Date()

    onMount(function () {
        setTimeout(function () {
            currentTime = new Date()
            setInterval(_ => (currentTime = new Date()), 60000)
        }, 60050 - currentTime.getSeconds() * 1000)
        input.focus()
    })

    async function checkEntry (keypressEvent) {
        if (keypressEvent.key !== 'Enter') {
            return
        }
        entries[index] = {
            date: currentTime,
            text: input.value.trim()
        }
        this.value = ''

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
    <table class="uk-table uk-table-striped">
        <tbody>
            {#each entries as entry, id}
            <tr>
                <th class="uk-table-shrink">{id}</th>
                <td class="uk-table-shrink">{dtFormat.format(new Date(entry.date))}</td>
                <td>{entry.text}</td>
            </tr>
            {/each}
            <tr>
                <th class="uk-table-shrink">{index}</th>
                <td class="uk-table-shrink">{dtFormat.format(currentTime)}</td>
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