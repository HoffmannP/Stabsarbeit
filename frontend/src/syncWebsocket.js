const DEV = true

export default class {
  constructor (target) {
    this.sendBuffer = []
    this.state = 'offline'
    this.send = message => this.sendBuffer.push(message)

    const uri = `${DEV ? 'ws://localhost:5432' : 'wss://b-ranger.de/stabsarbeit'}/${target}`
    const websocket = new window.WebSocket(uri)
    this.send = data => websocket.send(data)

    websocket.addEventListener('error', error => {
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
