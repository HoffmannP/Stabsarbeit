<script>
    import { entries, onNewEntry } from './tagebuch'
    import { SyncSender, SyncReceiver } from './sync'
    import UIkit from 'uikit'

    let modalElement
    let direction = 'receive'

    async function startSync () {
        const form = new FormData(this)
        const password = form.get('password')
        switch (form.get('direction')) {
            case 'send':
                const se = new SyncSender(password)
                await se.init(entries)
                onNewEntry(newEntry => {
                    console.log(newEntry)
                    return se.add(newEntry)
                })
                break
            case 'receive':
                const uri = form.get('uri').trim()
                console.log(uri)
                const rc = new SyncReceiver(uri, password)
                console.log(rc)
                rc.addEventListener('newEntry', newEntryEvent => {
                    console.log(newEntryEvent.detail)
                    ($entries = newEntryEvent.detail)
                })
                break
        }
        UIkit.modal(modalElement).hide()
    }
</script>

<button uk-toggle="target: #sync-settings" type="button" class="uk-navbar-item uk-button uk-button-link">Sync</button>
<div bind:this={modalElement} id="sync-settings" uk-modal>
    <div class="uk-margin-auto-vertical uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Synchronisierungseinstellungen</h2>
        <form on:submit|preventDefault={startSync} class="uk-form-controls-text">
            <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                <label><input class="uk-radio" bind:group={direction} type="radio" value="send" name="direction"> Tagebuchführer</label>
                <label><input class="uk-radio" bind:group={direction} type="radio" value="receive" name="direction"> Beobachter</label>
            </div>
            {#if direction == 'receive'}
            <label class="uk-form-label">
                PeerId <input class="uk-input" name="uri" autocomplete="uri" type="text">
            </label>
            {/if}
            <input class="uk-input" name="username" autocomplete="username" type="text" value="Stabsarbeit" style="display:none">
            <label class="uk-form-label">
                Passwort <input class="uk-input" name="password" autocomplete="current-password" type="password">
            </label>
            <p class="uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">Abbrechen</button>
                <button class="uk-button uk-button-primary" type="submit">Speichern</button>
            </p>
        </form>
    </div>
</div>