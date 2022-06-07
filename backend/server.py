#!/usr/bin/env python3

import asyncio
import aiohttp.web
import typing
import json
import logging
import collections

Model = collections.namedtuple('Model', 'queues entries')
Models: typing.Dict[str, Model] = {}
logger = logging.getLogger('sse')

class ServerSentEventResponse (aiohttp.web.StreamResponse):
    def __init__(self, name):
        super().__init__()
        self.name = name
        self.headers['Cache-Control'] = 'no-store'
        self.headers['Content-Type'] = 'text/event-stream'
        self.headers['Access-Control-Allow-Origin'] = '*'

    async def send(self, data):
        logger.info('[Sending.|%s] %s', self.name, data)
        return await self.write(b'data: ' + data + b'\n\n')

async def handle_send(request):
    name = request.match_info['name']
    checkModel(name)

    logger.info('[Listener|%s] %s', name, request.remote)
    sse = ServerSentEventResponse(name)
    await sse.prepare(request)

    for entry in Models[name].entries:
        await sse.send(entry)
    queue = asyncio.Queue()
    Models[name].queues.append(queue)
    while True:
        entry = await queue.get()
        await sse.send(entry)
        queue.task_done()

async def handle_receive(request):
    name = request.match_info['name']
    checkModel(name)

    entry = await request.content.read()
    if entry == b'$flush$':
        Models[name].entries.clear()
        logger.info('[Flushing|%s]', name)
        resp = aiohttp.web.Response(text=json.dumps({"result": "flush"}))
    else:
        logger.info('[Received|%s] %s', name, entry)
        new_entry(name, entry)
        resp = aiohttp.web.Response(text=json.dumps({"result": "success", "length": len(entry)}))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

def new_entry(name, entry):
    for queue in Models[name].queues:
        queue.put_nowait(entry)
    Models[name].entries.append(entry)

def checkModel(name):
    global Models
    if name not in Models:
        Models[name] = Model([], [])


def main():
    logHandler = logging.StreamHandler()
    logHandler.setFormatter(logging.Formatter('%(asctime)s %(message)s'))
    logHandler.setLevel(logging.INFO)
    logger.setLevel(logging.INFO)
    logger.addHandler(logHandler)
    app = aiohttp.web.Application()
    app.router.add_get('/{name}', handle_send)
    app.router.add_post('/{name}', handle_receive)
    aiohttp.web.run_app(app, port=5001)


if __name__ == '__main__':
    main()