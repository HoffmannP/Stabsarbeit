import sqlalchemy
import sqlalchemy.orm
import secrets
import hashlib
import datetime

Base = sqlalchemy.orm.declarative_base()
token_length = 16
engine = sqlalchemy.create_engine('sqlite:///database.sqlite3', echo=True, future=True)
Base.metadata.create_all(engine)

class Session(Base):
    __tablename__ = 'sessions'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True, nullable=False)
    userid = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    token = sqlalchemy.Column(sqlalchemy.String(token_length), nullable=False)
    timestamp = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False)

class User(Base):
    __tablename__ = 'users'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    password = sqlalchemy.Column(sqlalchemy.String)
    email = sqlalchemy.Column(sqlalchemy.String)
    timestamp = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False)

def register(username, password):
    Base.metadata.create_all(engine)

    passwordhash = hashlib.sha512(password.encode('utf8')).hexdigest()
    with sqlalchemy.orm.Session(engine, future=True) as session:
        user = User(
            name=username,
            password=passwordhash,
            email='',
            timestamp=datetime.datetime.now())
        session.add(user)
        session.flush()
        session.refresh(user)
    return user.id

def login(username, password):
    Base.metadata.create_all(engine)

    session = sqlalchemy.orm.Session(engine, future=True)
    passwordhash = hashlib.sha512(password.encode('utf8')).hexdigest()
    stmt = sqlalchemy.select(User).where((User.name == username)).where((User.password) == passwordhash)
    user = session.execute(stmt).first()

    if user is None:
        return None

    print(user.id)

    token = secrets.token_hex(16)
    with sqlalchemy.orm.Session(engine, future=True) as session:
        session.add(Session(
            token=token,
            datetime=datetime.datetime.now(),
            userid=user.id))
        session.commit()
    return token