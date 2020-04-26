function anison_init() {
  var anison_player = jQuery("#anison_player");
  var anison_btns   = jQuery("#anison .player_btn");
  var anison_start  = jQuery("#anison_start");
  var anison_stop   = jQuery("#anison_stop");

  var stream = {
        title: "Anison.FM",
        mp3: "http://pool.anison.fm:9000/AniSonFM(320)"
    },
    ready = false;
    anison_player.jPlayer({
        ready: function (event) {
            ready = true;
            $(this).jPlayer("setMedia", stream);
        },
        pause: function() {
            $(this).jPlayer("clearMedia");
        },
        error: function(event) {
            if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                $(this).jPlayer("setMedia", stream).jPlayer("play");
            }
        },
        swfPath: "//anison.fm/scripts/jplayer/jquery.jplayer.swf",
        supplied: "mp3",
        preload: "none",
        wmode: "window",
        useStateClassSkin: false,
        autoBlur: false,
        keyEnabled: false
    });
    anison_start.click(function() {
    anison_player.jPlayer('play');
    anison_btns.toggleClass("active");
  });
  anison_stop.click(function() {
    anison_player.jPlayer("stop");
    anison_btns.toggleClass("active");
  });
};


function f_duration(j_duration) {
  // парсим время
  var j_time = "";

  var j_hours = Math.floor(j_duration / 3600);
  var j_mod_mins = j_duration % 3600;
  var j_mins = Math.floor(j_mod_mins / 60);
  var j_secs = Math.floor(j_mod_mins % 60);

  if (j_hours > 0) {
    j_time += j_hours + ":";
    if (j_mins < 10) {
      j_mins = "0" + j_mins;
    }
  }
  if (j_secs < 10) {
    j_secs = "0" + j_secs;
  }

  j_time += j_mins + ":" + j_secs;
  return j_time;
}

var j_air_pause = 0;
function f_timer(duration) {
  // обратный отсчет продолжительности
  clearInterval(this.counter);
  var j_duration = jQuery("#duration");
  j_duration.html(f_duration(duration));
  this.counter = window.setInterval(function() {
    duration = duration - 1;
    if (duration > 0) {
      j_air_pause = 0;
      j_duration.html(f_duration(duration));
    } else {
      clearInterval(this.counter);
      j_air_pause++;
      j_duration.html("0:00");
      var j_timeout = 500;
      if (j_air_pause < 6) {
        window.setTimeout(function() {
          f_update();
        }, 500);
      }
    }
  }, 1000)
}

var update_timer = 20000;

function f_update() {
  // обновляем инфу, обновление инфы идет по дефолту, если не задан другой параметр
  var j_url = "//anison.fm/status.php?widget=true";
  var j_options = jQuery("#anison").attr("options");
  if (j_options == "nofollow") {
    j_url += "&nofollow=true";
  }
  jQuery.ajax({
    type: "GET",
    dataType: "jsonp",
    url: j_url,
    success: function (data, textStatus) {
      // обновляем список слушателей
      var j_listeners = jQuery("#listeners");
      var listeners = data.listeners;
      j_listeners.html(listeners);

      // обновляем текущий трек в эфире
      var j_on_air = jQuery("#on_air");
      var on_air = data.on_air;
      j_on_air.html(on_air);

      // обновляем время воспороизведения
      var duration = data.duration;
      f_timer(parseInt(duration));
    }
  })
}

function f_update_circle() {
  // обновляет инфу через заданное время
  clearInterval(this.update);
  this.update = window.setInterval(function() {
    f_update();
  }, update_timer);
}

