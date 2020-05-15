$(function () {
    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh')
    })

    const tocRootPositions = document.querySelectorAll('#toc > .navbar-nav > li > .nav-link');

    tocRootPositions.forEach(rootPosition => {
        const arrow = document.createElement('i');
        arrow.classList.add('material-icons', 'nav__link--toggler');
        arrow.innerHTML = 'keyboard_arrow_down';

        rootPosition.append(arrow);
    });

    const navToggler = document.querySelectorAll('.nav__link--toggler');
    navToggler.forEach(toggler => {
        toggler.addEventListener('click', event => {
            event.preventDefault();

            const parentAnchor = event.target.parentNode;
            const subMenu = parentAnchor.nextElementSibling;

            if (!event.target.classList.contains('toggler--rotated')
                && parentAnchor.classList.contains('active')) {
                event.target.classList.toggle('toggler--rotated-0');
                event.target.classList.remove('toggler--rotated');
            } else {
                event.target.classList.toggle('toggler--rotated');
            }

            if (parentAnchor.classList.contains('active')) {
                subMenu.classList.toggle('d-none');
            } else {
                subMenu.classList.toggle('d-block');
            }
        });
    });

    $('[data-spy="scroll"]').each(function(i, el) {
        var $spy = $(this).scrollspy('refresh')

        const posY = document.documentElement.scrollTop;
        window.scrollTo(0, posY + 1);


    });
})
