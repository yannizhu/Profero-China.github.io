$("document").ready(function(){

	//initialise sidr off-canvas menu
    $('.toggle-menu').sidr({
        name: 'sidr-right',
        side: 'right',
        source: '#menu-content'
    });

    //open the off-canvas menu
    $(".sidr a").bind("click", function() {
        $.sidr('close', 'sidr-right');
    });

    //close the menu when going from mobile to desktop
    enquire.register("screen and (min-width:980px)", {
        match : function() {
            $.sidr('close', 'sidr-right');
        }
    });

});