#!/bin/bash
#
# Usage:
#   ./run.sh <function name>

set -o nounset
set -o pipefail
set -o errexit

# Use ~/git/dreamhost/flask/dreamhost.sh to build Python

readonly PY=Python-3.9.1

py3() {
  $HOME/opt/$PY/bin/python3.9 "$@"
}

create-venv() {
  py3 -m venv _venv
}

py-deps() {
  . _venv/bin/activate

  # Versions as of 1/2/2021
  pip3 install 'flask==1.1.2' 'flup==1.0.3'
}

deploy() {
  local dir=~/dr.shxa.org/hashdiv
  mkdir -p $dir
  cp -v .htaccess dispatch.fcgi $dir
}

"$@"
