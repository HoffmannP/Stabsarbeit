<script>
    export let backend

    async function submit(submitEvent) {
        const method = 'POST'
        const body = new FormData(this)
        await fetch(`${backend}/login`, { method, body, credentials: 'include' }).then(j => j.json())
        document.location.hash = '#/home'
        return false
    }
</script>

<main>
    <h1>Login</h1>

    <form action="#/login" method="POST" on:submit|preventDefault={submit}>
        <legend for="username">Nutzername</legend>
        <input id="username" type="text" name="username" autocomplete="login"/>
        <legend for="password">Passwort</legend>
        <input id="password" type="password" name="password" autocomplete="current-password"/>
        <button>Einloggen</button>
    </form>

    <a href="#/register">Registrieren</a>
</main>

