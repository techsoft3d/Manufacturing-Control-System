function collapsableWidgetFunctions() {
  var isOn = false;
  var html = '';

  $('.collapseInfo a').click(function () {

    if (isOn == false) {
      if ($('#NameOfPart').val() != '') {
        html = '<img src="/demos/inventory-management/images/Collapse.png" class="collapse-image" style="opacity: 1.0" />';
      } else {
        html = '<img src="/demos/inventory-management/images/Collapse.png" class="collapse-image" style="opacity: 0.1" />';
      }
      isOn = true;
    } else {
      if ($('#NameOfPart').val() != '') {
        html = '<img src="/demos/inventory-management/images/Expand.png" class="collapse-image" style="opacity: 1.0" />';
      } else {
        html = '<img src="/demos/inventory-management/images/Expand.png" class="collapse-image" style="opacity: 0.1" />';
      }
      isOn = false;
    }
    $(this).html(html);

    $('#collapseExample').slideToggle('slow');
  });
}

$(document).ready(function () {
  $('.manufacturers').bxSlider({
    minSlides: 3,
    maxSlides: 5,
    slideWidth: 350,
    slideMargin: 10,
    responsive: true,
    infiniteLoop: false,
    hideControlOnEnd: true
  });

  collapsableWidgetFunctions();

  $('#selectable li').addClass('ui-selected');
});
