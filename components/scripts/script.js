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
  (function(win, d) {
    var lastScrollY = win.pageYOffset;
    var windowpos = lastScrollY + topoffset;

    var ticking = false;

    var nav = d.getElementById('nav'),
        navItem = $('.navbar > ul > li > a'),
        navBrand = d.getElementsByClassName('brand')[0],
        heightHotelinfo = $('#hotelinfo').offset().top,
        heightRooms = $('#rooms').offset().top,
        heightContact = $('#contact').offset().top;


    function onScroll () {
      lastScrollY = win.pageYOffset;
      windowpos = lastScrollY + topoffset;
      if(!ticking) {
        ticking = true;
        requestAnimationFrame(updateElements);
      }
    }

    function updateElements () {
      window.performance.mark("mark_start_navFrame");

      navItem.each(function() {
        this.classList.remove('active');

        var sectionId = $(this).attr('href');
        if (windowpos > ($(sectionId).offset().top - 1)) {
          for (var i=0; i < navItem.length; i++) {
            navItem[i].classList.remove('active');
          }
          this.classList.add('active');
        }
      });
      if (windowpos > (heightRooms - 1)) {
        navBrand.classList.add('inactive');
      } else {
        navBrand.classList.remove('inactive');
      }
      if (windowpos > (heightHotelinfo - 1) && windowpos < heightRooms) {
        navBrand.classList.add('resume');
      } else {
        navBrand.classList.remove('resume');
      }
      if (lastScrollY === 0) {
        navBrand.classList.add('inactive');
      } else if (windowpos < heightHotelinfo) {
        navBrand.classList.remove('inactive');
      }
      if (windowpos > (heightContact - 1)) {
        nav.classList.add('the-end');
      } else {
        nav.classList.remove('the-end');
      }

      ticking = false;

      window.performance.mark("mark_end_navFrame");
      window.performance.measure("measure_navFrame", "mark_start_navFrame", "mark_end_navFrame");
      var timeToGenerate = window.performance.getEntriesByName("measure_navFrame");
      console.log("Time to update one navFrame: " + timeToGenerate[0].duration + "ms");
      window.performance.clearMeasures('measure_navFrame');
    }

    win.addEventListener('scroll', onScroll, false);
  })(window, document);

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
      if(!ticking) {
        ticking = true;
        requestAnimationFrame(updateElements);
      }
    }

    function updateElements () {
      window.performance.mark("mark_start_frame");

      var relativeY = lastScrollY / docHeight;

      if ((lastScrollY <= anim1Duration) || init) {
        prefix(anim1.style, "Transform", "translate3d(0, " + pos(0, 800, relativeY, 0) + "px, 0)");
        anim2.style["letterSpacing"] = Math.min(25, pos(0, 800, relativeY, 0)) + "px";
        animNav.style['position'] = "relative";
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
        if (lastScrollY >= anim1Duration || init) {
          animNav.style['position'] = "fixed";
        }
      }

      ticking = false;

      window.performance.mark("mark_end_frame");
      window.performance.measure("measure_frame", "mark_start_frame", "mark_end_frame");
      // var timeToGenerate = window.performance.getEntriesByName("measure_frame");
      // console.log("Time to update one frame: " + timeToGenerate[0].duration + "ms");
      // window.performance.clearMeasures('measure_frame');
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
    init = false;
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
