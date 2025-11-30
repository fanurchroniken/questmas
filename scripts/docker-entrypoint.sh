#!/bin/sh
set -e

TEMPLATE_PATH="/etc/nginx/conf.d/default.conf.template"
OUTPUT_PATH="/etc/nginx/conf.d/default.conf"

: "${PORT:=80}"

envsubst '$PORT' < "$TEMPLATE_PATH" > "$OUTPUT_PATH"

exec nginx -g "daemon off;"

