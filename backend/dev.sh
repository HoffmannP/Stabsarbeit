#!/bin/bash

# npm install -g local-ssl-proxy
# local-ssl-proxy --source 5002 --target 5001 &

watchmedo auto-restart --pattern  "*.py" --recursive --signal SIGTERM python3 server.py