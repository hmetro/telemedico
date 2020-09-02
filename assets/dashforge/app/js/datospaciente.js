function _loadPTE() {
    var formData, i_mail, i_casa, i_telefono, i_celular;
    i_mail = '<i class="icon ion-md-mail tx-18 tx-primary mg-r-5" title="Correo Electrónico"></i> ';
    i_celular = '<i class="icon ion-md-phone-portrait tx-18 tx-primary mg-r-5" title="Celular"></i> ';
    i_telefono = '<i class="icon ion-md-call tx-18 tx-primary mg-r-5" title="Teléfono"></i> ';
    i_casa = '<i class="icon ion-md-home tx-18 tx-primary mg-r-5"></i> ';
    formData = new FormData();
    formData.append('codigoPersona', localStorage.codPte);
    $('#datosPte').html(template($('#v-loader').html(), {}));
    fetch(epDatosPaciente, {
        headers: {
            'Authorization': localStorage.accessToken
        },
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
        retrievedObject_Tabs.datosPte.load = true;
        localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
        $('.reset-render-lab').addClass('d-none');
        $('.reset-render-hc').addClass('d-none');
        $('.reset-loader-img').addClass('d-none');
        $('#datosPte').html('');
        $.each(data.data[0], function(_i_, _val_) {
            if (_val_ === null) {
                data.data[0][_i_] = '';
            }
        });
        // Set datos de paciente
        localStorage.setItem('primerNombPte', data.data[0].primerNombre);
        localStorage.setItem('segundoNombPte', data.data[0].segundoNombre);
        localStorage.setItem('primerApePte', data.data[0].primerApellido);
        localStorage.setItem('segundoApePte', data.data[0].segundoApellido);
        // Set Medios de contacto
        var arrMediosContacto = data.data[0].mediosContacto;
        var textMediosContactoEmails = '';
        var textMediosContactoTelefonos = '';
        var textMediosContacto = '';
        $.each(arrMediosContacto, function(key, value) {
            if (value.tipo.indexOf('EMAIL') !== -1) {
                textMediosContactoEmails += i_mail + value.valor + '</br> ';
            } else if (value.tipo.indexOf('CELULAR') !== -1) {
                textMediosContactoTelefonos += i_celular + value.valor + '</br> ';
            } else if (value.tipo.indexOf('TELEFONO') !== -1) {
                textMediosContactoTelefonos += i_telefono + value.valor + '</br> ';
            } else {
                textMediosContacto += value.tipo + ': ' + value.valor + '</br> ';
            }
        });
        data.data[0]['textMediosContactoEmails'] = textMediosContactoEmails.slice(0, -2);
        data.data[0]['textMediosContactoTlfs'] = textMediosContactoTelefonos.slice(0, -2);
        data.data[0]['textMediosContactoOtros'] = textMediosContacto.slice(0, -2);
        // Set Direcciones
        var arrDirecciones = data.data[0].direcciones;
        var textDirecciones = '';
        $.each(arrDirecciones, function(key, value) {
            if (value.tipoDireccion.indexOf('CASA') !== -1) {
                textDirecciones += i_casa + ' ' + value.calle + ' ' + value.numero + ' ' + value.interseccion + ' ' + value.referencia + ' <br/> ';
            } else {
                textDirecciones += value.tipoDireccion + ': ' + value.calle + ' ' + value.numero + ' ' + value.interseccion + ' ' + value.referencia + ' <br/> ';
            }
        });
        data.data[0]['textDirecciones'] = textDirecciones;
        $('#datosPte').append(template($('#v-paciente').html(), data.data[0]));
        // validar si esta dentro de los 15 minutos antes para  conectarse a la reunion zoom
        // se suma 5 minutos a la hora de la cita como tiempo de conexion
        var time = moment(moment().format("DD-MM-YYYY HH:mm"), 'DD-MM-YYYY HH:mm').unix();
        var timeCita = moment.unix(parseInt(localStorage.timestampCita, 10)).add(15, 'minutes').unix();
        var cita_menos_15 = moment.unix(parseInt(localStorage.timestampCita, 10)).subtract(15, 'minutes').unix();
        console.log('El tiempo => ' + moment.unix(time).format("DD-MM-YYYY HH:mm"));
        console.log('Hora de cita menos 15 min. => ' + moment.unix(cita_menos_15).format("DD-MM-YYYY HH:mm"));
        console.log('Hora de cita. => ' + moment.unix(timeCita).format("DD-MM-YYYY HH:mm"));
        console.log(moment().format("DD-MM-YYYY HH:mm"));
        $('#t-initCallZoom').show();
        if (time >= cita_menos_15 && time <= timeCita) {
            $('#t-initCallZoom').click(function(e) {
                e.preventDefault();
                initCallZoom();
            });
        } else {
            $('#t-initCallZoom').click(function(e) {
                e.preventDefault();
                initCallZoom();
            });
            //  $('#t-initCallZoom').hide();
        }
    }).catch(function(err) {
        console.error(err);
    });
}