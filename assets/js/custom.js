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

const mobileNavbarBtn = document.querySelector('.navbar-toggler-icon');
mobileNavbarBtn.addEventListener('click', event => {
    document.body.classList.toggle('mobile-menu-expanded');

    const menuItems = document.querySelectorAll('.sidebar-menu .nav-link');
    menuItems.forEach(item => {
        item.addEventListener('click', itemEvent => {
            if (!itemEvent.target.classList.contains('nav__link--toggler')
                && document.body.classList.contains('mobile-menu-expanded')) {
                document.body.classList.remove('mobile-menu-expanded')
            }
        });
    });
});

