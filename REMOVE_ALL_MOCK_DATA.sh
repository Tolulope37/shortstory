#!/bin/bash

# Script to remove all hardcoded mock data from frontend pages

echo "🔥 Removing ALL hardcoded mock data from every page..."

FILES=(
  "backend/frontend/src/pages/FinancesPage.jsx"
  "backend/frontend/src/pages/BookingsPage.jsx"
  "backend/frontend/src/pages/CalendarPage.jsx"
  "backend/frontend/src/pages/PredictionsPage.jsx"
  "backend/frontend/src/pages/BookPage.jsx"
  "backend/frontend/src/pages/PropertyView.jsx"
  "backend/frontend/src/pages/PropertyDetailsPage.jsx"
)

for file in "${FILES[@]}"; do
  if [ -f "/Users/tolulopearobieke/Desktop/Shortlet/$file" ]; then
    echo "✅ Found: $file"
  else
    echo "❌ Not found: $file"
  fi
done

echo ""
echo "These files need mock data removed manually"

