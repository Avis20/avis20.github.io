// --- COOKIE ----------------------------------------------------------
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// --- TEXTBOX PLACEHOLDERS --------------------------------------------
jQuery(document).ready(function() {
  if(jQuery.placeholder) {
    jQuery("input[placeholder], textarea[placeholder]").placeholder();
  }
});

// --- TOOLBARS --------------------------------------------------------
function toolbar_fix() {
  var j_scroll = jQuery(window).scrollTop();
  var j_tb = jQuery("#top_panel");
  if (j_scroll > 0) {
    j_tb.addClass("fixed");
  } else {
    j_tb.removeClass("fixed");
  }
  if(j_scroll > 410 | window.chat == true) {
  	$('.header div.listeners').hide();
		$('.header .topbar').show();
  } else {
  	$('.header div.listeners').show();
		$('.header .topbar').hide();
  }
}

toolbar_fix()
jQuery(document).ready(function() {
  jQuery(window).scroll(function() {
    toolbar_fix()
  });
  toolbar_fix();
})

// --- ADBLOCK  BANNER -------------------------------------------------
function ad_check () {
	var banner = $('.rightb_in');
	var google_in = $('.adsbygoogle');
	if(banner.height() < 101 || google_in.html() == '') {
		if(google_in.html() == '') google_in.css('display', 'none');
		banner.append('<a href="/about/adblock"><img src="/images/taskette.png"></a>');
	}
}
jQuery(document).ready(function() {
	setTimeout(function () {
		ad_check();
	}, 3000);
})

// --- CROSSTAB VOLUME -------------------------------------------------
var volume;
var crosstab_volume = duel.channel('crosstab_volume');
crosstab_volume.on('update', function (volume) {
	if(volume == -1)
	  $("#anison_player").jPlayer('option', 'muted', true);
	else
	  $("#anison_player").jPlayer('option', 'muted', false);
    $("#anison_player").jPlayer('option', 'volume', volume);
    console.log('Volume broadcast received:' + volume);
});


// --- ANISON PLAYER ---------------------------------------------------
function anison_init() {
  var
  anison_player = jQuery("#anison_player"),
  anison_btns   = jQuery("#anison .player_btn"),
  anison_start  = jQuery("#anison_start"),
  anison_stop   = jQuery("#anison_stop"),

  volume_local = ((getCookie("volume")) ? getCookie("volume") : '0.8'),
  stream = function() {
		return {
	    title: "Anison.FM",
		  mp3: "https://pool.anison.fm/AniSonFM(320)?nocache=" + Math.random()
		};
  },
  ready = false,
  playing = false;

  anison_player.jPlayer({
		ready: function (event) {
			ready = true;
			$(this).jPlayer("setMedia", stream());
		},
	  canplay: function (event) {
			NProgress.done();
	  },
		play: function () {
			NProgress.start();
		  playing = true;
		},
		pause: function() {
			$(this).jPlayer("setMedia", stream());
			anison_btns.toggleClass("active");
			playing = false;
		},
		error: function(event) {
			if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
				$(this).jPlayer("setMedia", stream()).jPlayer("play");
				console.log('[Stream] Error: URL_NOT_SET');
			}
			if(playing && event.jPlayer.error.type === $.jPlayer.error.URL) {
				setTimeout(function () {
					  $(this).jPlayer("setMedia", stream()).jPlayer("play");
					  console.log('[Stream] Reloaded!');
		      }, 1000);
				console.log('[Stream] Reloading ...');
			}
		},
		stalled: function () {
	    $(this).jPlayer("setMedia", stream()).jPlayer("play");
			console.log('[Stream] Stream stalled. Reloaded!');
		},
		swfPath: "//anison.fm/scripts/jplayer/jquery.jplayer.swf",
		supplied: "mp3",
		preload: "none",
		wmode: "window",
		useStateClassSkin: false,
		autoBlur: false,
		keyEnabled: false,
		volume: volume_local,
		volumechange: function (event) {
				if(event.jPlayer.options.muted) {
				  volume = -1;
				  $('.jp-volume-bar').slider("value", 0);
			  }
			  else {
				  volume = event.jPlayer.options.volume;
				  $('.jp-volume-bar').slider("value", event.jPlayer.options.volume);
			  }
			  if(!unloading)
			    crosstab_volume.broadcast('update', volume);
		    else {
		    	volume_local = ((getCookie("volume")) ? getCookie("volume") : '0.8');
		      crosstab_volume.broadcast('update', volume_local);
		    }
		}
	});
	anison_start.click(function() {
		anison_player.jPlayer('play');
    anison_btns.toggleClass("active");
  });
  anison_stop.click(function() {
    anison_player.jPlayer("stop");
  });

	$('.jp-volume-bar').slider({
		animate: "fast",
		max: 1,
		range: "min",
		step: 0.01,
		value : volume_local,
		slide: function(event, ui) {
			anison_player.jPlayer("option", "muted", false);
			anison_player.jPlayer("option", "volume", ui.value);
			if (window.isMaster() & $('#anison_player').jPlayerFade().isFading() != true) {
        document.cookie = "volume=" + ui.value + "; path=/; expires=15/02/2027 00:00:00";
			}
		}
	});
};

