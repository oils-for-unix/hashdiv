#!/usr/bin/env bash
#
# Usage:
#   ./run.sh <function name>

set -o nounset
set -o pipefail
set -o errexit

deps() {
  sudo apt-get install python3-venv  # Ubuntu 18.04 needs this
}

# Similar to dreamhost
create-venv() {
  python3 -m venv _venv
}

# Requires virtualenv to be active
#
# . _venv/bin/activate
serve-hashdiv() {
  FLASK_ENV=development FLASK_APP=main.py flask run
}

serve-soil-receive() {
  FLASK_ENV=development FLASK_APP=soil_receive.py flask run
}

git-merge-to-master() {
  local do_push=${1:-T}  # pass F to disable

  local branch=$(git rev-parse --abbrev-ref HEAD)

  if test "$do_push" = T; then
    git checkout master &&
    git merge $branch &&
    git push &&
    git checkout $branch
  else
    git checkout master &&
    git merge $branch &&
    git checkout $branch
  fi
}

"$@"
