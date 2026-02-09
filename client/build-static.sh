#!/bin/bash
echo "🏗️  Building React application for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
if [ -d "build" ]; then
  echo "✅ Build successful!"
  echo "📁 Build output:"
  ls -la build/
  echo "🚀 Ready for deployment!"
else
  echo "❌ Build failed!"
  exit 1
fi
