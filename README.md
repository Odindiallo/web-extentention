# Shopping Assistant Browser Extension

A powerful browser extension that helps users shop smarter with real-time price comparisons, coupon suggestions, shared carts, and collaborative shopping features.

## Features

- Real-time price comparison across major e-commerce platforms
- Automatic coupon and discount finder
- Shared shopping carts with real-time collaboration
- Price tracking and alerts
- Wishlist management

## Tech Stack

### Frontend
- Next.js for the popup UI
- Tailwind CSS for styling
- Socket.IO for real-time features

### Backend
- Django with Django REST Framework
- PostgreSQL database
- Socket.IO for real-time updates

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- PostgreSQL

### Backend Setup

1. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```

4. Initialize the database:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the root directory of this project

## Development

### Running in Development Mode

1. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

### Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The extension will use the built files from the `frontend/out` directory

## Testing

### Backend Tests
```bash
pytest
```

### Frontend Tests
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security

- All API endpoints require authentication
- CORS is configured for extension origins only
- API keys and sensitive data are stored in environment variables
- Input validation and sanitization implemented

## License

MIT License - see LICENSE file for details
