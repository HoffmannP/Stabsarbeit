<script>
    import { units } from './store'
</script>

<ul>
    {#each $units as unit, index}
        <li>{unit}</li>
    {/each}
</ul>