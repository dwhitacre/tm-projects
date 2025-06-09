#!/usr/bin/env bash

function watch_fs() {
  if [[ "$#" -eq 0 ]]; then return; fi

  local chsum1s=()
  local dirs=("$@")

  for dir in "${dirs[@]}"; do
    chsum1s+=("")
  done

  log "white" "Watching ${dirs[*]} for changes..."

  while true; do
    for i in "${!dirs[@]}"; do
      local dir="${dirs[$i]}"
      local chsum2="$(find "$dir" -type f -exec md5sum {} \; 2>/dev/null)"
      if [[ "${chsum1s[$i]}" != "$chsum2" ]]; then
        if [[ -n "${chsum1s[$i]}" ]]; then
          return
        fi
        chsum1s[$i]="$chsum2"
      fi
    done
    sleep 1
  done
}
