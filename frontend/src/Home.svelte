<script>
    import { onMount } from 'svelte'

    let username
    let user

    onMount(loadData)

    async function loadData() {
        const response = await fetch('https://localhost:5002/home', { credentials: 'include' })
        if (!response.ok) {
            document.location.hash = '#'
            return
        }
        ({user, username} = await response.json())
    }
    </script>

    <main>
        <h1>Home</h1>

        <dl>
            <dt>Nutzername</dt>
            <dd>{username}</dd>
            <dt>Name</dt>
            <dd>{user}</dd>
        </dl>
    </main>

