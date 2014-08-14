#!/usr/bin/python

import sys
import os
import re
import sqlite3
import time

os.chdir(os.path.dirname(sys.argv[0]) + '/../..');

def rows(ts):
    for line in sys.stdin.readlines():
        row = re.split('\s+', line)
        yield (row[0], ts, row[1], row[2])

try:
    dbconn = sqlite3.connect('var/db/nat.sqlite')
    dbcur = dbconn.cursor()
    dbcur.executemany('INSERT INTO traffic VALUES (?, ?, ?, ?)', rows(int (time.time())))
    dbconn.commit()
    dbconn.close()
except sqlite3.Error as e:
    print >> sys.stderr, e.args[0]