// ---- TIMER AND STATUS -----------------------------------------------
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
  var j_duration = jQuery("#duration, .wind1 duration");
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
      if (j_air_pause < 3 && document.body.className != "hidden") {
        window.setTimeout(function() {
          f_update();
        }, 500);
      }
    }
  }, 1000)
}

var update_timer = 15000;

var crosstab_status = duel.channel('crosstab_status');
crosstab_status.on('update', function (data, textStatus) {
	update_status (data, textStatus);
});

// снижаем интервал обновления статуса и выключаем обновление в 0:00 для неактивных вкладок
var evenodd = false;
(function() {
  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide
    = window.onfocus = window.onblur = onchange;

  function onchange (evt) {
    var v = "visible", h = "hidden",
        evtMap = {
          focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
        };

    evt = evt || window.event;
    if (evt.type in evtMap) {
      document.body.className = evtMap[evt.type];
    }
    else {
      document.body.className = this[hidden] ? "hidden" : "visible";
    }
    if(j_air_pause > 0) {
      console.log("Update on visibility change.");
      f_update();
    }
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if( document[hidden] !== undefined )
    onchange({type: document[hidden] ? "blur" : "focus"});
})();

function f_update(initial) {
  // меняем переменную чередования для фонового режима 
  if(document.body.className == "hidden") {
    if(evenodd == true)
    	evenodd = false;
    else
    	evenodd = true;
  // и выходим, если не четный запуск в фоновом режиме
    if(evenodd == false)
    	return;
  }
  // обновляем инфу, обновление инфы идет по дефолту, если не задан другой параметр
  if (window.isMaster() || initial == 1) {
    // обновляем только в открытой (последней) вкладке
	  $.ajax({
	    type: "GET",
	    dataType: "jsonp",
	    url: '//anison.fm/status.php',
	    success: function(data, textStatus) {
	      crosstab_status.broadcast('update', data, textStatus);
	      update_status (data, textStatus);
	    }
	  });
  }
}

function urlencode (str) {
  str = (str + '')
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+')
}

function update_status (data, textStatus) {
  // обновляем список заказов
	var j_orders_list = $("#orders_list, .wind1 #orders_list");
	var orders_list = data.orders_list;
	// добавляем перенную uri с urlencode
	for(var i in orders_list) {
		orders_list[i].uri = urlencode(orders_list[i].anime)
	}
	var orders_template = $("#orders_list_template");
	//j_orders_list.html(orders_list);
	if(orders_list.length) {
		j_orders_list.html(orders_template.tmpl(orders_list));
		if(preplaying > 1) $('.item[data-song="' + preplaying + '"] .preplay').addClass('active');
	} else {
	  // заглушка на отсутствие заказов
	  j_orders_list.html("<div class='no_orders'>Нет заказов ...<br/><img src='/images/no-orders.png'></div>");
	}

	// прелоад следующего постера
	if(data.orders_list.length > 0) {
		var poster_preload = new Image();
		poster_preload.src = '//anison.fm/resources/poster/200/' + data.orders_list[0].anime_id + '.jpg';
	}

	// обновляем историю заказов
	var j_history = $("#history");
	var history_template = $("#history_template");
	// добавляем перенную uri с urlencode
	for(var i in data.history) {
		data.history[i].uri = urlencode(data.history[i].anime)
	}
	var history = history_template.tmpl(data.history);
	j_history.html(history);

	// обновляем список слушателей
	var j_listeners = $("#listeners, .topbar #listeners");
	var listeners = parseInt(data.listeners);
	j_listeners.html(listeners);

	// обновляем текущий трек в эфире
	var j_on_air = $("#on_air, .wind1 #on_air");
	// название аниме/эфира
	var on_air_anime = data.on_air.anime;
	var on_air_link = data.on_air.link;
	if (on_air_link.length) {
	  var on_air_al = '<a href="/catalog/' + on_air_link + '/' + urlencode(on_air_anime) + '">' + on_air_anime + '</a>';
	} else {
	  var on_air_al = on_air_anime;
	}
	j_on_air.find(".anime").html(on_air_al);
	// название трека/описание эфира
	var on_air_track = data.on_air.track;
	j_on_air.find(".title").html(on_air_track);

	// обновляем информацию о треке
	var j_order_by = $("#order_by");
	var order_by_id = data.on_air.order_by;
	var order_by_login = data.on_air.order_by_login;
	var order_by_comment = data.on_air.comment;
	var order_by_comment_length = data.on_air.comment.length;

	var dataItems = [
	{
		id: order_by_id,
		login: order_by_login,
		comment: order_by_comment,
		length: order_by_comment_length,
	}];

	var order_by_template = $("#order_by_template");
	j_order_by.html(order_by_template.tmpl(dataItems));

	if(order_by_id == 0) {
		j_order_by.hide(1000);
	} else {
		j_order_by.show(1000);
	}

	// обновляем время воспороизведения
	var duration = data.duration;
	f_timer(parseInt(duration));

	// обновляем постер
	var j_poster = $('#curent_poster');
	j_poster.attr('href', '/catalog/' + on_air_link + '/' + urlencode(on_air_anime));
	var poster = data.poster;
	j_poster.html(poster);
	// и маленький постер в полном списке
	var j_poster_full = $('.wrap #curent_poster');
	j_poster_full.attr('href', '/catalog/' + on_air_link + '/' + urlencode(on_air_anime));
	j_poster_full.html('<img src="/resources/poster/50/' + on_air_link + '.jpg" id="current_poster_img">');

	// обновляем премиумы
	window.ups = data.ups;

	// обновляем видимость куронеко
	update_kuroneko();
}

function f_update_circle() {
  // обновляет инфу через заданное время
  clearInterval(this.update);
  this.update = window.setInterval(function() {
    f_update();
  }, update_timer);
}

$(document).ready(function() {
  anison_init();
  f_update(1);
  f_update_circle();
})

// ---- PREPLAY --------------------------------------------------------
var preplaying, unloading = false;

// True master tab set (on init too)
crosstab_volume.broadcast('setMaster');
duel.addEvent(window, 'visibilitychange', function () {
	crosstab_volume.broadcast('setMaster');
});
crosstab_volume.on('setMaster', function () {
	if ($('#anison_player').jPlayerFade().isFading()) crosstab_volume.setCurrentWindowAsMaster();
});

// Emergency Preplay Stop Channel
var crosstab_volume_reset = duel.channel('crosstab_volume_reset');
duel.addEvent(window, 'beforeunload', function () {
	if(preplaying) {
		// Var-marker for stop prolong Fading in jPlayer fade
		unloading = true;
	  /*setInterval(function () {
			crosstab_volume_reset.setCurrentWindowAsMaster();
			crosstab_volume_reset.broadcast('resetVolume');
		}, 5);*/
		$('#anison_player').jPlayerFade().emergencyStop(0);
		$('#anison_player').jPlayerFade().emergencyStop(100);
	}
});
crosstab_volume_reset.on('resetVolume', function () {
	console.log('Emergency broadcast receved');
	volume_local = ((getCookie("volume")) ? getCookie("volume") : '0.8');
	$("#anison_player").jPlayer('option', 'volume', volume_local);
});

// PREPLAY
function preplay (id, orderlist) {
	if(orderlist)
		var song_item = $('.item[data-song="' + id + '"] .preplay');
	else
		var song_item = $('.song_item[data-song="' + id + '"] .preplay');

	if(song_item.hasClass('active')) {
		// Clic on "Stop"
		if(!song_item.hasClass('ended')) {
			// Класс "ended" помечает треки, на которые уже кликнуто "Стоп"
			song_item.addClass('ended');
			crosstab_volume.setCurrentWindowAsMaster();
			$('#anison_preplay').jPlayerFade(true).out(1000);
			$('#anison_player').jPlayerFade(true).in(1000);
			setTimeout(function() {
				$("#anison_preplay").jPlayer("destroy");
				preplaying = false;
				$(".preplay").removeClass("active ended");
			}, 1000);
		}
	} else {
		// Click on "Play"
		$('.preplay').removeClass('active loading');
		$('#anison_preplay').jPlayer("destroy");
		if(!preplaying) { $('#anison_player').data("org-vol", NaN); $('#anison_preplay').data("org-vol", NaN); }

		var stream = {
			title: "Anison.FM Preview",
			mp3: "/resources/preplay/" + id + ".mp3"
		},
		volume_local = ((getCookie("volume")) ? getCookie("volume") : '0.8');

		$('#anison_preplay').jPlayer({
			ready: function (event) {
				$(this).jPlayer("setMedia", stream);
				if(orderlist) preplaying = id; else preplaying = true;
			},
			canplay: function () {
				song_item.removeClass('loading');
				crosstab_volume.setCurrentWindowAsMaster();
				$(this).jPlayer("play").jPlayerFade(true).in(1000);
				$('#anison_player').jPlayerFade(true).out(1000);
			},
			ended: function(event) {
				$('.preplay').removeClass('active ended loading');
				$(this).jPlayer("destroy");
				preplaying = false;
			},
			timeupdate: function(event) {
				// За секунду (2.1) до конца трека делаем выходной фейд и блокируем кнопку "Стоп" во избежание даблклика
				if (event.jPlayer.status.duration != 0 && (event.jPlayer.status.duration - event.jPlayer.status.currentTime) < 2.1 && !song_item.hasClass('ended')) {
					song_item.addClass('ended');
					crosstab_volume.setCurrentWindowAsMaster();
					$('#anison_preplay').jPlayerFade(true).out(1000);
					$('#anison_player').jPlayerFade(true).in(1000);
				}
			},
			swfPath: "//anison.fm/scripts/jplayer/jquery.jplayer.swf",
			supplied: "mp3",
			preload: "auto",
			wmode: "window",
			useStateClassSkin: false,
			autoBlur: false,
			keyEnabled: false,
			volume: volume_local,
			cssSelectorAncestor: "#no_container"
		});

		song_item.addClass('active loading');
	}
}

// --- FULL ORDER LIST -------------------------------------------------
function update_kuroneko() {
	var items = $(".wrap .item").length;
	if(window.minilist == true) items_limit = 25; else items_limit = 25;
	// Показываем Куронеко
	if (items>=items_limit) $('.wind_pic_onair').css('display','block');
					 else $('.wind_pic_onair').css('display','none');
}

function scrollbarWidth() {
	var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
	$outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),inner = $inner[0],outer = $outer[0];

	jQuery('body').append(outer);
	var width1 = inner.offsetWidth;
	$outer.css('overflow', 'scroll');
	var width2 = outer.clientWidth;
	$outer.remove();

	return (width1-width2);
}

$(document).ready(function(){
	$('.overlay, .wrap').click(function (e){
		if ($(e.target).closest('.anison_info').length == 0) {
			$('.wrap, .overlay').css('display','none').css('opacity','0').css('visibility','hidden');
			$('body').css('overflow', '').css('margin-right','');
			$('.bot_panel, .top_panel').css('right', '0px');
			$('.wrap').css('overflow-y', '');
			window.fullorderlist = false;
		}
	});

	$('a.open_fulllist').click(function (e){
		$('.wrap, .overlay').css('display','block').css('opacity','1').css('visibility','visible');
		$('.wrap').focus();

		var window_height = $(window).height();
		var body_height = $('body').height();
		if(body_height > window_height) {
			var scrollW = scrollbarWidth();
			$('body').css('overflow', 'hidden').css('margin-right', scrollW);
			$('.bot_panel, .top_panel').css('right', scrollW);
			$('.wrap').css('overflow-y', 'scroll');
		}
		window.fullorderlist = true;

		e.preventDefault();
		return false;
	});
});

// --- ORDER LIST MINIMIZATION -----------------------------------------
$('body').on('change', '#orderlist_mini', function (event) {
  if($('#orderlist_mini').prop("checked")){
    document.getElementById('miniorder_style').disabled = false;
    document.cookie = "orderlist_mini=true; path=/; expires=15/02/2027 00:00:00";
    window.minilist = true;
    update_kuroneko();
  }
  else {
    document.getElementById('miniorder_style').disabled = true;
    document.cookie = "orderlist_mini=false; path=/; expires=01/01/1970 00:00:00";
    window.minilist = false;
    update_kuroneko();
  }
});

