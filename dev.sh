#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Start backend
cd "$ROOT/backend"
npm run dev &
BACKEND_PID=$!

# Start frontend
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to be ready then open Chrome
echo "Waiting for servers to start..."
sleep 4
xdg-open http://localhost:5174 2>/dev/null || google-chrome http://localhost:5174 2>/dev/null || chromium-browser http://localhost:5174 2>/dev/null

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers"

# Keep script alive and kill both on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
