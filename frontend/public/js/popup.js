// Global state
let currentProduct = null;
let socket = null;

// DOM Elements
const elements = {
    productName: document.getElementById('productName'),
    productPrice: document.getElementById('productPrice'),
    comparisons: document.getElementById('comparisons'),
    coupons: document.getElementById('coupons'),
    carts: document.getElementById('carts'),
    helpButton: document.getElementById('helpButton'),
    optionsButton: document.getElementById('optionsButton'),
    noProductMessage: document.getElementById('noProductMessage'),
    productInfo: document.getElementById('productInfo')
};

// Initialize socket connection
function initializeSocket() {
    socket = io('http://localhost:8000');
    
    socket.on('connect', () => {
        console.log('Connected to server');
        if (currentProduct) {
            requestProductData(currentProduct);
        }
    });

    socket.on('product_data', (data) => {
        updateProductDisplay(data);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
}

// Request product data from server
function requestProductData(product) {
    if (socket && socket.connected) {
        socket.emit('get_product_data', product);
    }
}

// Update the display with product data
function updateProductDisplay(data) {
    if (!data) return;

    if (elements.productName) {
        elements.productName.textContent = data.name || 'Product Name Not Available';
    }
    
    if (elements.productPrice) {
        elements.productPrice.textContent = data.price ? 
            new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD' })
                .format(data.price) : 
            'Price Not Available';
    }
    
    if (elements.comparisons) {
        elements.comparisons.textContent = data.comparisons?.length || '0';
    }
    
    if (elements.coupons) {
        elements.coupons.textContent = data.coupons?.length || '0';
    }
    
    if (elements.carts) {
        elements.carts.textContent = data.sharedCarts?.length || '0';
    }

    // Show/hide appropriate sections
    if (elements.noProductMessage && elements.productInfo) {
        if (data.id) {
            elements.noProductMessage.style.display = 'none';
            elements.productInfo.style.display = 'block';
        } else {
            elements.noProductMessage.style.display = 'block';
            elements.productInfo.style.display = 'none';
        }
    }
}

// Check if current tab is a product page
async function checkCurrentTab() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            throw new Error('No active tab found');
        }

        // Get product info from content script
        chrome.tabs.sendMessage(tab.id, { type: 'GET_PRODUCT_INFO' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
                updateProductDisplay(null);
                return;
            }

            if (response && response.data) {
                currentProduct = response.data;
                updateProductDisplay(response.data);
                requestProductData(response.data);
            } else {
                updateProductDisplay(null);
            }
        });
    } catch (error) {
        console.error('Error checking current tab:', error);
        updateProductDisplay(null);
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize socket connection
    initializeSocket();

    // Check current tab for product
    await checkCurrentTab();

    // Add button click handlers
    if (elements.helpButton) {
        elements.helpButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://github.com/yourusername/shopping-assistant/wiki' });
        });
    }

    if (elements.optionsButton) {
        elements.optionsButton.addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PRODUCT_INFO') {
        currentProduct = message.data;
        updateProductDisplay(message.data);
        requestProductData(message.data);
    }
    return true;
});
