<script>
    import { utils as xlsxUtils, writeFile } from 'xlsx/xlsx.mjs'
    import { entries } from './store.js'
    import dtFormater from './dateTimeFormat'
    export let priority = 'default'


    async function download () {
        const wb = xlsxUtils.book_new()
        const ws = xlsxUtils.aoa_to_sheet(
            [['Nummer', 'Zeitpunkt', 'Eintrag']].concat(
                $entries.map((entry, index) => [index + 1, $dtFormater(new Date(entry.date)), entry.text])
            )
        )
        xlsxUtils.book_append_sheet(wb, ws, 'Einsatztagebuch')
        writeFile(wb, 'Einsatztagebuch.xlsx', { bookType: 'xlsx' })
    }
</script>

<button class="uk-button {`uk-button-${priority}`}" on:click={download}>
    <slot></slot>
</button>