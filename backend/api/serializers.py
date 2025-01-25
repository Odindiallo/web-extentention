from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Product,
    SharedCart,
    CartItem,
    PriceHistory,
    Coupon,
    Wishlist,
    WishlistItem
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ProductSerializer(serializers.ModelSerializer):
    price_history = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_price_history(self, obj):
        return PriceHistory.objects.filter(product=obj).values('price', 'recorded_at')[:10]

class SharedCartSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = SharedCart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    added_by = UserSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'

class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = '__all__'

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = '__all__'
