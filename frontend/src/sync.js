/* eslint-env browser */

import { Packr, Unpackr } from 'msgpackr'
import { Encrypt, Decrypt, ALGO_STRUCTURE } from './crypto'
import { get } from 'svelte/store'

const STRUCTURE = ['date', 'text']
const DEV = true
const URI = DEV ? 'ws://localhost:5432' : 'wss://b-ranger.de/tictactoe_ws'

export class SyncSender {
  constructor (key) {
    this.entries = []
    this.packer = new Packr({ structures: [STRUCTURE, ALGO_STRUCTURE] })
    this.crypto = new Encrypt(key)
    this.state = 'offline'
    this._add = entry => this.entries.push(entry)

    const websocket = new window.WebSocket(URI)
    this.send = data => websocket.send(data)
    websocket.addEventListener('error', error => {
      console.error(error)
      this.state = 'offline'
    })
    websocket.addEventListener('close', _ => {
      this.entries = []
      this._add = entry => this.entries.push(entry)
      this.state = 'offline'
    })
    websocket.addEventListener('open', _ => {
      this.state = 'online'
      for (const entry in this.entries) {
        websocket.send(entry)
      }
      this._add = entry => websocket.send(entry)
    })
  }

  add (entry) {
    this.crypto.encrypt(this.packer.pack(entry))
      .then(encryptEntry => this._add(encryptEntry))
    return entry
  }
}

export class SyncReceiver extends EventTarget {
  constructor (peerId, key) {
    super()
    this.unpacker = new Unpackr({ structures: [STRUCTURE, ALGO_STRUCTURE] })
    this.crypto = new Decrypt(key)

    const peer = new Peer()
    peer.on('error', error => console.error(error.type, error))
    peer.on('open', _ => {
      this.connection = peer.connect(peerId)
      this.connection.on('error', error => console.error(error))
      this.connection.on('data', data => this.receive(data))
    })
  }

  async receive (packedRawData) {
    const packedData = new Uint8Array(packedRawData)
    if (await this.crypto.notInitialized) {
      await this.crypto.init(this.unpacker.unpack(packedData))
    } else {
      const newEntry = this.unpacker.unpack(await this.crypto.decrypt(packedData))
      this.dispatchEvent(new CustomEvent('newEntry', { detail: newEntry }))
    }
  }
}
