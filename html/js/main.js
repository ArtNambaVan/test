$( document ).ready(function() {
    $('.selectpicker').selectpicker();

    var settingsBtn = $('#filtersBtn');
    var settingsPanel = $('#filtersPanel');
    var closePanel = $('#panelClose');
    var openPanel = "filters-panel--open";
    console.log('dsadas')

    settingsBtn.on('click', function() {
        console.log('clicked')
        console.log(settingsPanel)
        settingsPanel.hasClass(openPanel) ? settingsPanel.removeClass(openPanel) : settingsPanel.addClass(openPanel);
    });
});
