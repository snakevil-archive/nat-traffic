#!/usr/bin/python

import sys
import os
import time
import sqlite3
import json

os.chdir(os.path.dirname(sys.argv[0]) + '/../..');

ts0 = 0
if 1 < len(sys.argv):
    ts0 = int (time.time()) - 60 * int (sys.argv[1])

ret = {}

dbconn = sqlite3.connect('var/db/nat.sqlite')
dbcur = dbconn.cursor()
dbcur.execute('SELECT * FROM `traffic` WHERE `Time` > ?', [ts0])
for dbrow in dbcur:
    if dbrow[0] not in ret:
        ret[dbrow[0]] = {}
    ret[dbrow[0]][dbrow[1]] = {
        'in': dbrow[2],
        'out': dbrow[3]
    }
dbconn.close()

fh = open('var/static/traffic.json', 'w')
fh.write(json.dumps(ret))
fh.close()

# vim:tw=120:
