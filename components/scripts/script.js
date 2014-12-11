$(function() {
  var wheight = $(window).height();
  $('.fullheight').css('height', wheight);
  $(window).resize(function() {
    var wheight = $(window).height();
    $('.fullheight').css('height', wheight);
  })
})
