import sqlalchemy
import sqlalchemy.orm

Base = sqlalchemy.orm.declarative_base()

class User(Base):
