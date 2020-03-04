function scrollToAnchorWithOffset(link) {
    const element = document.getElementById(link.href.split('#')[1]);

    $('html,body').animate({
        scrollTop: $(element).offset().top - 60
    }, 1);
}
