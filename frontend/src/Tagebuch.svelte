<script>
    import { afterUpdate } from 'svelte';
    import { entries } from './tagebuch'
    import filter from './filter'
    import currentTime from './currentTime'
    import dtFormater from './dateTimeFormat'

    let input
    afterUpdate(async function () {
        input.focus()
        window.scrollTo(0, document.body.scrollHeight);
    })

    $: hideEntry = (filter => function (entry) {
        if (filter === false) {
            return false
        }
        return !entry[filter.type].includes(filter.value)
    })($filter)

    async function checkSubmit (keypressEvent) {
        if (keypressEvent.key !== 'Enter') {
            return
        }
        $entries = {
            date: $currentTime.getTime(),
            text: this.value.trim(),
        }
        this.value = ''
    }
</script>

<table class="uk-table uk-table-striped">
    <style>
        unit {
            background-color: rgb(255 0 0 / 10%);
            padding: 0 0.2em;
            border-radius: 0.3em;
        }
        mission {
            background-color: rgb(0 0 255 / 10%);
            padding: 0 0.2em;
            border-radius: 0.3em;
        }
    </style>
    <tbody>
        {#each $entries as entry, index}
        <tr class:uk-text-muted={hideEntry(entry)} class:uk-text-small={hideEntry(entry)}>
            <th class="uk-table-shrink">{index + 1}</th>
            <td class="">{$dtFormater(new Date(entry.date))}</td>
            <td class="">{@html entry.text}</td>
        </tr>
        {/each}
        <tr>
            <th class="uk-table-shrink">{$entries.length + 1}</th>
            <td class="uk-text-primary">{$dtFormater($currentTime)}</td>
            <td><input bind:this={input} type="text" on:keypress={checkSubmit}></td>
        </tr>
    </tbody>
</table>

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