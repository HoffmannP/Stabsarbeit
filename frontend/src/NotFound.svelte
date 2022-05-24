<script>
    export let params

    setTimeout(
        _ => document.location.hash = '/tagebuch',
        1000
    )
</script>

<main>
    <h1>404 NotFound - {params.wild}</h1>
</main>