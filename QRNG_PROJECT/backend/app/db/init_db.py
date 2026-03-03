from app.db.session import engine
from app.model.base import Base
from app.model.user import User  # correct absolute import

def init_db():
    Base.metadata.create_all(bind=engine)