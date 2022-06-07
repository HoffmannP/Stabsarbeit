/* eslint-env browser */

const DEV = true

export default class {
  constructor (target) {
    this._uri = `${DEV ? 'http://localhost:5001' : 'https://b-ranger.de/stabsarbeit'}/${target}`
  }

  send (data) {
    fetch(this._uri, {
      method: 'POST',
      mode: 'cors',
      body: data
    }).catch(error => console.error(error))
  }
}
