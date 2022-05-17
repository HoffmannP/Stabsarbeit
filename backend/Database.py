import sqlalchemy
import sqlalchemy.orm
import secrets
import hashlib
import datetime

Base = sqlalchemy.orm.declarative_base()
engine = sqlalchemy.create_engine('sqlite:///database.sqlite3', echo=True, future=True)
Base.metadata.create_all(engine)

TOKEN_LENGTH = 16
SESSION_MAXAGE = datetime.timedelta(hours=2)


class Session(Base):
    __tablename__ = 'sessions'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True, nullable=False)
    userid = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    token = sqlalchemy.Column(sqlalchemy.String(TOKEN_LENGTH), nullable=False, index=True, unique=True)
    timestamp = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False, default=sqlalchemy.func.now())

    def __repr__(self):
        return f"Session(id={self.id!r}, userid={self.userid!r}, token={self.token!r}), timestamp={self.timestamp!r}"


class User(Base):
    __tablename__ = 'users'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    username = sqlalchemy.Column(sqlalchemy.String, nullable=False, index=True, unique=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    password = sqlalchemy.Column(sqlalchemy.String)
    timestamp = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False, default=sqlalchemy.func.now())

    def __repr__(self):
        return f"User(id={self.id!r}, username={self.username!r}, name={self.name!r}, password={self.password!r}, timestamp={self.timestamp!r})"


def update():
    Base.metadata.create_all(engine)

def register(username, name, password):
    passwordhash = hashlib.sha512(password.encode('utf8')).hexdigest()
    with sqlalchemy.orm.Session(engine, future=True) as session:
        try:
            user = User(
                username=username,
                name=name,
                password=passwordhash)
            session.add(user)
            session.commit()
            session.refresh(user)
        except sqlalchemy.exc.IntegrityError:
            return None
    return user.id

def login(username, password):
    passwordhash = hashlib.sha512(password.encode('utf8')).hexdigest()
    with  sqlalchemy.orm.Session(engine, future=True) as session:
        stmt = sqlalchemy.select(User).where(User.username == username).where(User.password == passwordhash)
        user = session.execute(stmt).scalars().first()

        if user is None:
            return None

        token = secrets.token_hex(16)
        session.add(Session(
            token=token,
            userid=user.id))
        session.commit()
    return token

def user_session(token):
    with sqlalchemy.orm.Session(engine, future=True) as session:
        stmt = sqlalchemy.select(Session).where(Session.token == token)
        site_session = session.execute(stmt).scalars().first()

        if session is None:
            return False

        now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
        if now - site_session.timestamp > SESSION_MAXAGE:
            return False

        site_session.timestamp = now
        session.commit()

        return site_session.userid

def get_user(userid):
    with  sqlalchemy.orm.Session(engine, future=True) as session:
        stmt = sqlalchemy.select(User).where(User.id == userid)
        user = session.execute(stmt).scalars().first()

        if user is None:
            return None
        return user
