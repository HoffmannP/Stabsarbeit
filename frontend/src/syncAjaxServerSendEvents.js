const DEV = true

export default class {
  constructor (target) {
    this.sendBuffer = []
    this.state = 'offline'
    this.send = message => this.sendBuffer.push(message)

    const uri = `${DEV ? 'http://localhost:5432' : 'https://b-ranger.de/stabsarbeit'}/${target}`
    let this.request
    this.send = data => {
        this.request = window.fetch(uri, {
        method: 'POST',
        mode: 'cors',
        body: data
      })
    }

    this.request.addEventListener('error', error => {
      console.error(error)
      this.state = 'offline'
    })

    websocket.addEventListener('close', _ => {
      this.sendBuffer = []
      this.send = message => this.sendBuffer.push(message)
      this.state = 'offline'
    })

    websocket.addEventListener('open', _ => {
      this.state = 'online'
      for (const message in this.sendBuffer) {
        websocket.send(message)
      }
      this.send = message => websocket.send(message)
    })

    websocket.addEventListener('message', message => this.receive(message))
  }

  async receive (message) {
    console.debug(`Incoming message on websocket: ${message}`)
  }
}
