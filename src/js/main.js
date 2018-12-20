$( document ).ready(function() {
    $('.selectpicker').selectpicker();

    var settingsBtn = $('#filtersBtn');
    var settingsPanel = $('#filtersPanel');
    var closePanel = $('#panelClose');
    var openPanel = "filters-panel--open";

    settingsBtn.on('click', function() {
        settingsPanel.hasClass(openPanel) ? settingsPanel.removeClass(openPanel) : settingsPanel.addClass(openPanel);
    });

    $('#jsTreeCategory').jstree({
		'core' : {
			'data' : [
				{
					"text" : "first root node",
                    "state" : { "opened" : true },
                    "a_attr" : {
                        "class" : "category__rating"
                    },
					"children" : [
                        { "text" : "Child node 1",
                            "a_attr" : {
                                "class" : "category__rating"
                            },
                         },

                         { "text" : "Child node 2",
                            "a_attr" : {
                                "class" : "category__rating"
                            },
                         },

                         { "text" : "Child node 3",
                            "a_attr" : {
                                "class" : "category__rating"
                            },
                         },

                         { "text" : "Child node 4",
                            "a_attr" : {
                                "class" : "category__rating"
                            },
                         },

                         { "text" : "Child node 5",
                            "a_attr" : {
                                "class" : "category__rating"
                            },
                         },

						{ "text" : "Child node 6"}
					]
                },
                {
					"text" : "second root node",
					"state" : { "opened" : true },
					"children" : [
						{
							"text" : "Child node 1",
							"state" : { "opened" : true },
                            "icon" : "jstree-file",
                            "children" : [
                                {
                                    "text" : "Child node 11"
                                },
                                { "text" : "Child node 22"}
                            ]
						},
						{ "text" : "Child node 2"}
					]
				}
			]
		}
	});

    
});
