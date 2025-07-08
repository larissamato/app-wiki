FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev mariadb-client \
    && docker-php-ext-install pdo pdo_mysql zip mbstring gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /usr/src/app

COPY . .

RUN composer install --no-interaction

RUN chown -R www-data:www-data /usr/src/app \
    && chmod -R 775 /usr/src/app/storage

EXPOSE 9000
CMD ["php-fpm"]