jQuery(document).ready(function() {
	var results = document.cookie.match("orderlist_mini");
	if ( results ) {
		document.getElementById('miniorder_style').disabled = false;
		$('#orderlist_mini').prop("checked",true);
		window.minilist = true;
		update_kuroneko();
	}
	else
		return null;
});

// --- USER PROFILE ----------------------------------------------------
$('body').on('focus', '#form-field-date', function(event) {
	$(this).pickmeup({locale: {
			daysMin		: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
			months		: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthsShort	: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.']
		},
		view: 'years'});
	$(this).pickmeup('show');
});

$('body').on('submit', '#user_profile_form', function(event) {
	$('#user_profile_button').html('<i class="bicon-refresh"></i>&nbsp;<span class="text"> Сохранение ...</span>');
	$.ajax({
	    type: 'POST',
	    url: '/user/profile',
	    data: $('#user_profile_form').serialize() + '&ajax_load=true',
	    success: function(data)
	    {
	        $('#home_content').html(data);
	        $('#user_profile_answer').html('<div class="save_info"><b>Изменения сохранены.</b><br />Новые данные будут отражены на Вашей странице.</div>');
	        $('html, body').animate({ scrollTop: $('#user_profile_form').offset().top-60 }, 500);
	    }
	});
	return false;
});

