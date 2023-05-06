function showSettings() {
    if ($('.settingList').is(':visible')) {
        $('.settingList').hide()
    } else {
        if(!$('.pages').is(':visible') || $(window).width() >= 730) {
            $('.settingList').show()
        }
    }
}
function showPages() {
    if ($('.pages').is(':visible')) {
        $('.pages').hide()
    } else {
        if(!$('.settingList').is(':visible')) {
            $('.pages').show()
        }
    }

}