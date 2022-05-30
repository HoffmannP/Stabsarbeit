<script>
    import filter from './filter'
    import { units } from './einheiten'
    import { missions } from './einsätze'
    import { FilterIcon } from 'svelte-feather-icons'

    let activeFilter = false
    let dropdownElement

    function filterUnit(unit) {
        activeFilter = `u:${unit}`
        $filter = { type: 'units', value: unit }
        dropdownElement.classList.remove('uk-open')
    }
    function filterMission(missionIndex) {
        activeFilter = `m:${missionIndex}`
        $filter = { type: 'missions', value: missionIndex }
        dropdownElement.classList.remove('uk-open')
    }
    function noFilter() {
        activeFilter = false
        $filter = false
        dropdownElement.classList.remove('uk-open')
    }
</script>

<li>
    <button class="uk-navbar-item uk-button uk-button-link" class:uk-text-primary={$filter}>
        <FilterIcon size="20" /> Filter
    </button>
    <div bind:this={dropdownElement} class="uk-navbar-dropdown">
        <ul class="uk-nav uk-navbar-dropdown-nav">
            <li class="uk-nav-header">Einheiten</li>
            {#each $units as unit}
            <li class:uk-active={activeFilter == `u:${unit}`}>
                <button on:click={filterUnit(unit)} class="uk-button uk-button-link">{unit}</button>
            </li>
            {/each}
            <li class="uk-nav-header">Einsätze</li>
            {#each $missions as [index, mission]}
            <li class:uk-active={activeFilter == `m:${index}`}>
                <button on:click={filterMission(index)} class="mission uk-button uk-button-link">{mission}</button>
            </li>
            {/each}
            <li class="uk-nav-divider"></li>
            <li><button on:click={noFilter} class="uk-button uk-button-link">kein Filter</button></li>
        </ul>
    </div>
</li>

<style>
    button.uk-navbar-item {
        color: #999;
        text-transform: uppercase;
        transition: 0.1s ease-in-out;
        transition-property: color, background-color;
    }
    .uk-navbar-dropdown-nav > li > button {
        color: #999;
    }
    .uk-navbar-dropdown-nav > li.uk-active > button {
        color: #222;
    }
    .uk-navbar-dropdown-nav > li > button:hover {
        color: #666;
    }
    .uk-nav > li > button {
        padding: 5px 0;
    }
    .uk-nav li > button {
        display: flex;
        align-items: center;
        column-gap: 0.25em;
        text-decoration: none;
    }
    button.uk-button.mission {
        text-transform: none;
    }
</style>