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
            name = '怡君';
            break;
          case '22':
            name = '艳梅';
            break;
          case '61':
            name = '朋朋';
            break;
          case '62':
            name = '列恒';
            break;
          case '63':
            name = '许会';
            break;
          case '64':
            name = '杨雷';
            break;
          case '65':
            name = '帅帅';
            break;
          case '66':
            name = '相琴';
            break;
          case '67':
            name = '邢柳';
            break;
          case '71':
            name = '邱晨';
            break;
          case '72':
            name = '志强';
            break;
          case '73':
            name = '俊鹏';
            break;
          case '74':
            name = '文君';
            break;
          case '75':
            name = '明乐';
            break;
          case '76':
            name = '董倩';
            break;
          case '91':
            name = '戴寅';
            break;
          case '92':
            name = '煜宇';
            break;
          case '93':
            name = '前进';
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
        ticks = [4, 16, 32, 48, 64, 128, 192, 256, 512];
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
