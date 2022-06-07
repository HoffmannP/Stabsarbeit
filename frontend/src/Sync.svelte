<script>
    import { entries, onNewEntry, switchToReadMode } from './tagebuch'
    import { SyncSender, SyncReceiver } from './sync'
    import UIkit from 'uikit'

    let modalElement
    let direction = 'receive'

    async function startSync () {
        const form = new FormData(this)
        const name = form.get('uri').trim()
        const password = form.get('password')
        switch (form.get('direction')) {
            case 'send':
                const se = new SyncSender(name, password)
                await se.init(entries)
                onNewEntry(newEntry => se.add(newEntry))
                break
            case 'receive':
                await switchToReadMode()
                const rc = new SyncReceiver(name, password)
                rc.addEventListener('newEntry', newEntryEvent => {
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
            <label class="uk-form-label">
                Tagebuchname <input class="uk-input" name="uri" autocomplete="uri" type="text" placeholder="Einsatzort" required minlength="2">
            </label>
            <input class="uk-input" name="username" autocomplete="username" type="text" value="Stabsarbeit" style="display:none">
            <label class="uk-form-label">
                Passwort <input class="uk-input" name="password" autocomplete="current-password" type="password" required minlength="6">
            </label>
            <p class="uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">Abbrechen</button>
                <button class="uk-button uk-button-primary" type="submit">Speichern</button>
            </p>
        </form>
    </div>
</div>