from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from app.db.base import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # YEH NAYI LINE ADD HUI HAI (Customer ki ID)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    
    customer_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20))
    city: Mapped[str] = mapped_column(String(50))
    address: Mapped[str] = mapped_column(String(255))
    
    payment_method: Mapped[str] = mapped_column(String(20), default="COD")
    payment_status: Mapped[str] = mapped_column(String(20), default="Pending")
    order_status: Mapped[str] = mapped_column(String(20), default="Processing")
    
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2))
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    
    quantity: Mapped[int] = mapped_column(Integer)
    price_at_purchase: Mapped[float] = mapped_column(Numeric(10, 2))
    
    order: Mapped["Order"] = relationship(back_populates="items")