// --- AVATAR
$('body').on({
	mouseenter: function () {
		$('#avatar_focus').stop().animate({ top: '-32px' }, 200);
	},
	mouseleave: function () {
		$('#avatar_focus').stop().animate({ top: '0px' }, 200);
	}
}, '#avatar');

function resize_popup (popup) {
	var pheight = $(popup).outerHeight();
	var wndheight = $('.overlay').outerHeight();
	$(popup).css('top', (wndheight - pheight)/2);
}

function avatar_go (to) {
	$('#up_error, #up_step1, #up_step2, #up_done').css('display', 'none');
	$(to).css('display', 'block');
	if(window.jcrop_api && to != '#up_step2') {
		// Если возвращаемся к состоянию без crop
		window.jcrop_api.destroy();
		$('#avatar_crop').attr('src', '');
		$('#avatar_crop').css('width', '').css('height', '');
		$('#avatar_crop').css('visibility', '');
		$('#upload_avatar_save').unbind('click');
	}
	$('#avatar_button_upload').html('<i class="bicon-avatar"></i>&nbsp; <span class="text">Выбрать аватарку</span>');
	$('#upload_avatar_save').html('<i class="bicon-check"></i>&nbsp; <span class="text">Сохранить</span>');
	$('#upload_avatar_save').prop("disabled", false);
	resize_popup('#avatar_up');
}

$('body').on('click', '#avatar', function(event) {
	$('.overlay').css('opacity','1');
	$('.overlay').css('visibility','visible');
	$('.overlay').css('display','block');
	$('div.'+$(this).attr("rel")).css('opacity','1');
	$('div.'+$(this).attr("rel")).css('visibility','visible');
	resize_popup('#avatar_up');

	$('.popup .close_window, .overlay').bind('click.avatar', function () {
		$('.popup, .overlay').css('opacity','0').css('visibility','hidden');
		$('.overlay').css('display','none');
		avatar_go('#up_step1');
		$('.popup .close_window, .overlay').unbind('click.avatar');
	});
});

