from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Async Engine banayein (Yahan humne pool_pre_ping add kiya hai)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG, 
    future=True,
    connect_args={"ssl": "require"},
    pool_pre_ping=True,  # <-- YEH LINE DEAD CONNECTIONS KO CHECK KAREGI
    pool_recycle=300     # <-- YEH LINE HAR 5 MINUTE BAAD CONNECTION REFRESH KAREGI
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)