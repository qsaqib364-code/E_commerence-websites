from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, description="Quantity 0 se bari honi chahiye")

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    city: str
    address: str
    payment_method: str = "COD"
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    phone: str
    total_amount: float
    order_status: str
    payment_method: str
    created_at: datetime

    class Config:
        from_attributes = True

# YEH NAYA SCHEMA ADD KAREIN (Status update ke liye)
class OrderStatusUpdate(BaseModel):
    status: str