$(function() {

  var isTouch = 'ontouchstart' in document.documentElement;

  // fullheight and window size
  var topoffset = $('.navbar ul').height();
  $('.navbar .brand').css('height', topoffset);

  var wheight = $(window).height() - topoffset;
  $('.fullheight').css('height', wheight);

  $(window).resize(function() {
    var wheight = $(window).height() - topoffset;
    $('.fullheight').css('height', wheight);
  });

  // current nav item active
  (function() {
    var windowpos = window.pageYOffset + topoffset;
    var lastScrollY = window.pageYOffset;
    var ticking = false;

    function onScroll () {
      windowpos = window.pageYOffset + topoffset;
      lastScrollY = window.pageYOffset;
      if(!ticking) {
        ticking = true;
        requestAnimationFrame(updateElements);
      }
    }

    function updateElements () {
      $('.navbar > ul > li > a').removeClass('active');
      $('.navbar > ul > li > a').each(function() {
        var sectionId = $(this).attr('href');
        if (windowpos > ($(sectionId).offset().top - 1)) {
          $('.navbar > ul > li > a').removeClass('active');
          $(this).addClass('active');
        }
      });
      if (windowpos > ($('#rooms').offset().top - 1)) {
        $('.brand').addClass('inactive');
      } else {
        $('.brand').removeClass('inactive');
      }
      if (windowpos > ($('#hotelinfo').offset().top - 1) && windowpos < ($('#rooms').offset().top)) {
        $('.brand').addClass('resume');
      } else {
        $('.brand').removeClass('resume');
      }
      if (lastScrollY === 0) {
        $('.brand').addClass('inactive');
      } else if (windowpos < $('#hotelinfo').offset().top) {
        $('.brand').removeClass('inactive');
      }
      if (windowpos > ($('#contact').offset().top - 1)) {
        $('#nav').addClass('the-end');
      } else {
        $('#nav').removeClass('the-end');
      }

      ticking = false;
    }

    window.addEventListener('scroll', onScroll, false);
  })();

  // smooth scroll
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - topoffset
        }, 500);
        return false;
      }
    }
  });

  navigator.sayswho= (function(){
      var ua= navigator.userAgent, tem,
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE '+(tem[1] || '');
      }
      if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
      if (M[0] == 'MSIE' && (M[1] < 11)) {
        $("body").addClass("ieUnder11");
      };
      return M;
  })();//browser check ie

  // parallax
  (function(win, d) {

    var $ = d.querySelector.bind(d);

    var animNav = $('#nav'),
        animBrand = $('.brand'),
        animNavContainer = document.createElement('div'),
        anim1 = $('#intro .image-animate'),
        anim1Duration = $('#intro article.fullheight').offsetHeight;

        animNavContainer.id = "nav-wrapper";
        animNavContainer.style['height'] = animNav.offsetHeight + "px";
        $('header').appendChild(animNavContainer);
        animNavContainer.appendChild(animNav);

    var anim2 = $('#intro .hgroup h1');

    var anim3 = $('#welcome .image-animate');

    var anim4Container = $('#hotelinfo'),
        anim4Left = $('#hotelinfo .image-animate.left'),
        anim4Right = $('#hotelinfo .image-animate.right'),
        anim4Duration = anim4Container.offsetHeight,
        anim4Trigger = anim4Container.offsetTop;

    var ticking = false;
    var lastScrollY = win.pageYOffset,
        docHeight = $('body').offsetHeight,
        winHeight = win.innerHeight;

    function onResize () {
      //updateElements(win.pageYOffset); resize and scroll relations???
      //need to update varibles
    }

    function onScroll (evt) {
      lastScrollY = win.pageYOffset;
      init = false;
      if(!ticking) {
        ticking = true;
        requestAnimationFrame(updateElements);
      }
    }

    function updateElements () {
      var relativeY = lastScrollY / docHeight;

      if ((lastScrollY <= anim1Duration) || init) {
        prefix(anim1.style, "Transform", "translate3d(0, " + pos(0, 800, relativeY, 0) + "px, 0)");
        anim2.style["letterSpacing"] = Math.min(25, pos(0, 800, relativeY, 0)) + "px";
        animNav.style['position'] = "relative";
      } else {
        animNav.style['position'] = "fixed";
        if (lastScrollY <= (anim1Duration / 2)) {
          animBrand.style['backgroundPosition'] = "8px -80px";
        }
      }

      if ((lastScrollY >= (anim1Duration / 2) && lastScrollY <= anim1Duration) || init) {
        prefix(anim3.style,
               "Transform",
               "translate3d(0,"
                + pos(0,
                      -6200,
                      Math.min(relativeY, (anim1Duration / docHeight)),
                      (anim1Duration / 2 / docHeight))
                + "px, 0)");
        if (lastScrollY >= (anim1Duration / 2)) {
          animBrand.style['backgroundPosition'] = "8px 0px";
        }
      }

      if (((winHeight + lastScrollY) > anim4Trigger && (lastScrollY) < (anim4Trigger + anim4Duration)) || init) {
        prefix(anim4Left.style,
               "Transform",
               "translate3d(0, "
                + pos(0,
                      -1800,
                      relativeY,
                      ((anim4Trigger - winHeight) / docHeight))
                + "px, 0)");
        prefix(anim4Right.style,
               "Transform",
               "translate3d(0, "
                + pos(0,
                      -2400,
                      relativeY,
                      ((anim4Trigger - winHeight) / docHeight))
                + "px, 0)");
      }

      ticking = false;
    }

    function pos(base, range, relY, offset) {
      return base + limit(0, 1, relY - offset) * range;
    }

    function prefix(obj, prop, value) {
      var prefs = ['webkit', 'Moz', 'o', 'ms'];
      for (var pref in prefs) {
        obj[prefs[pref] + prop] = value;
      }
    }

    function limit(min, max, value) {
      return Math.max(min, Math.min(max, value));
    }

    win.addEventListener('resize', onResize, false);
    win.addEventListener('scroll', onScroll, false);

    var init = true;
    updateElements();

  })(window, document);

  //set up ScrollMagic
  var controller = new ScrollMagic({
    globalSceneOptions: {
      triggerHook: "onLeave"
    }
  });

  var webdevScene = new ScrollScene({
    triggerElement: "#dining",
    duration: $('#dining').height() + $(window).height(),
    offset: 0
  });
  webdevScene.addTo(controller)
  .triggerHook("onEnter")
  .setTween(new TimelineMax().add([
    TweenMax.to("#dining", 1, {backgroundPositionY: "600px, -1210px, 1100px", ease: Linear.easeNone})
    ]));

  var quoteScene = new ScrollScene({
    triggerElement: "#rooms"
  });
  quoteScene.addTo(controller)
  .triggerHook("onCenter")
  .setTween(new TimelineMax().add([
    TweenMax.fromTo("#rooms", 1, {backgroundPositionX: "100px"}, {backgroundPositionX: "1590px", ease: Expo.easeInOut})
    ]));

  //pops in text content for attractions section
  var attractionstween = TweenMax.staggerFromTo(
    '#attractions article',
    1,
    {opacity: 0, scale: 0},
    {delay: 0.3, opacity: 1, scale: 1, ease: Back.easeOut}
  );

  var attractionsScene = new ScrollScene({
    triggerElement: '#attractions',
    offset: -topoffset
  }).setTween(attractionstween).addTo(controller);

  if(!isTouch) {
    $("body").addClass("noTouch");
    //animation for room content
    var roomOrigin = {
      bottom: -700,
      opacity: 0,
      scale: 0
    };

    var roomDest = {
      repeat: 1,
      yoyo: true,
      bottom: 0,
      opacity: 1,
      scale: 1,
      ease: Back.easeOut
    };

    $('#rooms .room-group').each(function() {
      var articleId = '#' + $(this).attr('id');

      var roomstween = TweenMax.staggerFromTo(
        articleId + ' ' + '.content', 1, roomOrigin, roomDest
      );

      var roomsScene = new ScrollScene({
        triggerElement: articleId,
        offset: -topoffset,
        duration: 500
      }).setPin(articleId).setTween(roomstween).addTo(controller);
    });
  } else {
    //pops in text content for rooms section for touch devices
    $('#rooms .room-group').each(function() {
      var articleId = '#' + $(this).attr('id');

      var roomstween = TweenMax.staggerFromTo(
        articleId + ' ' + '.content',
        1,
        {opacity: 0, scale: 0},
        {delay: 0.1, opacity: 1, scale: 1, ease: Back.easeOut}
      );

      var roomsScene = new ScrollScene({
        triggerElement: articleId,
        offset: -topoffset
      }).setTween(roomstween).addTo(controller);
    });
  }//isTouch check

  if(!isTouch) {
    $(window).resize(function() {
      welcomeScene.duration($('#intro').height() - topoffset);
      resumeScene.duration($('#hotelinfo').height() + $(window).height());
      headerScene.duration($(window).height());
      webdevScene.duration($('#hotelinfo').height() + $(window).height());
    });
    $('#nav ul li a').addClass('no-touch');
    $('.brand').addClass('no-touch');
  }//isTouch check
});
