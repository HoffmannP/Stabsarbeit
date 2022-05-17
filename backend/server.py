#!/usr/bin/env python3

import typing
import logging
import fastapi
import fastapi.middleware.cors
import fastapi.responses
import uvicorn  # type: ignore
import Database


PERIOD = 5 * 60

app = fastapi.FastAPI()
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=['http://localhost:5000'],
    allow_credentials=True,
    allow_methods=['POST', 'GET'],
    allow_headers=['Content-Type'])

def user_session(session = fastapi.Cookie(default=None)):
    if session is None:
        raise fastapi.HTTPException(status_code=401, detail='Auth-Cookie missing')
    userid = Database.user_session(session)
    if userid is False:
        raise fastapi.HTTPException(status_code=401, detail='Session invalid')
    return userid

@app.post('/login')
async def login(response: fastapi.Response, username = fastapi.Form(''), password = fastapi.Form('')) -> typing.Dict[str, str]:
    token = Database.login(username, password)
    if token is None:
        return { 'error': 'error obtaining access token' }
    response.set_cookie(key='session', value=token, expires=7200, httponly=True, samesite='None', secure=True)
    return { 'access-token': token }

@app.post('/register')
async def register(username = fastapi.Form(''), name = fastapi.Form(''), password = fastapi.Form('')) -> typing.Dict[str, str]:
    user_id = Database.register(username, name, password)
    if user_id is None:
        return { 'error': 'error registering user' }
    return { 'registered': user_id }

@app.get('/home')
async def home(user_session = fastapi.Depends(user_session)) -> typing.Dict[str, str]:
    user = Database.get_user(user_session)
    return {
        'username': user.username,
        'name': user.name}

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
