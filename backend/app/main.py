from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy import text
from sqlalchemy.future import select
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # <-- Image serve karne ke liye
import os

from app.core.config import settings
from app.db.session import engine, AsyncSessionLocal
from app.api.v1.router import api_router
from app.api.v1 import upload # <-- Nayi Upload API

from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem 
from app.core.security import verify_password

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email, password = form.get("username"), form.get("password")

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(User).where(User.email == email))
            user = result.scalars().first()
            
            if user and user.is_admin and verify_password(password, user.hashed_password):
                request.session.update({"token": "admin_logged_in"})
                return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return "token" in request.session

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.full_name, User.email, User.is_admin]
    name_plural = "Customers"

class ProductAdmin(ModelView, model=Product):
    column_list = [Product.id, Product.name, Product.price, Product.stock_quantity]
    name_plural = "Products"

class OrderAdmin(ModelView, model=Order):
    column_list = [Order.id, Order.customer_name, Order.total_amount, Order.order_status]
    name_plural = "Orders"

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        print("✅ Database Connection Successful!")
    except Exception as e:
        print(f"❌ Database Connection Failed: {e}")
    yield
    await engine.dispose()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Images ko public URL par serve karein
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix="/api/v1")
app.include_router(upload.router, prefix="/api/v1/upload", tags=["Upload"]) # <-- Upload API connect

admin = Admin(app, engine, authentication_backend=AdminAuth(secret_key=settings.SECRET_KEY))
admin.add_view(UserAdmin)
admin.add_view(ProductAdmin)
admin.add_view(OrderAdmin) 

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}