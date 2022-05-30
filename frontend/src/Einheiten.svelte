<script>
    import { units } from './einheiten'
</script>

<div class="uk-container">
    <h3>Einheiten</h3>
    <ul>
        {#each $units as unit}
            <li>{unit}</li>
        {/each}
    </ul>
</div>

<style>

</style>