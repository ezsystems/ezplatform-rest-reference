const clipboard = new ClipboardJS('.clipboard');
clipboard.on('success', (e) => {
    e.clearSelection();
    const trigger = e.trigger;
    const originalTitle = trigger.dataset.originalTitle;
    trigger.dataset.originalTitle = 'Copied';
    $(trigger).tooltip('show');
    $(trigger).on('hidden.bs.tooltip', (setTitle(trigger, originalTitle)));
});

function setTitle(element, title) {
    element.dataset.originalTitle = title;
}

const currentYearElement = document.querySelector('.current-year');
const date = new Date();
currentYearElement.textContent = date.getFullYear();

window.addEventListener('load', event => {
    const tocRootPositions = document.querySelectorAll('.navbar > .navbar-nav > li > .nav-link');
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
});


const elements = document.querySelectorAll('.sticky');
Stickyfill.add(elements);
