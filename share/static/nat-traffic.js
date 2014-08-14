(function ($, config, dots, flot, job) {
  $('.plug-flot').on('plotclick', function (event, pos, item) {
    if (!item) return;
    location.hash = '#!/' + item.series.label[0] + '/' + item.series.label;
  });
  config = {
    series: {
      lines: {
        show: true
      },
      points: {
        show: true
      }
    },
    grid: {
      clickable: true,
      hoverable: true
    },
    legend: {
      noColumns: 6,
      labelFormatter: function (label, name) {
        switch (label) {
          case '21':
            name = '\u6021\u541b';
            break;
          case '22':
            name = '\u8273\u6885';
            break;
          case '61':
            name = '\u670b\u670b';
            break;
          case '62':
            name = '\u5217\u6052';
            break;
          case '63':
            name = '\u8bb8\u4f1a';
            break;
          case '64':
            name = '\u6768\u96f7';
            break;
          case '65':
            name = '\u5e05\u5e05';
            break;
          case '66':
            name = '\u76f8\u7434';
            break;
          case '67':
            name = '\u90a2\u67f3';
            break;
          case '71':
            name = '\u90b1\u6668';
            break;
          case '72':
            name = '\u5fd7\u5f3a';
            break;
          case '73':
            name = '\u4fca\u9e4f';
            break;
          case '74':
            name = '\u6587\u541b';
            break;
          case '75':
            name = '\u660e\u4e50';
            break;
          case '76':
            name = '\u8463\u5029';
            break;
          case '91':
            name = '\u6234\u5bc5';
            break;
          case '92':
            name = '\u715c\u5b87';
            break;
          case '93':
            name = '\u524d\u8fdb';
            break;
          default:
            return label;
        }
        return '<a href="#!/' + label[0] + '/' + label + '">' + name + '</a>';
      }
    },
    xaxis: {
      mode: 'time',
      timezone: 'browser'
    },
    yaxis: {
      ticks: function (axis, ticks, ret, ii) {
        ticks = [4, 16, 32, 48, 64, 128, 192, 256, 512, 768, 1024, 2048, 3072, 4096, 8192, 12288, 16384];
        ret = [];
        for (ii in ticks) {
          ii = ticks[ii];
          ret.push([1024 * ii, ii]);
          if (1024 * ii > axis.datamax) break;
        }
        return ret;
      }
    }
  };
  dots = {};
  flot = function (re, data, host) {
    re = '^.*$';
    if (location.hash.length && '#!/' == location.hash.substr(0, 3)) {
      re = location.hash.substr(3);
      if (-1 == re.indexOf('/'))
        re = '^' + re;
      else
        re = '^' + re.split('/')[1] + '$';
    }
    re = new RegExp(re);
    data = [];
    for (host in dots['in'])
      if (host.match(re))
        data.push(dots['in'][host]);
    $.plot('.plug-flot', data, config);
  };
  job = function () {
    $.getJSON('v/traffic.json', function (data, host, time) {
      dots['in'] = {};
      dots.out = {};
      for (host in data) {
        dots['in'][host] = {
          label: host,
          data: []
        };
        dots.out[host] = {
          label: host,
          data: []
        };
        for (time in data[host]) {
          dots['in'][host].data.push([1000 * time, data[host][time]['in'] / 60]);
          dots.out[host].data.push([1000 * time, data[host][time].out / 60]);
        }
      }
      flot();
    });
  };
  $(window).on('hashchange', flot);
  setInterval(job, 60000);
  job();
}(jQuery));
