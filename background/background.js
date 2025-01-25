// Listen for tab updates to detect when user navigates to e-commerce sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the URL is from a supported e-commerce site
    const supportedSites = [
      'amazon.com',
      'ebay.com',
      'walmart.com',
      'bestbuy.com',
      'target.com'
    ];

    const isEcommerceSite = supportedSites.some(site => tab.url.includes(site));

    if (isEcommerceSite) {
      // Update the extension icon to show it's active
      chrome.action.setIcon({
        path: {
          "16": "assets/icon16-active.png",
          "48": "assets/icon48-active.png",
          "128": "assets/icon128-active.png"
        },
        tabId: tabId
      });

      // Send message to content script to start monitoring prices
      chrome.tabs.sendMessage(tabId, {
        type: 'START_PRICE_MONITORING',
        url: tab.url
      });
    } else {
      // Reset the extension icon
      chrome.action.setIcon({
        path: {
          "16": "assets/icon16.png",
          "48": "assets/icon48.png",
          "128": "assets/icon128.png"
        },
        tabId: tabId
      });
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PRICE_UPDATE') {
    // Forward price updates to the backend
    fetch('http://localhost:8000/api/products/compare_prices/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: request.url,
        price: request.price
      })
    })
    .then(response => response.json())
    .then(data => {
      // Send price comparison results back to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'PRICE_COMPARISON_RESULTS',
        data: data
      });
    })
    .catch(error => {
      console.error('Error updating price:', error);
    });
  }

  // Required for async response
  return true;
});

// Handle installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open onboarding page
    chrome.tabs.create({
      url: 'onboarding.html'
    });
  } else if (details.reason === 'update') {
    // Show update notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'Shopping Assistant Updated',
      message: 'The extension has been updated with new features!'
    });
  }
});
