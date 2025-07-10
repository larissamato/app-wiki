#!/bin/bash

mkdir -p dist &&
  docker-compose up -d --wait --wait-timeout 300 &&
  docker-compose exec test npm i &&
  docker-compose exec -e NODE_OPTIONS="--max-old-space-size=8192" test npm run build &&
  docker-compose exec test npx playwright install &&
  docker-compose restart test &&
  docker-compose exec core-minio /usr/bin/mc alias set myminio http://core-minio:9000 minioadmin minioadmin &&
  docker-compose exec core-minio /usr/bin/mc mb myminio/ticket-attachments &&
  docker-compose exec core-minio /usr/bin/mc mb myminio/contracts &&
  docker-compose exec core-minio /usr/bin/mc mb myminio/discovery &&
  docker-compose exec core-minio /usr/bin/mc mb myminio/kb-articles &&
  docker-compose exec core-minio /usr/bin/mc mb myminio/proposals &&
  docker-compose exec core-app php artisan migrate:fresh &&
  docker-compose exec core-app php artisan db:seed --class TestingAppWebSeeder &&
  docker-compose exec core-app php artisan app:suser-sprite &&
  docker-compose exec test npx playwright test --retries 4 --max-failures 1 --reporter=list --workers=8 &&
  docker-compose exec test npx nyc report --reporter=lcov
