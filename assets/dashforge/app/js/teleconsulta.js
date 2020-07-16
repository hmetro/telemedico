$(function() {
    // loadContactos();
    $('#initCallZoom').click(function(e) {
        e.preventDefault();
        initCallZoom();
    });
    $('.tabContact').click(function(e) {
        e.preventDefault();
        resetCallZoom();
    });
    $('.close-zoom').click(function(e) {
        e.preventDefault();
        if (confirm("¿Esta Ud. seguro de cerrar la presente Teleconsulta?.")) {
            _del_call_zoom();
        }
    });
    // Collapse content
    $('#accordion2').accordion({
        heightStyle: 'content',
        collapsible: true
    });
});
// function desplega datapicker
function dataPickersMX() {
    // setdefault para español
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '< Ant',
        nextText: 'Sig >',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    // set default para español
    $.datepicker.setDefaults($.datepicker.regional['es']);
    $('#fecha_cita').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true
    });
}

function loadContactos() {
    $('#allContacts').html(template($('#v-spinner').html(), {}));
    fetch('api/contactos', {
        method: "GET",
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $('#allContacts').html('');
        // Llamada creada
        if (data.status) {
            $.each(data.customData, function(index, value) {
                $('#allContacts').append(template($('#v-contacto').html(), {
                    id: value.id,
                    inicial: value.contacto.charAt(0),
                    contacto: value.contacto,
                    email: value.correo,
                }));
            });
            $('.m-contacto').click(function(e) {
                e.preventDefault();
                localStorage.setItem('id_contacto', this.id);
                localStorage.setItem('contacto', $('#contacto-' + this.id).text());
                localStorage.setItem('correo', $('#correo-' + this.id).text());
                $('#v-contacto-inicial').html($('#inicial-' + this.id).text());
                $('#v-contacto-contacto').html($('#contacto-' + this.id).text());
                $('#v-contacto-correo').html($('#correo-' + this.id).text());
                $('.contact-content-sidebar').removeClass('d-none');
                $('.contact-content-header').css('right', '690px');
                $('.contact-content-body').css('right', '690px');
            });
            $('#initCall').click(function(e) {
                e.preventDefault();
                $('#modalInitCall').modal('show');
                initCallZoom();
            });
        } else {
            $('#allContacts').html(template($('#v-not-contactos').html(), {}));
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function resetCallZoom() {
    $('.contact-sidebar').removeClass('d-none');
    $('.contact-content').css('left', '340px');
    $('.contact-content-header').css('right', '290px');
    $('.contact-content-body').css('right', '290px');
    $('.contact-content-sidebar').css('width', '290px');
}

function initCallZoom() {
    $('.contact-sidebar').addClass('d-none');
    $('.contact-content').css('left', '60px');
    $('.contact-content-header').css('right', '600px');
    $('.contact-content-body').css('right', '600px');
    $('.contact-content-sidebar').css('width', '600px');
    _ini_new_cita();
}
// Updated 28 October 2011: Now allows 0, NaN, false, null and undefined in output. 
function template(templateid, data) {
    return templateid.replace(/%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
        function(m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        });
}

function MaysPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function _ini_new_cita() {
    $('#t-initCallZoom').html('Procesando...');
    $('#t-initCallZoom').attr('disabled', true);
    $.ajax({
        type: "POST",
        url: "api/citas",
        success: function(json) {
            if (json.status) {
                $('#i-live').attr('src', json.url);
                $('.live-active').removeClass('d-none').click();
                $('.paciente').removeClass('active');
                $('#live').addClass('show active');
                // links teleconsultas
                $('#l-link-teleconsulta').removeClass('d-none');
                $('#p-link-teleconsulta').removeClass('d-none');
                $('#link-teleconsulta').attr('href', json.url_zoom).html(json.url_zoom);
                $('.close-zoom').removeClass('d-none');
                $('.notas').removeClass('d-none');
                window.localStorage.setItem('id_call', json.id_call);
                $('.select2').select2({
                    placeholder: 'Tipo de nota',
                    searchInputPlaceholder: 'Buscar...'
                });
            } else {
                alert(json.message);
                //  $('#f-new-cita-response').html(json.message).css('font-weight', 'bold');
                //  $("#f-new-cita-response").removeClass('alert-warning');
                //  $("#f-new-cita-response").addClass('alert-danger');
                //  $('#f-new-cita-send').removeAttr('disabled');
                //  $('#f-new-cita-send').html('Generar');
            }
        },
        error: function() {
            window.alert('#Request Error!');
        }
    });
};

function _del_call_zoom() {
    var formData = new FormData();
    formData.append('id_call', localStorage.id_call);
    fetch('api/zoom/eliminar', {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        console.log(response.status);
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        if (data.getStatusCode == 204) {
            window.location.reload();
        }
    }).catch(function(err) {
        console.error(err);
    });
};