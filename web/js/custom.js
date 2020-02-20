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
