#!/bin/sh

cd `'dirname' "$0"`/../..

[ '0000' != `'date' +'%H%M'` ] || {
    'mv' 'var/db/nat.sqlite' "var/db/nat-$('date' +'%y%m%d').sqlite"
    'cp' -a 'var/db/nat.dist.sqlite' 'var/db/nat.sqlite'
}

/bin/sh share/lib/dump.sh | /usr/bin/python share/lib/import.py
