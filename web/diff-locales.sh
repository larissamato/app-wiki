#!/bin/bash
# @powered by Hudson3384 :)

CUT_FILE () {
  jq -r 'keys[]' "$1"
}

DIFF_FILES () {
  PT_FILE="./src/locales/pt.json"
  EN_FILE="./src/locales/en.json"

  PT_KEYS=$(CUT_FILE "$PT_FILE")
  EN_KEYS=$(CUT_FILE "$EN_FILE")

  echo "Comparing EN.json and PT.json"
  diff --color=always <(echo "$PT_KEYS") <(echo "$EN_KEYS")
  echo "Comparing EN.json and PT.json"
}

DIFF_FILES
