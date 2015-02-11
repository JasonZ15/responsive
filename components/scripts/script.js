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
  $(window).scroll(function() {
    var windowpos = $(window).scrollTop() + topoffset;
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
    if ($(window).scrollTop() === 0) {
      $('.brand').addClass('inactive');
    } else if (windowpos < $('#hotelinfo').offset().top) {
      $('.brand').removeClass('inactive');
    }
    if (windowpos > ($('#contact').offset().top - 1)) {
      $('#nav').addClass('the-end');
    } else {
      $('#nav').removeClass('the-end');
    }
  });

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

  //set up ScrollMagic
  var controller = new ScrollMagic({
    globalSceneOptions: {
      triggerHook: "onLeave"
    }
  });

  //pin down navigation at the top
  var navPin = new ScrollScene({
    triggerElement: '#nav',
  }).setPin('#nav').addTo(controller);

  if(!isTouch) {
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
  }//isTouch check

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

  // parallax
  var headerScene = new ScrollScene({
    triggerElement: "header",
    duration: $(window).height(),
    offset: 0
  });
  headerScene.addTo(controller)
  .triggerHook("onLeave")
  .setTween(new TimelineMax().add([
    TweenMax.to("header .fullheight", 1, {backgroundPositionY: "300px", ease: Linear.easeNone})
    ]));

  var welcomeScene = new ScrollScene({
    triggerElement: "#welcome",
    duration: $('#intro').height() - topoffset,
    offset: 0
  });
  welcomeScene.addTo(controller)
  .triggerHook("onEnter")
  .setTween(new TimelineMax().add([
    TweenMax.fromTo("#welcome", 1, {backgroundPositionY: "400px, 0px"}, {backgroundPositionY: "56px, 0px", ease: Linear.easeNone})
    ]));

  var resumeScene = new ScrollScene({
    triggerElement: "#hotelinfo",
    duration: $('#hotelinfo').height() + $(window).height(),
    offset: 0
  });
  resumeScene.addTo(controller)
  .triggerHook("onEnter")
  .setTween(new TimelineMax().add([
    TweenMax.to("#hotelinfo", 1, {backgroundPositionY: "-500px, -900px, 0", ease: Linear.easeNone})
    ]));

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
    TweenMax.fromTo("#rooms", 1, {backgroundPositionX: "100px"}, {backgroundPositionX: "1000px", ease: Expo.easeInOut})
    ]));

  var brandScene = new ScrollScene({
    triggerElement: "#intro h1"
  });
  brandScene.addTo(controller)
  .triggerHook("onLeave")
  .setTween(new TimelineMax().add([
    TweenMax.fromTo(".brand", 1, {backgroundPositionY: "-80px"}, {backgroundPositionY: "0px", ease: Elastic.easeInOut}),
    TweenMax.to(".brand a .small", 1, {opacity: "0", ease: Linear.easeNone})
    ]));

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
