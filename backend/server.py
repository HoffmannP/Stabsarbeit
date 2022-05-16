#!/usr/bin/env python3

import typing
import logging
import fastapi
import fastapi.middleware.cors
import fastapi_utils.tasks  # type: ignore
import uvicorn  # type: ignore
import Database


PERIOD = 5 * 60

app = fastapi.FastAPI()
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['POST', 'GET'],
    allow_headers=['Content-Type'],
)

@app.post('/login')
async def login(username = fastapi.Form(''), password = fastapi.Form('')) -> typing.Dict[str, str]:
    token = Database.login(username, password)
    if token is None:
        return { 'error': 'error obtaining access token' }
    return { 'access-token': token }

@app.post('/register')
async def register(username = fastapi.Form(''), password = fastapi.Form('')) -> typing.Dict[str, str]:
    user_id = Database.register(username, password)
    return { 'registered': user_id }

@app.get('/b/{year}/{week}')
async def exams_get(year: int, week: int) -> typing.Dict[str, str]:
    return { 'calender_week': f'{week}.{year}' }

@app.post('/c')
async def c(request: fastapi.Request) -> bool:
    body = await request.body()
    return len(body) > 100

@app.on_event('startup')
@fastapi_utils.tasks.repeat_every(seconds=PERIOD)
async def regular_check() -> None:
    logging.info('check')


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s | %(levelname)s:     %(message)s', level=logging.INFO)
    logging.info('Logging started')
    uvicorn.run(app, host='0.0.0.0', port=5001)
