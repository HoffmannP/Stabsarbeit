<script>
    import { missions } from './einsätze'
</script>

<div class="uk-container">
    <h3>Einsätze</h3>
    <ol>
        {#each $missions as [index, mission]}
            <li>{mission}</li>
        {/each}
    </ol>
</div>

<style>

</style>