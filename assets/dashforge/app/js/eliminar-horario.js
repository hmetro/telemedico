$(function() {
    initDashforge();
    loadPerfilMedico();
    // Select2
    getHorario();
});

function getHorario() {
    $('#f-eliminar-horario').hide();
    $('#v-loader').show();
    var desdeHorario = localStorage.getItem('dataHorarioDesde');
    var hastaHorario = localStorage.getItem('dataHorarioHasta');
    $('#desde').val(desdeHorario);
    $('#hasta').val(hastaHorario);
    $('#f-eliminar-horario').show();
    $('#v-loader').hide();
};

function _ini_eliminar_horario() {
    var process_icon = '<div class="spinner-grow spinner-grow-sm" role="status"></div> ';
    $('#response').removeClass('alert-danger');
    $('#response').removeClass('alert-warning');
    $('#response').addClass('alert-warning');
    $("#response").html(process_icon + 'Procesando, por favor espere...');
    $('#response').removeClass('d-none');
    $('#send').html(process_icon + 'Procesando...');
    $('#send').attr('disabled', true);
    var formData = new FormData();
    var desdeHorario = localStorage.getItem('dataHorarioDesde');
    var hastaHorario = localStorage.getItem('dataHorarioHasta');
    formData.append('codigoMedico', _codMedico_);
    formData.append('fechaInicio', desdeHorario.replace(/\//g, "-").split(' ')[0]);
    formData.append('fechaFin', hastaHorario.replace(/\//g, "-").split(' ')[0]);
    fetch(epEliminarHorarioMedico, {
        headers: {
            'Authorization': localStorage.accessToken
        },
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
            location.assign(urlhome + 'configuracion/horarios');
        } else {
            $('#response').html(json.message).css('font-weight', 'bold');
            $("#response").removeClass('alert-warning');
            $("#response").addClass('alert-danger');
            $('#send').removeAttr('disabled');
            $('#send').html('Eliminar Horario');
        }
    }).catch(function(err) {
        console.error(err);
    });
};
if (document.getElementById('send')) {
    document.getElementById('send').onclick = function(e) {
        e.preventDefault();
        _ini_eliminar_horario();
    };
}
if (document.getElementById('f-eliminar-horario')) {
    document.getElementById('f-eliminar-horario').onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            _ini_eliminar_horario();
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