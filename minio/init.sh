#!/bin/sh

mc alias set local http://localhost:9000 minioadmin minioadmin

mc ls local/product-images || mc mb local/product-images