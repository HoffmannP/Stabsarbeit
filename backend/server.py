#!/usr/bin/env python3

import typing
import logging
import fastapi
import fastapi.middleware.cors
import fastapi.responses
import uvicorn  # type: ignore
import Database  # type: ignore


PERIOD = 5 * 60

app = fastapi.FastAPI()
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=['http://localhost:5000'],
    allow_credentials=True,
    allow_methods=['POST', 'GET'],
    allow_headers=['Content-Type'])

@app.post('/add')
async def add(entry: Database.Entry) -> typing.Dict[str, int]:
    entryId = Database.add(entry)
    if entryId is None:
        raise fastapi.HTTPException(status_code=505, detail=f'Can not add entry {entry.id}')
    return { 'entry': entryId }

@app.get('/load')
async def load() -> typing.List[Database.Entry]:
    return Database.load()

@app.get('/update-database')
async def update_database() -> typing.Dict[str, bool]:
    Database.update()
    return { 'success': True }

# @app.on_event('startup')
# @fastapi_utils.tasks.repeat_every(seconds=PERIOD)
# async def regular_check() -> None:
#     logging.info('check')


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s | %(levelname)s:     %(message)s', level=logging.INFO)
    logging.info('Logging started')
    uvicorn.run(app, host='0.0.0.0', port=5001)
