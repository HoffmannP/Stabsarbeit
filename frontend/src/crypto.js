const SALT = 'STABSARBEIT'

export const ALGO_STRUCTURE = ['name', 'length', 'iv']

export default class {
  constructor (key) {
    this.initialized = this.initKey(key)
    this.algorithm = {
      name: 'AES-GCM',
      length: 64,
      iv: window.crypto.getRandomValues(new Uint8Array(16))
    }
  }

  async initKey (key) {
    const te = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      te.encode(key),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )
    this.key = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: te.encode(SALT), iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    return true
  }

  async setIV (iv) {
    this.algorithm.iv = iv
    await this.initialized
    return this.algorithm
  }

  async encrypt (message) {
    return window.crypto.subtle.encrypt(this.algorithm, this.key, message)
  }

  async decrypt (message) {
    return window.crypto.subtle.decrypt(this.algorithm, this.key, message)
  }
}
