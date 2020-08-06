$(function() {
    // Select2
});

function _ini_nueva_categoria() {
    var process_icon = '<div class="spinner-grow spinner-grow-sm" role="status"></div> ';
    $('#response').removeClass('alert-danger');
    $('#response').removeClass('alert-warning');
    $('#response').addClass('alert-warning');
    $("#response").html(process_icon + 'Procesando, por favor espere...');
    $('#response').removeClass('d-none');
    $('#send').html(process_icon + 'Procesando...');
    $('#send').attr('disabled', true);
    var formData = new FormData();
    formData.append('nombre-categoria', $('#nombre-categoria').val());
    fetch('api/pacientes/categorias', {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        if (json.status) {
            $('#response').html(json.message).css('font-weight', 'bold');
            $("#response").removeClass('alert-warning');
            $("#response").addClass('alert-success');
            location.assign(urlhome + 'configuracion/categorias-pacientes');
        } else {
            $('#response').html(json.message).css('font-weight', 'bold');
            $("#response").removeClass('alert-warning');
            $("#response").addClass('alert-danger');
            $('#send').removeAttr('disabled');
            $('#send').html('Crear Horario');
        }
    }).catch(function(err) {
        console.error(err);
    });
};
if (document.getElementById('send')) {
    document.getElementById('send').onclick = function(e) {
        e.preventDefault();
        _ini_nueva_categoria();
    };
}
if (document.getElementById('f-nueva-categoria')) {
    document.getElementById('f-nueva-categoria').onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            _ini_nueva_categoria();
            return false;
        }
    };
}