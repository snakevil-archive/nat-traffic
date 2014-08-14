#!/bin/sh

/sbin/iptables -nvxL \
  | 'awk' ' \
  BEGIN { \
    idx[""] = 0; \
    tin[""] = 0; \
    tout[""] = 0; \
  } \
  "Chain" == $1 { \
    type = ""; \
    split($2, swap, "."); \
    if ("w" == swap[1] && swap[3]) type = swap[2]; \
  } \
  "i" == type && "RETURN" == $3 && "0" != $1 { \
    split($9, swap, "."); \
    idx[swap[4]] = swap[4]; \
    tin[swap[4]] = $2; \
  } \
  "o" == type && "ACCEPT" == $3 && "0" != $1 { \
    split($8, swap, "."); \
    idx[swap[4]] = swap[4]; \
    tout[swap[4]] = $2; \
  } \
  END { \
    delete idx[""]; \
    delete tin[""]; \
    delete tout[""]; \
    for (ii in idx) { \
      if (20 > ii) continue; \
      if (49 < ii && 60 > ii) continue; \
      if (!tin[ii]) tin[ii] = 0; \
      if (!tout[ii]) tout[ii] = 0; \
      print ii, tin[ii], tout[ii]; \
    } \
  }'

/sbin/iptables -Z

# vim:sw=2:ts=2:sts=2:
