#!/bin/bash

# Clean up
rm -rf extension
rm -rf out
rm -rf .next

# Build the Next.js app
npm run build

# Create extension directory
mkdir -p extension

# Copy the build output
cp -r out/* extension/

# Copy extension files
cp public/manifest.json extension/
cp -r public/icons extension/

# Create static directory
mkdir -p extension/static
mv extension/_next/static/* extension/static/
rm -rf extension/_next

# Fix paths in HTML files
find extension -name "*.html" -type f -exec sed -i 's/\/_next\/static\//\/static\//g' {} +

echo "Extension files prepared successfully!"
