/* eslint-env browser */

import { Packr, Unpackr } from 'msgpackr'
import { Encrypt, Decrypt, ALGO_STRUCTURE } from './crypto'
import { get } from 'svelte/store'
// import SyncWebsocket from './syncWebsocket'
import SendAjax from './sendAjax'
import ReceiveServerSentEvents from './receiveServerSentEvents'
import { encode as base64encode, decode as base64decode } from 'base64-arraybuffer'

const ENTRY_STRUCTURE = ['date', 'text']

export class SyncSender extends SendAjax {
  constructor (name, key) {
    super(name)
    this.packer = new Packr({ structures: [ENTRY_STRUCTURE, ALGO_STRUCTURE], saveStructures: s => console.log(s) })
    this.crypto = new Encrypt(key)

    this.crypto.init(algorithm => {
      this.send('$flush$')
      this.send(base64encode(this.packer.pack(algorithm)))
    })
  }

  async init (entries) {
    await this.crypto.init()
    for (const entry of get(entries)) {
      this.add(entry)
    }
  }

  async adding (entry) {
    const packedData = this.packer.pack(entry)
    const rawData = new Uint8Array(await this.crypto.encrypt(packedData))
    const base64Data = base64encode(rawData)
    return base64Data
  }

  add (entry) {
    this.adding({ date: entry.date, text: entry.text }).then(base64Data => this.send(base64Data))
    return entry
  }
}

export class SyncReceiver extends EventTarget {
  constructor (peerId, key) {
    super()
    this.receiver = new ReceiveServerSentEvents(peerId)
    this.receiver.receive = message => this.receive(message)
    this.unpacker = new Unpackr({ structures: [ENTRY_STRUCTURE, ALGO_STRUCTURE], useRecords: true })
    window.unpacker = this.unpacker
    this.crypto = new Decrypt(key)
  }

  async receive (base64Data) {
    const rawData = new Uint8Array(base64decode(base64Data))
    if (await this.crypto.notInitialized) {
      await this.crypto.init(this.unpacker.unpack(rawData))
    } else {
      const packedData = new Uint8Array(await this.crypto.decrypt(rawData))
      const entry = this.unpacker.unpack(packedData)
      this.dispatchEvent(new window.CustomEvent('newEntry', { detail: entry }))
    }
  }
}
