from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int
    category: str
    image_url: Optional[str] = None

class ProductResponse(ProductCreate):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True