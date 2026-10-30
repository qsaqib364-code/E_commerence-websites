from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.core.dependencies import get_current_admin, get_current_user
from app.models.user import User
from typing import List, Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Optional Token Checker (Agar user login hai toh token nikalega, warna None dega)
security = HTTPBearer(auto_error=False)
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security), 
    db: AsyncSession = Depends(get_db)
):
    if not credentials:
        return None
    from jose import jwt, JWTError
    from app.core.config import settings
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id:
            result = await db.execute(select(User).where(User.id == int(user_id)))
            return result.scalars().first()
    except JWTError:
        return None
    return None

# 1. Place Order (Update kiya gaya)
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_order(
    order_in: OrderCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user) # Customer token
):
    total_amount = 0.0
    order_items = []

    for item in order_in.items:
        result = await db.execute(select(Product).where(Product.id == item.product_id).with_for_update())
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} nahi mila")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Stock khatam. Sirf {product.stock_quantity} bache hain.")

        product.stock_quantity -= item.quantity
        total_amount += float(product.price) * item.quantity
        order_items.append(OrderItem(product_id=product.id, quantity=item.quantity, price_at_purchase=product.price))

    new_order = Order(
        user_id=current_user.id if current_user else None, # User ID save karein
        customer_name=order_in.customer_name, phone=order_in.phone, city=order_in.city,
        address=order_in.address, payment_method=order_in.payment_method,
        total_amount=total_amount, items=order_items
    )
    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)
    return new_order

# 2. Admin Saare Orders Dekhega
@router.get("/", response_model=List[OrderResponse])
async def get_all_orders(db: AsyncSession = Depends(get_db), admin_user = Depends(get_current_admin)):
    result = await db.execute(select(Order).order_by(Order.id.desc()))
    return result.scalars().all()

# 3. Customer Apne Orders Dekhega (YEH NAYI API HAI)
@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Order).where(Order.user_id == current_user.id).order_by(Order.id.desc()))
    return result.scalars().all()

# 4. Order Status Update
@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: int, status_update: OrderStatusUpdate, db: AsyncSession = Depends(get_db), admin_user = Depends(get_current_admin)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalars().first()
    if not order: raise HTTPException(status_code=404, detail="Order nahi mila")
    order.order_status = status_update.status
    await db.commit()
    await db.refresh(order)
    return order