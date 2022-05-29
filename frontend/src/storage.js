/* eslint-env browser */

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
