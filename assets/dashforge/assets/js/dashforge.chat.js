function initChatDashboard() {
    $('[data-toggle="tooltip"]').tooltip()
    // chat sidebar body scrollbar
    new PerfectScrollbar('.chat-sidebar-body', {
        suppressScrollX: true
    });
    // chat content body scrollbar
    new PerfectScrollbar('.chat-content-body', {
        suppressScrollX: true
    });
    // chat sidebar right scrollbar
    new PerfectScrollbar('.chat-sidebar-right', {
        suppressScrollX: true
    });
    ///// UI INTERACTION /////
    // channel click
    $('#allChannels a').on('click', function(e) {
        e.preventDefault()
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $('#citasHoy .active').removeClass('active');
        // replace channel title
        var href = $(this).attr('href');
        $('#channelTitle').text(href);
        // view channel title
        $('#channelTitle').removeClass('d-none');
        $('#directTitle').addClass('d-none');
        // view channel nav icon
        $('#channelNav').removeClass('d-none');
        $('#directNav').addClass('d-none');
        if (window.matchMedia('(max-width: 991px)').matches) {
            showChatContent();
        }
    })
    // direct message click
    function showChatContent() {
        $('#mainMenuOpen').addClass('d-none');
        $('#chatContentClose').removeClass('d-none');
        $('body').addClass('chat-content-show');
    }

    function hideChatContent() {
        $('#chatContentClose').addClass('d-none');
        $('#mainMenuOpen').removeClass('d-none');
        $('body').removeClass('chat-content-show');
    }
    $('#showMemberList').on('click', function(e) {
        e.preventDefault()
        $(this).toggleClass('active');
        $('body').toggleClass('show-sidebar-right');
    })
    $('#chatContentClose').on('click', function(e) {
        e.preventDefault()
        hideChatContent();
    })
    // making sure navleft and sidebar are display when resizing to desktop
    $(window).resize(function() {
        if (window.matchMedia('(min-width: 992px)').matches) {
            $('.chat-navleft').removeClass('d-none');
            $('.chat-sidebar').removeClass('d-none');
        }
    })
}