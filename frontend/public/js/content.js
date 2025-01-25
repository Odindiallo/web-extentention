// Function to extract product information from Amazon page
function extractProductInfo() {
    const productInfo = {
        id: null,
        name: null,
        price: null,
        currency: null,
        image: null
    };

    try {
        // Get product ID from URL
        const urlMatch = window.location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
        if (urlMatch) {
            productInfo.id = urlMatch[1];
        }

        // Get product name
        const titleElement = document.getElementById('productTitle') || 
                           document.querySelector('.product-title-word-break');
        if (titleElement) {
            productInfo.name = titleElement.textContent.trim();
        }

        // Get product price
        const priceElement = document.querySelector('#priceblock_ourprice') || 
                           document.querySelector('.a-price .a-offscreen') ||
                           document.querySelector('#price_inside_buybox');
        if (priceElement) {
            const priceText = priceElement.textContent.trim();
            const currencyMatch = priceText.match(/^[^\d]*/);
            productInfo.currency = currencyMatch ? currencyMatch[0].trim() : '$';
            productInfo.price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
        }

        // Get product image
        const imageElement = document.getElementById('landingImage') ||
                           document.querySelector('#imgBlkFront') ||
                           document.querySelector('#main-image');
        if (imageElement) {
            productInfo.image = imageElement.src;
        }

        return productInfo;
    } catch (error) {
        console.error('Error extracting product info:', error);
        return productInfo;
    }
}

// Function to send product info to extension
function sendProductInfo() {
    const productInfo = extractProductInfo();
    if (productInfo.id) {
        chrome.runtime.sendMessage({
            type: 'PRODUCT_INFO',
            data: productInfo
        });
    }
}

// Watch for dynamic content changes
const observer = new MutationObserver(() => {
    sendProductInfo();
});

// Start observing when the page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sendProductInfo();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
} else {
    sendProductInfo();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
