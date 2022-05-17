<script>
async function submit(submitEvent) {
    const method = 'POST'
    const body = new FormData(this)
    const response = await fetch('https://localhost:5002/register', { method, body }).then(j => j.json())
    document.location.hash = '#/login'
    return false
}
</script>

<main>
    <h1>Registrieren</h1>

    <form action="#/register" method="POST" on:submit|preventDefault={submit}>
        <legend for="username">Nutzername</legend>
        <input id="username" type="text" name="username" autocomplete="login"/>
        <legend for="name">Voller Name</legend>
        <input id="name" type="text" name="name" />
        <legend for="password">Passwort</legend>
        <input id="password" type="password" name="password" autocomplete="new-password"/>
        <button>Registrieren</button>
    </form>

    <a href="#/login">Login</a>
</main>