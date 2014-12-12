$(function() {

  // current nav item
  

  // fullheight and window size
  var brandHeight = $('.navbar ul').height();
  $('.navbar .brand').css('height', brandHeight);

  var wheight = $(window).height() - brandHeight;
  $('.fullheight').css('height', wheight);
  $(window).resize(function() {
    var wheight = $(window).height() - brandHeight;
    $('.fullheight').css('height', wheight);
  });

  // smooth scroll
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - brandHeight
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

  var pin = new ScrollScene({
    triggerElement: '#nav',
  }).setPin('#nav').addTo(controller);

  var attractionstween = TweenMax.staggerFromTo(
    '#attractions article',
    1,
    {opacity: 0, scale: 0},
    {delay: 0.3, opacity: 1, scale: 1, ease: Back.easeOut});

  var scene = new ScrollScene({
    triggerElement: '#attractions',
    offset: -brandHeight
  }).setTween(attractionstween).addTo(controller);
})
