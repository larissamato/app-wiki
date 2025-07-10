#!/usr/bin/env bash

mysqldump app > /tmp/app.sql;

ssh root@open-github-runner-sp 'cd /var/www/dev-app-core && docker-compose exec app php artisan migrate:fresh'

scp /tmp/app.sql root@open-github-runner-sp:/var/lib/docker/volumes/dev-app-core_dbdata/_data/

#ssh root@open-github-runner-sp 'cd /var/www/dev-app-core && docker-compose exec db "mysql -u root -p < /var/lib/mysql/app.sql"'
