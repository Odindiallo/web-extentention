// Initialize price monitoring
let currentPrice = null;
let priceObserver = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'START_PRICE_MONITORING') {
    startPriceMonitoring();
  } else if (request.type === 'PRICE_COMPARISON_RESULTS') {
    showPriceComparison(request.data);
  }
});

// Function to start monitoring prices
function startPriceMonitoring() {
  // Different selectors for various e-commerce sites
  const priceSelectors = {
    'amazon.com': '#priceblock_ourprice, #priceblock_dealprice, .a-price-whole',
    'ebay.com': '#prcIsum, .x-price-primary',
    'walmart.com': '.price-characteristic',
    'bestbuy.com': '.priceView-customer-price span',
    'target.com': '[data-test="product-price"]'
  };

  // Get the appropriate selector for the current site
  const currentSite = Object.keys(priceSelectors).find(site => 
    window.location.hostname.includes(site)
  );
  
  if (!currentSite) return;

  const priceSelector = priceSelectors[currentSite];

  // Function to extract price from element
  const extractPrice = (element) => {
    if (!element) return null;
    const priceText = element.textContent.trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    return isNaN(price) ? null : price;
  };

  // Function to check price changes
  const checkPrice = () => {
    const priceElement = document.querySelector(priceSelector);
    const newPrice = extractPrice(priceElement);

    if (newPrice && newPrice !== currentPrice) {
      currentPrice = newPrice;
      // Send price update to background script
      chrome.runtime.sendMessage({
        type: 'PRICE_UPDATE',
        url: window.location.href,
        price: newPrice
      });
    }
  };

  // Initial price check
  checkPrice();

  // Set up observer for price changes
  if (priceObserver) {
    priceObserver.disconnect();
  }

  priceObserver = new MutationObserver(checkPrice);
  
  const priceElement = document.querySelector(priceSelector);
  if (priceElement) {
    priceObserver.observe(priceElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}

// Function to show price comparison
function showPriceComparison(data) {
  // Remove existing comparison overlay
  const existingOverlay = document.getElementById('price-comparison-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create and style the overlay
  const overlay = document.createElement('div');
  overlay.id = 'price-comparison-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    max-width: 300px;
    font-family: Arial, sans-serif;
  `;

  // Add comparison content
  let content = '<h3 style="margin: 0 0 10px; color: #333;">Price Comparison</h3>';
  
  if (data.comparisons && data.comparisons.length > 0) {
    content += '<ul style="margin: 0; padding: 0; list-style: none;">';
    data.comparisons.forEach(item => {
      content += `
        <li style="margin: 10px 0; padding: 8px; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-weight: bold;">${item.store}</div>
          <div style="color: #2ecc71;">$${item.price}</div>
        </li>
      `;
    });
    content += '</ul>';
  } else {
    content += '<p style="color: #666;">No other prices found</p>';
  }

  // Add close button
  content += `
    <button style="
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #999;
    ">×</button>
  `;

  overlay.innerHTML = content;

  // Add close functionality
  const closeButton = overlay.querySelector('button');
  closeButton.addEventListener('click', () => overlay.remove());

  // Add the overlay to the page
  document.body.appendChild(overlay);
}

// Start monitoring when the script loads
startPriceMonitoring();
