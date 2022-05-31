/* eslint-env browser */
import { Packr, Unpackr } from 'msgpackr'
import Cryptography, { ALGO_STRUCTURE } from './crypto'
import { Peer } from 'peerjs'

const STRUCTURE = ['index', 'date', 'text']

export class SharedStorage {
  constructor (key) {
    this.storage = []
    this.key = key
    this.iv = crypto.getRandomValues(new Uint8Array(16))
    this.messages = []
    this.packer = new Packr({ structures: [STRUCTURE, ALGO_STRUCTURE] })
    this.decoder = new TextDecoder()
    this.crypto = new Cryptography('meinPasswort')
    this.connections = []

    this.crypto.export().then(
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

  async add (index, row) {
    this.storage[index] = row
    const diff = this.packer.pack([{ index, ...row }])
    this.store(await this.crypto.encrypt(diff))
  }

  async load (diffMessages = []) {
    const unpacker = new Unpackr({ structures: [STRUCTURE, ALGO_STRUCTURE] })
    const te = new TextEncoder()
    this.iv = te.encode(diffMessages.pop())

    diffMessages
      .map(base64Diff => atob(base64Diff))
      .map(textDiff => te.encode(textDiff))
      .map(async encryptDiff => await this.crypto.decrypt(encryptDiff))
      .map(binaryDiff => unpacker.unpack(binaryDiff))
      .forEach(([index, row]) => (this.storage[index] = row))
    return this.storage
  }

  async clear () {
    this.storage = []
    this.currentBinary = new Uint8Array()
    this.messages = []
  }
}

export class ClientLocalStorage {
  constructor (name) {
    this.name = index => `${name}:${index}`
  }

  async add (index, row) {
    localStorage.setItem(this.name(index), JSON.stringify(row))
    localStorage.setItem(this.name('max'), index)
  }

  async load () {
    const max = localStorage.getItem(this.name('max')) || -1
    const data = []
    for (let index = 0; index <= max; index++) {
      data[index] = JSON.parse(localStorage.getItem(this.name(index)))
    }
    return data
  }

  clear () {
    const max = localStorage.getItem(this.name('max'))
    for (let index = 0; index <= max; index++) {
      localStorage.removeItem(this.name(index))
    }
    localStorage.removeItem(this.name('max'))
  }
}

export class ClientIndexDB {
  constructor (name) {
    const request = indexedDB.open(name)
    request.addEventListener('upgradeneeded', this._upgrade)
    this.db = this._promiseResult(request)
  }

  _upgrade (upgradeneededEvent) {
    const db = upgradeneededEvent.target.result
    if (upgradeneededEvent.oldVersion < 1) {
      db.createObjectStore('store')
    }
  }

  _promiseResult (IDBRequest) {
    return new Promise(resolve => IDBRequest.addEventListener(
      'success',
      successEvent => resolve(successEvent.target.result)
    ))
  }

  async add (index, row) {
    return this._promiseResult(
      (await this.db)
        .transaction('store', 'readwrite')
        .objectStore('store')
        .add(row, index)
    )
  }

  async load (index, row) {
    return this._promiseResult(
      (await this.db)
        .transaction('store', 'readonly')
        .objectStore('store')
        .getAll()
    )
  }

  async clear (index, row) {
    return this._promiseResult(
      (await this.db)
        .transaction('store', 'readwrite')
        .objectStore('store')
        .clear()
    )
  }
}
