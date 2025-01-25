#!/bin/bash

# Clean up
rm -rf extension

# Create extension directory
mkdir -p extension
mkdir -p extension/js

# Copy static files
cp public/popup.html extension/
cp public/options.html extension/
cp public/manifest.json extension/
cp -r public/icons extension/

# Copy JavaScript files
cp public/js/popup.js extension/js/
cp public/js/content.js extension/js/
cp public/js/options.js extension/js/
cp public/js/socket.io.min.js extension/js/

echo "Extension files prepared successfully!"
