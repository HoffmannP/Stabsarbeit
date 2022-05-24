<script>
    import { onMount } from 'svelte';
    import { entries, addEntry, setDtFormat, dtFormat } from './store'

    let input

    let start = new Date()
    let currentTime = new Date()

    onMount(async function () {
        setTimeout(function () {
            currentTime = new Date()
            setInterval(_ => (currentTime = new Date()), 60*1e3)
        }, 60050 - currentTime.getSeconds() * 1e3)
        input.focus()
    })

    async function checkSubmit (keypressEvent) {
        if (keypressEvent.key !== 'Enter') {
            return
        }
        addEntry({
            date: currentTime.getTime(),
            text: input.value.trim(),
        })
        if ($entries.length === 1) {
            start = new Date($entries[0].date)
        }
        this.value = ''

        if (currentTime.getDay() != start.getDay()) {
            setDtFormat({ weekday: 'short', hour: '2-digit', minute: '2-digit' })
        }
    }
</script>

<main>
    <table class="uk-table uk-table-striped">
        <tbody>
            {#each $entries as entry, index}
            <tr>
                <th class="uk-table-shrink">{index + 1}</th>
                <td class="uk-table-shrink">{$dtFormat.format(new Date(entry.date))}</td>
                <td>{entry.text}</td>
            </tr>
            {/each}
            <tr>
                <th class="uk-table-shrink">{$entries.length + 1}</th>
                <td class="uk-table-shrink uk-text-primary">{$dtFormat.format(currentTime)}</td>
                <td><input bind:this={input} type="text" on:keypress={checkSubmit}></td>
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