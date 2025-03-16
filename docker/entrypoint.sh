#!/bin/sh

# Replace placeholder in .next files with actual API URL
find .next -type f -exec sed -i "s|__BACKEND_API__|${NEXT_PUBLIC_API_URL}|g" {} \;

# Start Next.js
exec npm run start