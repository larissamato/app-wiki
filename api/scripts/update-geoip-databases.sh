#!/usr/bin/env bash

scriptPath=$(dirname "$(readlink -f "$0")")

key='gLbt9pbk1uisUUII'

asnOrigFileName="dbip-asn-lite.mmdb"
cityOrigFileName="dbip-city-lite.mmdb"

function download {
    curl "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-$2&license_key=$key&suffix=tar.gz" > "/tmp/$1.tar.gz" &&
    tar -xzvf "/tmp/$1.tar.gz" -C /tmp/ &&
    mv -f /tmp/GeoLite2-$2*/GeoLite2-$2.mmdb "$scriptPath/../storage/geoip/$1"
}

download $asnOrigFileName ASN
download $cityOrigFileName City
