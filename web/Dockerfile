# nginx stable version = 1.24
FROM nginx:stable

COPY .docker/nginx/nginx.conf /etc/nginx

COPY .docker/nginx/conf.d/default.conf /etc/nginx/conf.d

COPY dist /usr/share/nginx/html
