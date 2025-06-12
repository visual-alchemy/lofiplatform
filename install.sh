#!/bin/bash

echo "Installing Lo-Fi Streaming Platform..."

# Update system packages
sudo apt update

# Install FFmpeg
echo "Installing FFmpeg..."
sudo apt install -y ffmpeg

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Run setup script
echo "Running setup script..."
npm run setup

# Set up PM2 startup
echo "Setting up PM2 startup..."
pm2 startup
pm2 save

echo "✅ Installation complete!"
echo ""
echo "To start the application:"
echo "  Development: npm run dev"
echo "  Production:  npm run start:prod"
echo ""
echo "Access the dashboard at: http://localhost:3000"
