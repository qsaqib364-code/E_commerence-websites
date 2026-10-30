from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import json
import redis.asyncio as aioredis
from typing import List

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse
from app.core.dependencies import get_current_admin

router = APIRouter()
redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# 1. Get All Products (Sab dekh sakte hain)
@router.get("/", response_model=List[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    cache_key = "all_products"
    cached_products = await redis_client.get(cache_key)
    if cached_products:
        print("✅ Data mil gaya Redis Cache se!")
        return json.loads(cached_products)
    
    print("⚠️ Data Database se le rahe hain...")
    result = await db.execute(select(Product).where(Product.is_active == True))
    products = result.scalars().all()
    
    products_data = [ProductResponse.model_validate(p).model_dump(mode="json") for p in products]
    await redis_client.set(cache_key, json.dumps(products_data), ex=60)
    return products

# 2. Add Product (Sirf Admin)
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate, 
    db: AsyncSession = Depends(get_db),
    admin_user = Depends(get_current_admin)
):
    new_product = Product(**product_in.model_dump())
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    await redis_client.delete("all_products") # Cache clear karein taake naya product show ho
    return new_product

# 3. Delete Product (Sirf Admin) - YEH NAYA CODE HAI
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    admin_user = Depends(get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product nahi mila")
    
    await db.delete(product)
    await db.commit()
    await redis_client.delete("all_products") # Cache clear karein
    return None