$('body').on('change', '#upload_avatar', function() {
	var form_data = new FormData();
	var file = $(this)[0].files[0];
	form_data.append('file', file);

	$('#avatar_button_upload').html('<i class="bicon-refresh"></i>&nbsp;<span class="text"> Пожалуйста, подождите ...</span>');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'user.php5?action=uploadavatar&ajax_load=true', true);
	xhr.send(form_data);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var data = JSON.parse(xhr.responseText);
			if (data.status == "success") {
				setTimeout(function() {
					$('#avatar_crop').attr('src', data.url);
					var mtop, mleft, mheight, mwidth;
					function mainCords(c)
					{
						mtop = c.x;
						mleft = c.y;
						mwidth = c.w;
						mheight = c.h;
					};
					$('#avatar_crop').Jcrop({
						boxWidth: 520, boxHeight: 520,
						trueSize: [data.w,data.h],
						minSize: [ 200, 200 ],
						aspectRatio: 1,
						onChange: mainCords,
						onSelect: mainCords
					},function(){
						window.jcrop_api = this;
						jcrop_api.animateTo([0,0,200,200]);

						avatar_go('#up_step2');
					});

					$('#upload_avatar_save').bind('click', function () {
						$('#upload_avatar_save').html('<i class="bicon-refresh"></i>&nbsp;<span class="text"> Пожалуйста, подождите ...</span>');
						$('#upload_avatar_save').prop("disabled", true);
						$.ajax({url: "user.php5?action=avatarsave&mtop=" + mtop + "&mleft=" + mleft + "&mheight=" + mheight + "&mwidth=" + mwidth + "&ajax_load=true", dataType: 'json'})
							.done(function ( data ) {
								if (data.status == "success") {
										setTimeout(function() {
											$('#bot_panel .ava img').attr('src', data.url);
											$('#avatar img').attr('src', data.urlb);
										avatar_go('#up_done');
										}, 100);
									} else {
											jcrop_api.animateTo([0,0,200,200]);
											avatar_go('#up_step2');
									}
								});
						});
				}, 100);
			} else {
				avatar_go('#up_error');
			}
		}
	}
});

// --- LIKES, FAVOURITES, ORDER, SCROLLTOP ---------------------------------------------
jQuery(document).ready(function() {
	var j_url = "/song_actions.php";
	jQuery("body").on("click", ".song_item .song_links .favorite", function() {
		var j_this = jQuery(this);
		var j_parent = j_this.parents(".song_item");
		var j_song = j_parent.data("song");
		var j_data = "action=add_favorite&song=" + j_song;
		jQuery.ajax({
			type: "POST",
			dataType: "script",
			url: j_url,
			data: j_data,
			success: function (data, textStatus) {
			//alert(data);
			}
		})
	})

	jQuery("body").on("click", ".song_item .song_links .preplay", function() {
		var j_this = jQuery(this);
		var j_parent = j_this.parents(".song_item");
		var j_song = j_parent.data("song");
		preplay(j_song);
	})
	jQuery("body").on("click", ".orders_list .item .preplay", function() {
		var j_this = jQuery(this);
		var j_parent = j_this.parents(".item");
		var j_song = j_parent.data("song");
		preplay(j_song, true);
	})

	jQuery("body").on("click", 'a.local_link[href$="up"]', function() {
		var j_this = jQuery(this);
		var j_parent = j_this.parents(".song_item, .item");
		var j_song = j_parent.data("song");
		var j_firstorder = $('#orders_list .item[data-song=' + j_song + ']').length;
		j_title = j_parent.find("span.track").text();
		if(!j_title) {
			j_title = j_this.text();
		}

		var dataItems = [
		{
			id: j_song,
			title: j_title,
			ups: ups,
			firstorder: j_firstorder,
		}];

		var voteform_template = $("#voteform_template");
	 	$('.wind_vote .voteform').html(voteform_template.tmpl(dataItems));

		resize_popup('.wind_vote');
		$('.overlay_vote').css('opacity','1');
		$('.overlay_vote').css('visibility','visible');
		$('div.wind_vote').css('opacity','1');
		$('div.wind_vote').css('visibility','visible');

		return false;
	})

	$('.popup .close_window_vote, .overlay_vote').click(function (){
		$('div.wind_vote, .overlay_vote').css('opacity','0');
		$('div.wind_vote, .overlay_vote').css('visibility','hidden');
	});

	jQuery("body").on("click", 'a.local_link[href$="del"]', function() {
		var j_this = jQuery(this);
		var j_parent = j_this.parents(".song_item, .item");
		var j_song = j_parent.data("song");

		var j_data = "action=up&song=" + j_song + "&mode=cancel";
		jQuery.ajax({
		    type: "POST",
		    dataType: "script",
		    url: "/song_actions.php",
		    data: j_data,
		    success: function (data, textStatus) {
					resize_popup('.wind_vote');
					$('.overlay_vote').css('opacity','1');
					$('.overlay_vote').css('visibility','visible');
					$('div.wind_vote').css('opacity','1');
					$('div.wind_vote').css('visibility','visible');
		      f_update();
		    }
		})

		return false;
	})

	jQuery("body").on("click", '.scrolltop', function() {
		$("html, body").animate({scrollTop:540}, 500);
	})
})

