$( document ).ready(function() {
    $('.selectpicker').selectpicker();

    var settingsBtn = $('#settingsBtn');
    var settingsPanel = $('#settingsPanel');
    var closePanel = $('#panelClose');
    var openPanel = "settings-panel--open";
    console.log('dsadas')

    settingsBtn.on('click', function() {
        console.log('clicked')
        settingsPanel.hasClass(openPanel) ? settingsPanel.removeClass(openPanel) : settingsPanel.addClass(openPanel);
    });
    closePanel.on('click', function() {
        settingsBtn.click();
        console.log('asasas')
    })
});
