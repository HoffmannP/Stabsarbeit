<script>
async function submit(submitEvent) {
    const method = 'POST'
    const body = new FormData(this)
    const response = await fetch('http://localhost:5001/register', { method, body }).then(j => j.json())
    document.location.hash = '#/login'
    return false
}
</script>

<main>
    <h1>Registrieren</h1>

    <form action="#/register" method="POST" on:submit|preventDefault={submit}>
        <legend for="username">Nutzername</legend>
        <input id="username" type="text" name="username" autocomplete="login"/>
        <legend for="username">Passwort</legend>
        <input id="password" type="password" name="password" autocomplete="new-password"/>
        <button>Registrieren</button>
    </form>
</main>