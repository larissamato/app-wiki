FROM archlinux:latest

ENV NODE_ENV=development
ENV VITE_OPEN_URL=http://core-api
ENV VITE_API_URL=http://core-api/api
ENV VITE_API_WS=core-soketi
ENV VITE_API_ID=app-id
ENV VITE_API_KEY=app-key
ENV VITE_API_SECRET=app-secret
ENV PUSHER_WS_HOST=core-soketi
ENV MIX_PUSHER_WS_HOST=core-soketi
ENV TERM=xterm-256color

RUN pacman --noconfirm -Syu && pacman --noconfirm -S \
    git \
    chromium \
    nodejs-lts-iron \
    npm \
    gtk2 \
    gtk3 \
    libnotify \
    nss \
    xscreensaver \
    alsa-lib \
    libxtst \
    libxss \
    xorg-xauth \
    xorg-server-xvfb

RUN npm install -g serve

RUN groupadd dev -g 1000 && \
    useradd dev -u 1000 -g 1000

RUN mkdir -p /usr/src/app/node_modules && \
    chown -R dev: /usr/src/app && \
    mkdir -p /home/dev && \
    chown -R dev: /home/dev

WORKDIR /usr/src/app

USER dev

COPY --chown=dev:dev package* /usr/src/app/

RUN npm install --no-audit --include dev && \
    npx playwright install

COPY --chown=dev:dev . .

CMD ["serve", "-s", "dist", "-l", "5173"]
