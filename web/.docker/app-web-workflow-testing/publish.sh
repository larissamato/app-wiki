#!/usr/bin/env bash

cd ../../ && \
docker build . -f test.Dockerfile -t app-web-testing:main && \
docker tag app-web-testing:main cpr.opendata.center/app-web-testing:main && \
docker push cpr.opendata.center/app-web-testing:main
