function _loadPTE() {
    var formData = new FormData();
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
        var textMediosContacto = '';
        $.each(arrMediosContacto, function(key, value) {
            textMediosContacto += value.tipo + ': ' + value.valor + '</br>  ';
        });
        data.data[0]['textMediosContacto'] = textMediosContacto.slice(0, -2);
        // Set Direcciones
        var arrDirecciones = data.data[0].direcciones;
        var textDirecciones = '';
        $.each(arrDirecciones, function(key, value) {
            textDirecciones += value.tipoDireccion + ': ' + value.calle + ' ' + value.numero + ' ' + value.interseccion + ' ' + value.referencia + ' <br/> ';
        });
        data.data[0]['textDirecciones'] = textDirecciones;
        $('#datosPte').append(template($('#v-paciente').html(), data.data[0]));
        // validar si esta dentro de los 15 minutos antes para  conectarse a la reunion zoom
        // se suma 5 minutos a la hora de la cita como tiempo de conexion
        var time = moment(moment().format("DD-MM-YYYY HH:mm"), 'DD-MM-YYYY HH:mm').unix();
        var timeCita = moment.unix(parseInt(localStorage.timestampCita, 10)).add(5, 'minutes').unix();
        var cita_menos_15 = moment.unix(parseInt(localStorage.timestampCita, 10)).subtract(15, 'minutes').unix();
        console.log('El tiempo => ' + moment.unix(time).format("DD-MM-YYYY HH:mm"));
        console.log('Hora de cita menos 15 min. => ' + moment.unix(cita_menos_15).format("DD-MM-YYYY HH:mm"));
        console.log('Hora de cita. => ' + moment.unix(timeCita).format("DD-MM-YYYY HH:mm"));
        console.log(moment().format("DD-MM-YYYY HH:mm"));
        if (time >= cita_menos_15 && time <= timeCita) {
            $('#t-initCallZoom').click(function(e) {
                e.preventDefault();
                initCallZoom();
            });
        } else {
            $('#t-initCallZoom').remove();
        }
    }).catch(function(err) {
        console.error(err);
    });
}