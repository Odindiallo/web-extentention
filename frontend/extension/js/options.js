// Get all option elements
const options = {
    priceAlerts: document.getElementById('priceAlerts'),
    dealAlerts: document.getElementById('dealAlerts'),
    autoCompare: document.getElementById('autoCompare'),
    includeUsed: document.getElementById('includeUsed'),
    autoSync: document.getElementById('autoSync'),
    shareEnabled: document.getElementById('shareEnabled')
};

// Save button and status elements
const saveButton = document.getElementById('save');
const statusEl = document.getElementById('status');

// Show status message
function showStatus(message, isError = false) {
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.background = isError ? '#e53e3e' : '#48bb78';
        statusEl.style.display = 'block';
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 2000);
    }
}

// Load saved options
function loadOptions() {
    console.log('Loading options...');
    chrome.storage.sync.get({
        // Default values
        priceAlerts: true,
        dealAlerts: true,
        autoCompare: true,
        includeUsed: false,
        autoSync: true,
        shareEnabled: true
    }, (items) => {
        console.log('Loaded options:', items);
        // Update checkboxes with saved values
        for (const [key, element] of Object.entries(options)) {
            if (element) {
                element.checked = items[key];
            }
        }
    });
}

// Save options
function saveOptions() {
    console.log('Saving options...');
    const values = {};
    
    // Collect values from checkboxes
    for (const [key, element] of Object.entries(options)) {
        if (element) {
            values[key] = element.checked;
        }
    }

    console.log('Saving values:', values);
    
    // Save to chrome.storage.sync
    chrome.storage.sync.set(values, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving options:', chrome.runtime.lastError);
            showStatus('Error saving options!', true);
        } else {
            console.log('Options saved successfully');
            showStatus('Options saved!');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Options page loaded');
    loadOptions();
    
    // Add save button click handler
    if (saveButton) {
        saveButton.addEventListener('click', saveOptions);
    }
});
