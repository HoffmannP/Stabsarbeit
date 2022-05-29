<script>
    import { onMount } from 'svelte';
    import { entries } from './tagebuch'
    import currentTime from './currentTime'
    import dtFormater from './dateTimeFormat'

    let input
    onMount(async function () {
        input.focus()
    })

    async function checkSubmit (keypressEvent) {
        if (keypressEvent.key !== 'Enter') {
            return
        }
        $entries = {
            date: $currentTime.getTime(),
            text: input.value.trim(),
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
    </style>
    <tbody>
        {#each $entries as entry, index}
        <tr>
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