function orderTrack (id, premium) {
	if(premium) premium = 1; else premium = 0;
	if($('#order-comment').length) {
		var comment = $('#order-comment').val();
	} else {
		var comment = '';
	}
	var j_data = "action=up&song=" + id + "&premium=" + premium + "&comment=" + comment;
	jQuery.ajax({
		type: "POST",
		dataType: "script",
		url: "/song_actions.php",
		data: j_data,
		success: function (data, textStatus) {
			f_update();
		}
	});
}

function favorite_sort_by(type) {
	if(type == 'id') type = 'id'; else type = 'abc';
	document.cookie = "favorite_sortby=" + type + "; path=/; expires=15/02/2027 00:00:00";
	load_content(window.location.href, null);
}

// --- HISTORY API -----------------------------------------------------
function load_content(content, target_selector, datasong) {
	target_selector = target_selector || '#home_content'
	var target = $(target_selector);
	if(preplaying) {
		var song_item = $('.preplay.active');
		song_item.click();
	}
	NProgress.start();
	NProgress.set(0.6);
	if(content == '/chat/') {
		chatmod('on');
		jQuery(document).ready(function() {
			NProgress.done();
		})
	}
  	else {
	  	$.ajax({
		    type: 'POST',
		    dataType: 'html',
		    url: content,
		    data: 'ajax_load=true',
		    beforeSend: function () {
		    	// Comment for Google - Updating the banner along with the AJAX-page without abuse
		    	$(".adsbygoogle").removeAttr('data-adsbygoogle-status'); $(".adsbygoogle").html(''); (adsbygoogle = window.adsbygoogle || []).push({});
		    },
		    success: function (data, textStatus) {
				  if(window.chat == true) {
						chatmod('off');
			  	}
		      target.html(data);
		      NProgress.done();
		      if(datasong) $('.song_item[data-song=' + datasong +']').parent().addClass('found');
		    }
	  	});
	}
}

function transition_page(element, datasong) {
	var href = $(element).attr('href');
	load_content(href, null, datasong);

	// заполним хранилище
	var state = {
		title: element.getAttribute('title'),
		url: element.getAttribute('href', 2) // двоечка нужна для ИЕ6-7
	}

	// заносим ссылку в историю
	history.pushState(state, state.title, state.url);
}

$(document).ready(function() {
	// вешаем события на все ссылки в нашем документе
	$('body').on('click.ajax_load', 'a:not(.local_link)', function() {
		transition_page(this);
		return false;
	});

	// убиваем событие там, где оно не нужно
	// Эта хрень .off() работает только с таким же селектором, с каким вызывался .on(), соответственно код ниже бесполезен, вместо этого в .on() добавил .not()
	//$('body').off('click.ajax_load', '#orders_list .up a[href$="up"], .song_item a[href$="up"]');

	// при клике на вперед/назад в окне браузера подгружаем из истории
	window.onpopstate = function(e) {
		if(typeof history.location === 'undefined'){
			return false;
		};
		load_content(history.location);
		return false;
	}
})

