#!/bin/bash

echo "Removing timestamped Vite config files from the directory..."
find . -name 'vite.config.ts.timestamp-*.mjs' -exec rm -f {} \;

echo "Adding pattern to .gitignore..."
echo "vite.config.ts.timestamp-*.mjs" >> .gitignore

echo "Cleanup complete!"
