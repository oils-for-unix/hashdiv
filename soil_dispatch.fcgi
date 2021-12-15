#!/bin/sh
dir=$HOME/git/oilshell/hashdiv
. $dir/_venv/bin/activate
exec python3.9 $dir/soil_dispatch.py
