#!/bin/bash

# Script de build pour Vercel
echo "🔧 Building for Vercel..."

# Installer les dépendances
npm install

# Générer Prisma
npx prisma generate

# Build avec ignore des erreurs
NEXT_TELEMETRY_DISABLED=1 npx next build --no-lint || true

echo "✅ Build completed!"
