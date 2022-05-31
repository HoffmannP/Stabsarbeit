/* eslint-env browser */

import { Packr, Unpackr } from 'msgpackr'
import Cryptography, { ALGO_STRUCTURE } from './crypto'
import { Peer } from 'peerjs'

const STRUCTURE = ['date', 'text']

export class SyncSender {
  constructor (name, key) {
    this.messages = []
    this.packer = new Packr({ structures: [STRUCTURE, ALGO_STRUCTURE] })
    this.crypto = new Cryptography(key)
    this.connections = []

    this.crypto.initialized.then(
      cryptoAlgorithm => this.store(this.packer.pack(cryptoAlgorithm))
    )

    const peer = new Peer(name)
    peer.on('connection', connection => {
      this.messages.forEach(message => connection.send(message))
      this.connections.push(connection)
    })
  }

  async createRtcSender (name) {
    const peer = new Peer(name)
    return new Promise(
      resolve => peer.on('connection',
        connection => resolve(message => connection.send(message)))
    )
  }

  async store (message) {
    this.messages.push(message)
    this.connections.forEach(
      connection => connection.send(message)
    )
  }

  add (row) {
    const diff = this.packer.pack(row)
    this.crypto.encrypt(diff).then(encryptRow => this.store(encryptRow))
    return row
  }
}

export class SyncReceiver extends EventTarget {
  constructor (name, key) {
    super()
    this.unpacker = new Unpackr({ structures: [STRUCTURE, ALGO_STRUCTURE] })
    this.crypto = new Cryptography(key)
    this.callback = _ => {}

    const peer = new Peer()
    this.connection = peer.connect('name')
    this.connection.on('data', data => {
      this.receive(data)
    })
  }

  async receive (packedData) {
    if (!this.crypto.initialized) {
      this.crypto.setIV(this.unpacker.unpack(packedData))
    }
    const newEntry = this.unpacker.unpack(this.crypto.decrypt(packedData))
    this.dispatchEvent(new CustomEvent('newEntry', { detail: newEntry }))
  }
}
