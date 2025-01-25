from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    SharedCartViewSet,
    CartItemViewSet,
    CouponViewSet,
    WishlistViewSet,
    WishlistItemViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'shared-carts', SharedCartViewSet, basename='shared-cart')
router.register(r'cart-items', CartItemViewSet, basename='cart-item')
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')
router.register(r'wishlist-items', WishlistItemViewSet, basename='wishlist-item')

urlpatterns = [
    path('', include(router.urls)),
]
