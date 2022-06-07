/* eslint-env browser */

const DEV = true

export default class {
  constructor (target) {
    const uri = `${DEV ? 'http://localhost:5001' : 'https://b-ranger.de/stabsarbeit'}/${target}`

    const eventSource = new EventSource(uri)
    eventSource.addEventListener('message', serverSentEvent => this.receive(serverSentEvent.data))
    eventSource.addEventListener('error', error => console.error(error))
  }

  async receive (message) {
    console.debug(`Incoming message on serverSentEvents: ${message}`)
  }
}
