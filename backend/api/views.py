from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from bs4 import BeautifulSoup
import requests

from .models import (
    Product,
    SharedCart,
    CartItem,
    PriceHistory,
    Coupon,
    Wishlist,
    WishlistItem
)
from .serializers import (
    ProductSerializer,
    SharedCartSerializer,
    CartItemSerializer,
    PriceHistorySerializer,
    CouponSerializer,
    WishlistSerializer,
    WishlistItemSerializer
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def compare_prices(self, request):
        """Compare prices across different stores for a product."""
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Implement price comparison logic here
            # This is a placeholder for actual implementation
            prices = self._fetch_prices(url)
            return Response(prices)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def _fetch_prices(self, url):
        # Placeholder for price fetching logic
        # In real implementation, this would use various APIs or web scraping
        return []

class SharedCartViewSet(viewsets.ModelViewSet):
    serializer_class = SharedCartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SharedCart.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        cart = serializer.save(owner=self.request.user)
        cart.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        cart = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        cart.members.add(user_id)
        return Response({'status': 'member added'})

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__members=self.request.user)

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def find_coupons(self, request):
        """Find valid coupons for a store."""
        store = request.data.get('store')
        if not store:
            return Response({'error': 'store is required'}, status=status.HTTP_400_BAD_REQUEST)

        coupons = self.queryset.filter(store__iexact=store)
        serializer = self.get_serializer(coupons, many=True)
        return Response(serializer.data)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(wishlist__user=self.request.user)

    @action(detail=True, methods=['post'])
    def track_price(self, request, pk=None):
        """Set a target price for price tracking."""
        item = self.get_object()
        target_price = request.data.get('target_price')
        if not target_price:
            return Response({'error': 'target_price is required'}, status=status.HTTP_400_BAD_REQUEST)

        item.target_price = target_price
        item.save()
        return Response({'status': 'target price set'})
