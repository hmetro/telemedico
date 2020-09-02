$(function() {
    initDashforge();
    loadPerfilMedico();
    // Select2
    setOptionCombo('#dia-desde', 0, 31, 'Día');
    setOptionCombo('#mes-desde', 0, 12, 'Mes');
    setOptionCombo('#ano-desde', 2020, 2030, 'Año');
    setOptionCombo('#dia-hasta', 0, 31, 'Día');
    setOptionCombo('#mes-hasta', 0, 12, 'Mes');
    setOptionCombo('#ano-hasta', 2020, 2030, 'Año');
    setOptionCombo('#dura', 10, 60, 'Minutos');
    setOptionComboHoras('#horaInicial', 6, 23, 'Horas');
    setOptionComboHoras('#horaFinal', 6, 23, 'Horas');
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + ((mm < 10) ? '0' + mm : mm) + '-' + ((dd < 10) ? '0' + dd : dd);
    console.log(today);
    $('#desde').attr('min', today);
});
// funcion option
function setOptionCombo(id_e, i = 1, rango, placeholder) {
    $(id_e).html('');
    $(id_e).append("<option value=''>" + placeholder + "</option>");
    for (i; i <= rango; i++) {
        if (i >= 1 && i < 10) {
            $(id_e).append("<option value=0" + i + ">0" + i + "</option>");
        } else {
            $(id_e).append("<option value=" + i + ">" + i + "</option>");
        }
    }
    $(id_e + " option[value='0']").remove();
}
// funcion option
function setOptionComboHoras(id_e, i = 1, rango, placeholder) {
    $(id_e).html('');
    $(id_e).append("<option value=''>" + placeholder + "</option>");
    for (i; i <= rango; i++) {
        if (i >= 1 && i < 10) {
            $(id_e).append("<option value=0" + i + ">0" + i + ":00</option>");
        } else {
            $(id_e).append("<option value=" + i + ">" + i + ":00</option>");
        }
    }
    $(id_e + " option[value='0']").remove();
}

function _ini_nuevo_horario() {
    var process_icon = '<div class="spinner-grow spinner-grow-sm" role="status"></div> ';
    $('#response').removeClass('alert-danger');
    $('#response').removeClass('alert-warning');
    $('#response').addClass('alert-warning');
    $("#response").html(process_icon + 'Procesando, por favor espere...');
    $('#response').removeClass('d-none');
    $('#send').html(process_icon + 'Procesando...');
    $('#send').attr('disabled', true);
    // validaciones de fecha
    var combos = ['#desde', '#hasta'];
    $.each(combos, function(index, value) {
        if ($.trim($(value).val()) == '') {
            $('#response').html('Todos los campos son ncecesarios.').css('font-weight', 'bold');
            $("#response").removeClass('alert-warning');
            $("#response").addClass('alert-danger');
            $('#send').removeAttr('disabled').html('Crear Horario');
            throw '';
        }
    });
    var dias = ['#lunes', '#martes', '#miercoles', '#jueves', '#viernes', '#sabado', '#domingo'];
    $.each(dias, function(index, value) {
        if ($(value).is(":checked")) {
            dias[index] = 'S';
        } else {
            dias[index] = 'N';
        }
    });
    var formData = new FormData();
    var desde = $('#desde').val().split('-');
    var hasta = $('#hasta').val().split('-');
    formData.append('codigoMedico', _codMedico_);
    formData.append('codigoOrganigrama', '86');
    formData.append('fechaInicial', desde[2] + '-' + desde[1] + '-' + desde[0]);
    formData.append('fechaFinal', hasta[2] + '-' + hasta[1] + '-' + hasta[0]);
    formData.append('horaInicial', moment().format("DD-MM-YYYY") + ' ' + $('#horaInicial').val() + ':00');
    formData.append('horaFinal', moment().format("DD-MM-YYYY") + ' ' + $('#horaFinal').val() + ':00');
    formData.append('lunes', dias[0]);
    formData.append('martes', dias[1]);
    formData.append('miercoles', dias[2]);
    formData.append('jueves', dias[3]);
    formData.append('viernes', dias[4]);
    formData.append('sabado', dias[5]);
    formData.append('domingo', dias[6]);
    formData.append('duracion', moment().format("DD-MM-YYYY") + ' 00:' + $('#dura').val());
    fetch(epNuevoHorarioMedico, {
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
            $('#send').html('Crear Horario');
        }
    }).catch(function(err) {
        console.error(err);
    });
};
if (document.getElementById('send')) {
    document.getElementById('send').onclick = function(e) {
        e.preventDefault();
        _ini_nuevo_horario();
    };
}
if (document.getElementById('f-nuevo-horario')) {
    document.getElementById('f-nuevo-horario').onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            _ini_nuevo_horario();
            return false;
        }
    };
}