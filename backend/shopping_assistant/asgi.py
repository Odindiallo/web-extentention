"""
ASGI config for shopping_assistant project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "shopping_assistant.settings")

import socketio
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import path, re_path

django.setup()

# Initialize Socket.IO with more detailed logging
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'chrome-extension://*'],
    logger=True,
    engineio_logger=True,
    ping_timeout=60,
    ping_interval=25,
    max_http_buffer_size=1000000,
    async_handlers=True
)

# Create ASGI application for Socket.IO
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=get_asgi_application(),
    socketio_path='socket.io'
)

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit('connection_established', {'status': 'connected'}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def error(sid, data):
    print(f"Error for client {sid}: {data}")

@sio.event
async def price_update(sid, data):
    try:
        await sio.emit('price_update', data)
        print(f"Price update sent: {data}")
    except Exception as e:
        print(f"Error sending price update: {e}")
        await sio.emit('error', {'message': 'Failed to process price update'}, room=sid)

@sio.event
async def cart_update(sid, data):
    try:
        await sio.emit('cart_update', data)
        print(f"Cart update sent: {data}")
    except Exception as e:
        print(f"Error sending cart update: {e}")
        await sio.emit('error', {'message': 'Failed to process cart update'}, room=sid)

# Set up ASGI application with protocol routing
application = ProtocolTypeRouter({
    "http": socket_app,
    "websocket": AuthMiddlewareStack(
        URLRouter([
            re_path(r'socket.io/', socket_app),
        ])
    ),
})
