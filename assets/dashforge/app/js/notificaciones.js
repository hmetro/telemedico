function getNotificaciones() {
    var notifys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    $.each(notifys, function(index, value) {
        if (value <= 4) {
            $('#app_notify').append(template($('#v-notify').html(), {
                message: 'Demo de notificacion',
                timestamp: 'Lun, 27/07/2020 15h00'
            }));
        }
        $('#count-notify').removeClass('d-none').html(value);
    });
}