jQuery(document).ready(function() {
  var anison = jQuery("#anison");
  var j_style = "\n";

  // считываем параметры
  var anison_w = parseInt(anison.attr("width"));
  if (anison_w > 100) {
    var volume_block_w = anison_w - 31;
    var volume_area_w = anison_w - 78;
    var volume_level_w = anison_w - 82;
    var jp_audio_w = anison_w - 39;
    j_style += "<style>\n";
    j_style += "  #anison.radio_info {min-width: " + anison_w + "px; width: " + anison_w + "px;}\n";
    j_style += "    #anison.radio_info .icon-volume-block {width: " + volume_block_w + "px;}\n";
    j_style += "    #anison.radio_info .icon-volume-area {width: " + volume_area_w + "px;}\n";
    j_style += "    #anison.radio_info .icon-volume-level {width: " + volume_level_w + "px;}\n";
    j_style += "      #anison.radio_info .anison_player_container .jp-audio {width: " + jp_audio_w + "px;}\n";
    j_style += "</style>\n";
  }
  var j_options = jQuery("#anison").attr("options");
  if (j_options == "nofollow") {
    var rel = " rel='nofollow'";
  } else {
    var rel = "";
  }

  // создаем структуру
  var anison_code  = '\n';
  // anison_code += '<div class="anison_title">\n';
  // anison_code += '\n';
  // anison_code += '</div>\n';

  if (jQuery.jPlayer) {
    anison_code += '<div class="anison_player_container">\n';
    anison_code += '  <div id="anison_player"></div>\n';
    anison_code += '  <div id="anison_start" title="&#1057;&#1090;&#1072;&#1088;&#1090;" class="player_btn icon-btn-ball start active">\n'; // Старт
    anison_code += '    <i class="icon-play"></i>\n';
    anison_code += '  </div>\n';
    anison_code += '  <div id="anison_stop" title="&#1057;&#1090;&#1086;&#1087;" class="player_btn icon-btn-ball stop">\n'; // Стоп
    anison_code += '    <i class="icon-stop"></i>\n';
    anison_code += '  </div>\n';
    anison_code += '  <div id="jp_container_1" class="jp-audio icon-volume-block">\n';
    anison_code += '    <a href="javascript:void(0);" title="&#1042;&#1099;&#1082;&#1083;&#1102;&#1095;&#1080;&#1090;&#1100; &#1079;&#1074;&#1091;&#1082;" class="mute_btn jp-mute" rel="nofollow">\n'; // Выключить звук
    anison_code += '      <i class="icon-volume"></i>\n';
    anison_code += '    </a>\n';
    anison_code += '    <a href="javascript:void(0);" title="&#1042;&#1082;&#1083;&#1102;&#1095;&#1080;&#1090;&#1100; &#1079;&#1074;&#1091;&#1082;" class="mute_btn jp-unmute" rel="nofollow">\n'; // Включить звук
    anison_code += '      <i class="icon-unvolume"></i>\n';
    anison_code += '    </a>\n';
    anison_code += '    <div class="jp-volume-bar icon-volume-area">\n';
    anison_code += '      <div class="jp-volume-bar-value icon-volume-level">\n';
    anison_code += '        <i class="volume_dot icon-volume-dot"></i>\n';
    anison_code += '      </div>\n';
    anison_code += '    </div>\n';
    anison_code += '  </div>\n';
    anison_code += '</div>\n';
  } else {
    anison_code += '<div class="anison_link_new_window">\n';
    anison_code += '  <a href="javascript:void(o);" onclick="javascript:window.open(\'//anison.fm/vk/\',\'anison_window\',\'width=650,height=450,menubar=no,toolbar=no,location=no,directories=no,status=no,resizable=no,scrollbars=no\');">\n';
    anison_code += '    &#1057;&#1083;&#1091;&#1096;&#1072;&#1090;&#1100;&#32;&#1074;&#32;&#1085;&#1086;&#1074;&#1086;&#1084;&#32;&#1086;&#1082;&#1085;&#1077;\n';
    anison_code += '  </a>\n';
    anison_code += '</div>\n';
  }

  anison_code += '</div>\n';
  if (jQuery.jPlayer) {
/*
    anison_code += '<div class="track_info">\n';
    anison_code += '  <div class="track_info_str">\n';
    anison_code += '     <span id="on_air"></span>\n';
    anison_code += '  </div>\n';
    anison_code += '  <div class="track_info_str">\n';
    anison_code += '    <span class="text">&#1044;&#1086; &#1082;&#1086;&#1085;&#1094;&#1072; &#1090;&#1088;&#1077;&#1082;&#1072; &#1086;&#1089;&#1090;&#1072;&#1083;&#1086;&#1089;&#1100;:</span>\n'; // До конца трека осталось:
    anison_code += '    <span id="duration"></span>\n';
    anison_code += '  </div>\n';
    anison_code += '  <div class="track_info_str">\n';
    anison_code += '    <span id="listeners"></span>\n';
    anison_code += '  </div>\n';
    anison_code += '</div>\n';
*/
  }
  anison_code += '</div>\n';
  anison_code += j_style;
  anison.addClass("radio_info").html(anison_code);

  if (jQuery.jPlayer) {
    // подключаем плеер
    anison_init();
  }

  f_update();
  f_update_circle();
})