// --- SEARCH -----------------------------------------------------
$(function(){
	var cache = {}, search_by = 'anime';
	$('body').on('keyup.autocomplete', '#search', function() {
		$(this).autocomplete({
			source : function(request, response) {
			    var term          = request.term.toLowerCase() + search_by,
			        element       = this.element,
			        cache         = this.element.data('autocompleteCache') || {},
			        foundInCache  = false;

			    $.each(cache, function(key, data){
			      if (term == key && data.length > 0) {
			        response(data);
			        foundInCache = true;
			        return;
			      }
			    });

			      if (foundInCache) return;

			      $.ajax({
			          url: 'suggestion.php',
			          dataType: "json",
			          data: {term: request.term, by: search_by},
			          success: function(data) {
			              cache[term] = data;
			              element.data('autocompleteCache', cache);
			              response(data);
			          }
			      });
			 },
			messages: '',
			minLength: 3,
			select: function (event, ui) {
				if(ui.item.url != '') {
					var search_link = document.createElement('a');
					search_link.setAttribute("href", ui.item.url);
					search_link.setAttribute("title", ui.item.anime);
					$("#search").blur();
					transition_page(search_link, ui.item.datasong);
				}
				return false;
			},
			focus: function (event, ui) {
				return false;
			},
			open: function() { $('.ui-menu').width('268px'); $('.ui-menu').css("top", "-=9");  }
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
				.data( "item.autocomplete", item )
					.append( item.image + "<a class='local_link'><b>" + item.anime + "</b><br>" + item.anime_ru + "</a>" )
					.appendTo( ul );
		};
	});

	$("#search").focus(function(){
		$(this).css("color", "#000");
		if($("#search").val() != '') {
			window.setTimeout(function() {
				$("#search").keyup();
				$("#search").data("ui-autocomplete").search($("#search").val());
			}, 1);
		}
	}).blur(function(){
		$(this).css("color", "#666");
		$("#ui-id-1").css("display", "none");
 	});

	$('body').on('click', '.searchbutton', function() {
		$('.searchbutton').removeClass('active');
		$(this).addClass('active');
		if($(this).hasClass('anime')) {
			search_by = 'anime';
		} else if($(this).hasClass('track')) {
			search_by = 'track';
		} else {
			search_by = 'artist';
		}
		$("#search").focus();
	});
});

// --- CHATBOX -----------------------------------------------------
var chatbox = 'chatbox';
function chatmod (mode) {
	var target = $('#home_content');
	if(mode == 'on') {
		target.html('<iframe id="chat_frame" src="/' + chatbox + '/" frameborder="0" scrolling="none"></iframe>');
		$('.main_radio_block, .footer, #logofw, .rightbanner, .topbanner, .header div.listeners').hide();
		$('.header .topbar').show();
		$('.header').css('height','auto');
		//$('body').css('overflow','hidden');
		$('.wind1').css('top','500px');
		$('.general').css('background-size', '1920px 200%');
		$(window).scrollTop(0);
		window.chat = true;

		chatbox_resize();

		$(window).on('resize.chat', function () {
			chatbox_resize();
		})
	} else {
		$('.main_radio_block, .footer, #logofw, .rightbanner, .topbanner, .header div.listeners').show();
		$('.header .topbar').hide();
		$('.header').css('height','90px');
		//$('body').css('overflow','');
		$('.wind1').css('top','550px');
		$('.general').css('background-size', '');
		$('#chat_frame').attr("src", "").remove();
		window.chat = false;
		$(window).off('resize.chat');
		if(window.fullorderlist) $('body').css('overflow','hidden');
	}
}

function chatbox_resize () {
	var j_window_h = jQuery(window).height();
  	var j_frame_h = j_window_h - 73;
   	jQuery("#chat_frame").height(j_frame_h);
}

// --- COMMENTS -----------------------------------------------------

var Comments = function(type, id){
		this.init(type, id);
}

Comments.prototype ={
	$type:null,
	$id:null,
	$page:null,
	init:function(type, id){
		this.type = type;
		this.id = id;
		$.ajax({
			url: 'suggestion.php',
			dataType: "json",
			data: {comments: true, type: this.type, id: this.id},
			success: function(data) {
				var comments_area = $(".comments");
				var comments_template = $("#comments_template");
				var comments_stream = comments_template.tmpl(data);
				comments_area.html(comments_stream);
			}
		});
	},
	answer:function(messageid){
		e.preventDefault();
		alert(this.id);
	}
}