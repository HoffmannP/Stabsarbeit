#!/usr/bin/env python3

import typing
import logging
import websockets # type: ignore
import websockets.server  # type: ignore

GAME: typing.Dict[str, websockets.server.WebSocketServerProtocol] = {}

def broadcast(players, action, **data):
    websockets.broadcast(players, json.dumps({
            'action': action, **data}))

ALL_ENTRIES = [ ]

async def handler(websocket):
    while True:
        message = await websocket.recv()
        await websocket.send(json.dumps({
            'status': 'success',
            'length': len(ALL_ENTRIES)
        }))

async def handler(websocket):
    if (direction == 'sender') {
        handleSender(websocket)
    }
    message = await websocket.recv()
    try:
        data = json.loads(message)
    except ValueError:
        return

    assert data['action'] == 'start'

    if 'key' in data and len(data['key']) > 3:
        key = data['key']
        if key in GAME:
            print(f'Player 1 joining {key}')
            await play(GAME[key], websocket)
            del GAME[key]
            print('Player 1 left the game')
            return
    else:
        key = secrets.token_urlsafe()

    GAME[key] = websocket
    print(f'Player 0 joining {key}')
    await websocket.send(json.dumps({
        'action': 'invite',
        'key': key}))

    await websocket.wait_closed()
    del GAME[key]
    print('Player 0 left the game')

async def main():
    async with websockets.serve(handler, '', 5432):
        await asyncio.Future()


if __name__ == '__main__':
    asyncio.run(main())
