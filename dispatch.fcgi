#!/bin/sh
dir=/home/chubot/git/oilshell/hashdiv
. $dir/_venv/bin/activate
exec python3.9 $dir/dispatch.py
