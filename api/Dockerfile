# build skywalking php extension (source: https://github.com/apache/skywalking-php/blob/master/docker/Dockerfile)
FROM php:8.2-fpm-bookworm AS skywalkingbuilder

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.64.0

RUN apt update \
        && apt install -y wget protobuf-compiler libclang-dev \
        && wget https://static.rust-lang.org/rustup/archive/1.25.1/x86_64-unknown-linux-gnu/rustup-init \
        && chmod +x rustup-init \
        && ./rustup-init -y --no-modify-path --profile minimal --default-toolchain $RUST_VERSION --default-host x86_64-unknown-linux-gnu \
        && rm rustup-init \
        && chmod -R a+w $RUSTUP_HOME $CARGO_HOME \
        && pecl install skywalking_agent-0.7.0 \
        && docker-php-ext-enable skywalking_agent \
        && apt-get remove -y --auto-remove wget protobuf-compiler \
        && rm -rf /var/lib/apt/lists/*

# start the app image
FROM php:8.2-fpm-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    pandoc \
    curl \
    libjpeg-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libldap2-dev \
    libpq-dev \
    zip \
    unzip \
    protobuf-compiler \
    python3 \
    python3-requests \
    python3-pyvmomi \
    ansible

# install community.vmware ansible collection
RUN ansible-galaxy collection install community.vmware

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Disable vulnerable iconv encodings (CVE-2024-2961)
RUN cd /usr/lib/x86_64-linux-gnu/gconv/gconv-modules.d \
    && cat gconv-modules-extra.conf | grep -v -E 'CN-?EXT' > gconv-modules-extra-patched.conf \
    && rm -f gconv-modules-extra.conf ../gconv-modules.cache \
    && iconvconfig \
    && iconv -l | grep -E 'CN-?EXT' && exit 1 || true

# Configure gd with jpeg
RUN docker-php-ext-configure gd --with-jpeg

# Install PHP extensions
RUN docker-php-ext-install opcache mysqli pgsql pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip ldap

# Install redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install xdebug for testing environment
RUN pecl install xdebug

# Use production php.ini
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Don't show X-Powered-By header
RUN echo 'expose_php = off' >> "$PHP_INI_DIR/php.ini"

# Get latest Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Get NodeJS
COPY --from=node:20-slim /usr/local/bin /usr/local/bin

# Get npm
COPY --from=node:20-slim /usr/local/lib/node_modules /usr/local/lib/node_modules

COPY --from=hashicorp/terraform:1.10 /bin/terraform /usr/bin/terraform

RUN echo '[www]' > /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'pm = dynamic' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'pm.max_children = 1000' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'pm.start_servers = 60' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'pm.min_spare_servers = 30' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'pm.max_spare_servers = 120' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'pm.max_requests = 5000' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'php_admin_value[memory_limit] = 1024M' >> /usr/local/etc/php-fpm.d/zz-opdc.conf && \
    echo 'access.log = /dev/null' >> /usr/local/etc/php-fpm.d/zz-opdc.conf

RUN cd /usr/local/etc/php/conf.d/ && \
  echo 'memory_limit = 2048M' > zz-opdc.ini && \
  echo 'upload_max_filesize = 500M' >> zz-opdc.ini && \
  echo 'post_max_size = 500M' >> zz-opdc.ini

# get skywalking extension from skywalkingbuilder
COPY --from=skywalkingbuilder /usr/local/lib/php/extensions/no-debug-non-zts-20220829/skywalking_agent.so /usr/local/lib/php/extensions/no-debug-non-zts-20220829/

# configure skywalking agent
RUN echo '[skywalking_agent]' > /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'extension = skywalking_agent.so' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.enable = On' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.log_file = /tmp/skywalking-agent.log' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.log_level = "INFO"' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.skywalking_version = 9' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.enable_zend_observer = On' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.server_addr = grpc.opdc-skywalking.svc.cluster.local:11800' >> /usr/local/etc/php/conf.d/skywalking.ini && \
    echo 'skywalking_agent.service_name = "${APP_NAME}"' >> /usr/local/etc/php/conf.d/skywalking.ini

# Create app directory
RUN mkdir -p /usr/src/app

RUN useradd -G www-data -u 1000 -d /home/app app && \
    mkdir -p /home/app/.composer && \
    chown -R app:app /home/app && \
    echo 'set -o vi' > /home/app/.bashrc && \
    echo '"\C-l":clear-screen' > /home/app/.inputrc && \
    echo 'set editing-mode vi' >> /home/app/.inputrc && \
    echo 'bind -v' > /home/app/.editrc

WORKDIR /usr/src/app

COPY composer.* package.* /usr/src/app/

RUN composer install --no-scripts && npm install

COPY . /usr/src/app

# add version info
RUN echo "{\"version\": \"`git describe --tags 2>/dev/null`\", \"release\": \"`git branch | grep '^\*' | cut -c 3-`\", \"build\": \"`git rev-parse --short HEAD`\"}" > storage/app/version.json; rm -rf .git

RUN chown -R app: /usr/src/app

USER app

RUN composer install && \
    npm run build

RUN php artisan cache:clear && \
    php artisan config:clear

CMD ["sh", "./docker-entrypoint.sh"]
