#!/bin/sh

php artisan cache:clear && \
php artisan config:clear && \
php artisan config:cache && \
php artisan optimize && \
php-fpm
