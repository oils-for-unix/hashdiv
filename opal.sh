#!/bin/bash
#
# Usage:
#   ./opal.sh <function name>


pip-install() {
  set -x

  # Activate OpalStack env template, which is Python 3.10

  . ~/apps/hashdiv/env/bin/activate

  python3 -m pip install -r requirements.txt
}

deploy() {
  # It's just one file

  local dest=~/apps/hashdiv/myapp

  cp -v -R -t $dest templates static hashdiv.py
}

start() {
  ~/apps/hashdiv/start
}

stop() {
  ~/apps/hashdiv/stop
}

logs() {
  #tail -f ~/logs/apps/hashdiv/uwsgi.log
  less ~/logs/apps/hashdiv/uwsgi.log
}

backup-config() {
  cp -v ~/apps/hashdiv/uwsgi.ini .
}

demo() {
  curl --include https://op.oils.pub/hashdiv/
}

"$@"
