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

  cp -v hashdiv.py ~/apps/hashdiv/myapp
}

start() {
  ~/apps/hashdiv/start
}

stop() {
  ~/apps/hashdiv/stop
}

logs() {
  tail -f ~/logs/apps/hashdiv/uwsgi.log
}

backup-config() {
  cp -v ~/apps/hashdiv/uwsgi.ini .
}

"$@"
