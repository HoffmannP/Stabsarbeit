const SALT = 'STABSARBEIT'

export const ALGO_STRUCTURE = ['name', 'length', 'iv']
const KEY_DERIVE_ALGO = 'PBKDF2'
const KEY_DERIVE_ITER = 100000
const KEY_DERIVE_HASH = 'SHA-256'
const KEY_ALGO = 'AES-GCM'
const KEY_LENGTH = 256
const CRYPT_LENGTH = 64

class KeyApplication {
  constructor (key) {
    this._initialized = this._deriveKey(key)
  }

  async _deriveKey (key) {
    const te = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      te.encode(key),
      KEY_DERIVE_ALGO,
      false,
      ['deriveBits', 'deriveKey']
    )
    this._key = await window.crypto.subtle.deriveKey(
      { name: KEY_DERIVE_ALGO, salt: te.encode(SALT), iterations: KEY_DERIVE_ITER, hash: KEY_DERIVE_HASH },
      keyMaterial,
      { name: KEY_ALGO, length: KEY_LENGTH },
      false,
      ['encrypt']
    )
    return this._algorithm
  }
}

export class Encrypt extends KeyApplication {
  constructor (key) {
    super()
    this._algorithm = {
      name: KEY_ALGO,
      length: CRYPT_LENGTH,
      iv: window.crypto.getRandomValues(new Uint8Array(16))
    }
  }

  async init () {
    return this._initialized
  }

  async encrypt (message) {
    return window.crypto.subtle.encrypt(this._algorithm, this._key, message)
  }
}

export class Decrypt extends KeyApplication {
  constructor () {
    super()
    this.notInitialized = true
  }

  async init (iv) {
    this.notInitialized = this.initialized.then(_ => {
      this._algorithm = {
        name: KEY_ALGO,
        length: CRYPT_LENGTH,
        iv: window.crypto.getRandomValues(new Uint8Array(16))
      }
      return false
    })
  }

  async decrypt (message) {
    return window.crypto.subtle.decrypt(this._algorithm, this._key, message)
  }
}
