$(function() {
    // Select2
    getCategoria();
});

function getCategoria() {
    $('#f-editar-categoria').hide();
    $('#v-loader').show();
    fetch('api/pacientes/categorias/' + idCategoria, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        console.log('json = ', json);
        if (json.status) {
            $('#nombre-categoria').val(json.customData[0]['categoria']);
            $('#f-editar-categoria').show();
            $('#v-loader').hide();
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function _ini_editar_categoria() {
    var process_icon = '<div class="spinner-grow spinner-grow-sm" role="status"></div> ';
    $('#response').removeClass('alert-danger');
    $('#response').removeClass('alert-warning');
    $('#response').addClass('alert-warning');
    $("#response").html(process_icon + 'Procesando, por favor espere...');
    $('#response').removeClass('d-none');
    $('#send').html(process_icon + 'Procesando...');
    $('#send').attr('disabled', true);
    fetch('api/pacientes/categorias', {
        method: "PUT",
        body: JSON.stringify({
            idCategoria: idCategoria,
            nombreCategoria: $('#nombre-categoria').val(),
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
        _ini_editar_categoria();
    };
}
if (document.getElementById('f-editar-categoria')) {
    document.getElementById('f-editar-categoria').onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            _ini_editar_categoria();
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