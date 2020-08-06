function _loadLogs() {
    $('#lists-logs').html('');
    $('#load-lists-logs').removeClass('d-none');
    fetch('api/logs/' + localStorage.hcpte, {
        method: "GET",
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $('#load-lists-logs').addClass('d-none');
        if (data.status) {
            $.each(data.data, function(index, value) {
                $('#lists-logs').append(template($('#v-h-clinicas').html(), value));
            });
            $('#lists-logs').removeClass('d-none');
        } else {
            $('#lists-logs').html(template($('#v-not-results').html(), {}));
            $('#lists-logs').removeClass('d-none');
        }
    }).catch(function(err) {
        console.error(err);
    });
}