$(function() {
    initDashforge();
    loadPerfilMedico();
    // Select2
    getUsuario();
});

function getUsuario() {
    $('#f-eliminar-usuario').hide();
    $('#v-loader').show();
    fetch('api/medicos/usuarios/' + idUser, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        console.log('json = ', json);
        if (json.status) {
            $('#user').val(json.customData[0]['user']);
            $('#f-eliminar-usuario').show();
            $('#v-loader').hide();
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function _ini_eliminar_usuario() {
    var process_icon = '<div class="spinner-grow spinner-grow-sm" role="status"></div> ';
    $('#response').removeClass('alert-danger');
    $('#response').removeClass('alert-warning');
    $('#response').addClass('alert-warning');
    $("#response").html(process_icon + 'Procesando, por favor espere...');
    $('#response').removeClass('d-none');
    $('#send').html(process_icon + 'Procesando...');
    $('#send').attr('disabled', true);
    fetch('api/medicos/usuarios', {
        method: "DELETE",
        body: JSON.stringify({
            idUser: idUser,
        }),
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        if (json.status) {
            $('#response').html(json.message).css('font-weight', 'bold');
            $("#response").removeClass('alert-warning');
            $("#response").addClass('alert-success');
            location.assign(urlhome + 'configuracion/usuarios');
        } else {
            $('#response').html(json.message).css('font-weight', 'bold');
            $("#response").removeClass('alert-warning');
            $("#response").addClass('alert-danger');
            $('#send').removeAttr('disabled');
            $('#send').html('Eliminar Usuario');
        }
    }).catch(function(err) {
        console.error(err);
    });
};
if (document.getElementById('send')) {
    document.getElementById('send').onclick = function(e) {
        e.preventDefault();
        _ini_eliminar_usuario();
    };
}
if (document.getElementById('f-eliminar-usuario')) {
    document.getElementById('f-eliminar-usuario').onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            _ini_eliminar_usuario();
            return false;
        }
    };
}

function template(templateid, data) {
    return templateid.replace(/%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
        function(m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        });
}