#!/usr/bin/env bash

CURR_PATH=$(dirname -- "$0");
STR_PATH=$CURR_PATH/../storage/app/legacy
INTRANET_DB_PATH=$STR_PATH/intranet.sqlite3
GLPI_DB_PATH=$STR_PATH/glpi.sqlite3
PAINEL_DB_PATH=$STR_PATH/painel.sqlite3
DB_PASSWORD='open!@!@!@'

#[ -f "$INTRANET_DB_PATH" ] && rm "$INTRANET_DB_PATH"
#[ -f "$PAINEL_DB_PATH" ] && rm "$PAINEL_DB_PATH"

#mysql2sqlite -f "$INTRANET_DB_PATH" --mysql-password "$DB_PASSWORD" -d intranet -e _sessions logs -u root -p && \
#mysql2sqlite -f "$GLPI_DB_PATH" --mysql-password "$DB_PASSWORD" -d glpi -t glpi_computers glpi_items_tickets glpi_groups glpi_tickets glpi_ticketfollowups -u root -p && \
#mysql2sqlite -f "$PAINEL_DB_PATH" --mysql-password "$DB_PASSWORD" -d helpdesk -e _sessions logs hr_ranking hr_ranking_details preticket_emails -u root -p && \

cd "$CURR_PATH"/.. || exit 1

php artisan migrate:fresh && \
php artisan db:seed --class SuperUserSeeder && \
php artisan legacy:import
