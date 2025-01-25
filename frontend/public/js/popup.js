// Initialize socket connection
let socket = null;
let currentProduct = null;
let priceComparisons = [];
let coupons = [];
let sharedCarts = [];

// DOM Elements
const currentProductEl = document.getElementById('currentProduct');
const priceComparisonsCountEl = document.getElementById('priceComparisonsCount');
const couponsCountEl = document.getElementById('couponsCount');
const sharedCartsCountEl = document.getElementById('sharedCartsCount');
const offlineModeEl = document.getElementById('offlineMode');
const errorMessageEl = document.getElementById('errorMessage');

// Initialize socket connection
function initializeSocket() {
    console.log('Initializing socket connection...');
    try {
        socket = io('http://localhost:8000', {
            transports: ['polling'], // Start with polling only
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            hideError();
            hideOfflineMode();
            getCurrentTab();
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            showError('Unable to connect to server. Please make sure the backend is running.');
            showOfflineMode();
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from WebSocket server:', reason);
            showOfflineMode();
            if (reason === 'io server disconnect') {
                socket.connect();
            }
        });

        // Handle price updates
        socket.on('price_update', (update) => {
            console.log('Received price update:', update);
            updatePriceComparisons(update);
        });

        // Handle cart updates
        socket.on('cart_update', (update) => {
            console.log('Received cart update:', update);
            updateSharedCarts(update);
        });

    } catch (err) {
        console.error('Socket initialization error:', err);
        showError('Failed to initialize connection to server');
    }
}

// Get current tab information
async function getCurrentTab() {
    console.log('Getting current tab...');
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
            console.log('Current tab URL:', tab.url);
            await fetchProductDetails(tab.url);
        } else {
            console.log('No URL found in current tab');
            showError('No product page detected');
        }
    } catch (err) {
        console.error('Error getting current tab:', err);
        showError('Failed to access current page');
    }
}

// Fetch product details from backend
async function fetchProductDetails(url) {
    console.log('Fetching product details for URL:', url);
    try {
        const response = await fetch('http://localhost:8000/api/products/current', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received product details:', data);
        updateCurrentProduct(data);
        await fetchPriceComparisons(data.id);
    } catch (err) {
        console.error('Error fetching product details:', err);
        showError('Failed to fetch product information');
    }
}

// Fetch price comparisons
async function fetchPriceComparisons(productId) {
    console.log('Fetching price comparisons for product:', productId);
    try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}/comparisons`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received price comparisons:', data);
        updatePriceComparisons({ comparisons: data });
    } catch (err) {
        console.error('Error fetching price comparisons:', err);
        showError('Failed to fetch price comparisons');
    }
}

// Update UI functions
function updateCurrentProduct(product) {
    console.log('Updating current product display:', product);
    currentProduct = product;
    if (currentProductEl) {
        currentProductEl.textContent = product?.name || 'No product selected';
    }
}

function updatePriceComparisons(data) {
    console.log('Updating price comparisons display:', data);
    if (data.comparisons) {
        priceComparisons = data.comparisons;
    } else if (data.productId && data.newPrice) {
        priceComparisons = priceComparisons.map(product =>
            product.id === data.productId
                ? { ...product, current_price: data.newPrice }
                : product
        );
    }
    if (priceComparisonsCountEl) {
        priceComparisonsCountEl.textContent = priceComparisons.length;
    }
}

function updateSharedCarts(data) {
    console.log('Updating shared carts display:', data);
    if (Array.isArray(data)) {
        sharedCarts = data;
    } else if (data.cartId && data.items) {
        sharedCarts = sharedCarts.map(cart =>
            cart.id === data.cartId
                ? { ...cart, items: data.items }
                : cart
        );
    }
    if (sharedCartsCountEl) {
        sharedCartsCountEl.textContent = sharedCarts.length;
    }
}

// UI Helper functions
function showError(message) {
    console.log('Showing error message:', message);
    if (errorMessageEl) {
        const messageEl = errorMessageEl.querySelector('p');
        if (messageEl) {
            messageEl.textContent = message;
        }
        errorMessageEl.classList.remove('hidden');
    }
}

function hideError() {
    console.log('Hiding error message');
    if (errorMessageEl) {
        errorMessageEl.classList.add('hidden');
    }
}

function showOfflineMode() {
    console.log('Showing offline mode');
    if (offlineModeEl) {
        offlineModeEl.classList.remove('hidden');
    }
}

function hideOfflineMode() {
    console.log('Hiding offline mode');
    if (offlineModeEl) {
        offlineModeEl.classList.add('hidden');
    }
}

// Check if extension is enabled
function checkExtensionEnabled() {
    return new Promise((resolve) => {
        if (chrome.runtime && chrome.runtime.getManifest) {
            resolve(true);
        } else {
            showError('Extension is disabled. Please enable it and try again.');
            resolve(false);
        }
    });
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Extension popup loaded');
    try {
        const isEnabled = await checkExtensionEnabled();
        if (isEnabled) {
            console.log('Extension is enabled, initializing...');
            initializeSocket();
        } else {
            console.log('Extension is disabled');
        }
    } catch (err) {
        console.error('Failed to initialize extension:', err);
        showError('Failed to initialize extension');
    }
});
