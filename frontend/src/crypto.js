const SALT = 'STABSARBEIT'

export const ALGO_STRUCTURE = ['name', 'length', 'iv']

export default class {
  async init (key = false, iv = false) {
    if (key) {
      const enc = new TextEncoder()
      const keyMaterial = window.crypto.subtle.importKey(
        'raw',
        enc.encode(key),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      )
      this.key = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: SALT, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
    } else {
      this.key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
    }

    this.algorithm = {
      name: 'AES-GCM',
      length: 64,
      iv: iv || window.crypto.getRandomValues(new Uint8Array(16))
    }
  }

  async encrypt (message) {
    return window.crypto.subtle.encrypt(this.algorithm, this.key, message)
  }

  async decrypt (message) {
    return window.crypto.subtle.decrypt(this.algorithm, this.key, message)
  }

  async export () {
    if (!this.key) {
      await this.init()
    }
    return this.algorithm
  }
}
