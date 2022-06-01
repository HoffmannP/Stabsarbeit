import sqlalchemy  # type: ignore[import]
import sqlalchemy.orm  # type: ignore[import]
import typing

Base = sqlalchemy.orm.declarative_base()
engine = sqlalchemy.create_engine('sqlite:///database.sqlite3', echo=True, future=True)
Base.metadata.create_all(engine)

class Entry(Base):  # type: ignore[valid-type,misc]
    __tablename__ = 'entries'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True, nullable=False)
    date = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=False)

    def __repr__(self):  # type: ignore[import,no-untyped-def]
        return f'Entry[{self.id!r}] = {{ date: {self.date!r}, text: "{self.text!r}" }}'

def update() -> None:
    Base.metadata.create_all(engine)

def add(entry: Entry) -> typing.Optional[int]:
    with sqlalchemy.orm.Session(engine, future=True) as session:
        try:
            session.add(entry)
            session.commit()
            session.refresh(entry)
        except sqlalchemy.exc.IntegrityError:
            return None
    return entry.id

def load() -> typing.List[Entry]:
    with  sqlalchemy.orm.Session(engine, future=True) as session:
        stmt = sqlalchemy.select(Entry)
        entries = session.execute(stmt).scalars().all()()

        if entries is None:
            return []
        return entries
