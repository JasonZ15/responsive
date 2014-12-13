$(function() {

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
  });

  // smooth scroll
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - topoffset
        }, 1000);
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

});
