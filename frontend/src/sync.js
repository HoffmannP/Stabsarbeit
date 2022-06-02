import { Packr, Unpackr } from 'msgpackr'
import { Encrypt, Decrypt, ALGO_STRUCTURE } from './crypto'
import { get } from 'svelte/store'
import SyncWebsocket from './syncWebsocket'

const ENTRY_STRUCTURE = ['date', 'text']

export class SyncSender extends SyncWebsocket {
  constructor (key) {
    super('sender')
    this.packer = new Packr({ structures: [ENTRY_STRUCTURE, ALGO_STRUCTURE] })
    this.crypto = new Encrypt(key)

    this.crypto.initialized.then(
      cryptoAlgorithm => this.send(this.packer.pack(cryptoAlgorithm))
    )
  }

  async init (entries) {
    await this.crypto.initialized
    for (const entry of get(entries)) {
      this.add(entry)
    }
  }

  add (entry) {
    this.crypto.encrypt(this.packer.pack(entry))
      .then(encryptEntry => this.send(encryptEntry))
    return entry
  }
}

export class SyncReceiver extends SyncWebsocket {
  constructor (peerId, key) {
    super('receiver')
    this.unpacker = new Unpackr({ structures: [ENTRY_STRUCTURE, ALGO_STRUCTURE] })
    this.crypto = new Decrypt(key)
  }

  async receive (message) {
    const packedData = new Uint8Array(message)
    if (await this.crypto.notInitialized) {
      await this.crypto.init(this.unpacker.unpack(packedData))
    } else {
      const newEntry = this.unpacker.unpack(await this.crypto.decrypt(packedData))
      this.dispatchEvent(new window.CustomEvent('newEntry', { detail: newEntry }))
    }
  }
}
