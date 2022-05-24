<script>
    import { units } from './store'
</script>

<main>
    <h1>Einheiten</h1>
    <ul>
        {#each $units as unit, index}
        <li>{unit}</li>
        {/each}
    </ul>
</main>