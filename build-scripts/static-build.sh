#!/bin/bash
# Generic static hosting build script

echo "Building for static hosting deployment..."

# Set environment for static build
export NODE_ENV=production
export VITE_BUILD_TARGET=static

# Run the build
npm run build

# Normalize output directory structure for static hosting
if [ -d "dist/public" ]; then
    echo "Converting Replit build structure to standard static hosting format..."
    # Move everything from dist/public to dist root
    mv dist/public/* dist/
    rmdir dist/public
    echo "Build structure normalized for static hosting"
fi

# Copy any additional static files
if [ -f "client/_redirects" ]; then
    cp client/_redirects dist/_redirects
fi

# Create a simple 404.html for better error handling
if [ ! -f "dist/404.html" ]; then
    cp dist/index.html dist/404.html
    echo "Created 404.html for SPA fallback"
fi

echo "Static build completed successfully!"