from fastapi import APIRouter
from app.api.v1 import auth, products, orders

api_router = APIRouter()

# Authentication Routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Product Routes (Admin & Customer)
api_router.include_router(products.router, prefix="/products", tags=["Products"])

# Order Routes (Cart & Checkout)
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])