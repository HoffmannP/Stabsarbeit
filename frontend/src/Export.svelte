<script>
    import { utils as xlsxUtils, writeFile } from 'xlsx/xlsx.mjs'
    export let entries
    export let category = 'default'
    let dtFormatOptions = { dateStyle: 'short', timeStyle: 'short' }
    $: dtFormat = new Intl.DateTimeFormat('de-DE', dtFormatOptions)


    async function download () {
        console.log('Los gehts')
        const wb = xlsxUtils.book_new()
        const ws = xlsxUtils.aoa_to_sheet(
            [['Nummer', 'Zeitpunkt', 'Eintrag']].concat(
                entries.map((entry, index) => [index + 1, dtFormat.format(new Date(entry.date)), entry.text])
            )
        )
        xlsxUtils.book_append_sheet(wb, ws, 'Einsatztagebuch')
        writeFile(wb, 'Einsatztagebuch.xlsx', { bookType: 'xlsx' })
    }
</script>

<button class="uk-button {`uk-button-${category}`}" on:click={download}>
    <slot></slot>
</button>