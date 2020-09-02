/*
$(function() {
    initDashforge();
    initDashforgeContacts();
    loadPanelDatosMedico();
    getNotificaciones();
    loadContactos();
    searchContacts();
    $('[data-toggle="tab"]').click(function(e) {
        e.preventDefault();
        var panel = $(this).attr('data-panel');
        if (panel == 'tabCitasHoy') {
            loadContactos();
        }
        if (panel == 'tabCitasRecientes') {
            loadContactosPasados();
        }
    });
    $('[data-toggle="tooltip"]').click(function(e) {
        e.preventDefault();
        var panel = $(this).attr('data-panel');
        if (panel == 'tabCitasHoy') {
            loadContactos();
        }
        if (panel == 'tabCitasRecientes') {
            loadContactosPasados();
        }
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
    $('.accordion').accordion({
        heightStyle: 'content'
    });
    $('[data-toggle="tooltip"]').tooltip();
    $('.off-canvas-menu').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $(target).addClass('show');
    });
    $('.off-canvas .close').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.off-canvas').removeClass('show');
    })
    $(document).on('click touchstart', function(e) {
        e.stopPropagation();
        // closing of sidebar menu when clicking outside of it
        if (!$(e.target).closest('.off-canvas-menu').length) {
            var offCanvas = $(e.target).closest('.off-canvas').length;
            if (!offCanvas) {
                $('.off-canvas.show').removeClass('show');
            }
        }
    });
});


// SET ACTIVE DATA CITA
function setActiveCita() {
    $('.ver-cita').click(function(e) {
        e.preventDefault();
        var idpte = $(this).attr('data-idpte');
        var hcpte = $(this).attr('data-hcpte');
        var nombresPaciente = $(this).attr('data-nombpte');
        var idH = $(this).attr('data-idh');
        var idT = $(this).attr('data-idt');
        var timestampCita = $(this).attr('data-timestamp');
        var timestampFinCita = $(this).attr('data-timestampfin');
        var numAdm = $(this).attr('data-numadm');
        localStorage.setItem('idpte', idpte);
        localStorage.setItem('hcpte', hcpte);
        localStorage.setItem('nombpte', nombresPaciente);
        localStorage.setItem('idh', idH);
        localStorage.setItem('idt', idT);
        localStorage.setItem('tipoCita', 'Futura');
        localStorage.setItem('timestampCita', timestampCita);
        localStorage.setItem('timestampFinCita', timestampFinCita);
        localStorage.setItem('numAdm', numAdm);
        _loadPTE();
        _loadHistoriasClinicas();
        _loadLogs();
        tableLaboratorio();
        $('.contact-content-body').scrollTop(0);
    });
    $('.ver-cita-pasada').click(function(e) {
        e.preventDefault();
        var idpte = $(this).attr('data-idpte');
        var hcpte = $(this).attr('data-hcpte');
        var nombresPaciente = $(this).attr('data-nombpte');
        var idH = $(this).attr('data-idh');
        var idT = $(this).attr('data-idt');
        var timestampCita = $(this).attr('data-timestamp');
        var timestampFinCita = $(this).attr('data-timestampfin');
        var numAdm = $(this).attr('data-numadm');
        localStorage.setItem('idpte', idpte);
        localStorage.setItem('hcpte', hcpte);
        localStorage.setItem('nombpte', nombresPaciente);
        localStorage.setItem('idh', idH);
        localStorage.setItem('idt', idT);
        localStorage.setItem('tipoCita', 'Pasada');
        localStorage.setItem('timestampCita', timestampCita);
        localStorage.setItem('timestampFinCita', timestampFinCita);
        localStorage.setItem('numAdm', numAdm);
        _loadPTE();
        _loadHistoriasClinicas();
        _loadLogs();
        tableLaboratorio();
        $('.contact-content-body').scrollTop(0);
        // Eliminar boton zoom
    });
}
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

function loadContactosPasados() {
    $('#allPtesHoy').parent().removeClass('active show');
    $('#allPtesRecientes').parent().addClass('active show');
    $('#allSearchPtes').parent().removeClass('active show');
    var formData = new FormData();
    formData.append('codigoMedico', _codMedico_);
    formData.append('tipoHorario', '2');
    formData.append('startDate', '01-01-2019');
    formData.append('start', 0);
    formData.append('length', 10);
    $('#allPtesRecientes').html(template($('#v-loader').html(), {}));
    fetch(epCitasAgendaPasadas, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $('#allPtesRecientes').html('');
        $('#allPtesRecientes').append(template($('#l-citasAnteriores').html(), {}));
        // Llamada creada
        if (data.status) {
            $.each(data.data, function(index, value) {
                // Set valores null
                $.each(value, function(_i_, _val_) {
                    if (_val_ === null) {
                        value[_i_] = '';
                    }
                });
                var fecha = moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
                var timestamp = moment(fecha + 'T' + value.horaInicio + ':00').unix();
                var timestampFin = moment(fecha + 'T' + value.horaFin + ':00').unix();
                $('#allPtesRecientes').append(template($('#v-cita-pasada').html(), {
                    id: value.codigoPersonaPaciente,
                    inicial: value.primerNombrePaciente.charAt(0),
                    pte: value.primerNombrePaciente + ' ' + value.segundoNombrePaciente + ' ' + value.primerApellidoPaciente + ' ' + value.segundoApellidoPaciente,
                    hora: value.horaInicio,
                    fecha: value.fecha,
                    horaFin: value.horaFin,
                    nhc: value.numeroHistoriaClinica,
                    idh: value.codigoHorario,
                    idt: value.numeroTurno,
                    asistio: value.asistio,
                    numAdm: value.numeroAdmision,
                    timestamp: timestamp,
                    timestampFin: timestampFin,
                }));
                if (value.asistio == 'S') {
                    $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-online').attr('title', 'Cita Asistida.');
                } else {
                    $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-offline').attr('title', 'Cita No Asistida.');
                }
            });
            initDashforgeContacts();
            setActiveCita();
        } else {
            $('#allPtesRecientes').html(template($('#v-not-results-sidebar').html(), {}));
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function loadContactos() {
    $('#allPtesHoy').parent().addClass('active show');
    $('#allPtesRecientes').parent().removeClass('active show');
    $('#allSearchPtes').parent().removeClass('active show');
    var formData = new FormData();
    formData.append('codigoMedico', _codMedico_);
    formData.append('tipoHorario', '2');
    formData.append('endDate', _diaPosterior_);
    formData.append('start', 0);
    formData.append('length', 100);
    $('#allPtesHoy').html(template($('#v-loader').html(), {}));
    fetch(epCitasAgendaPendientes, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $('#allPtesHoy').html('');
        $('#allPtesHoy').append(template($('#l-citasHoy').html(), {}));
        // Llamada creada
        if (data.status) {
            $.each(data.data.reverse(), function(index, value) {
                // Set valores null
                $.each(value, function(_i_, _val_) {
                    if (_val_ === null) {
                        value[_i_] = '';
                    }
                });
                // moment.invalid();
                // value.fecha = '04-08-2020';
                if (value.fecha === '13-08-2020') {
                    // value.horaInicio = moment().format("HH:mm");
                    var fecha = moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    var timestamp = moment(fecha + 'T' + value.horaInicio + ':00').unix();
                    var timestampFin = moment(fecha + 'T' + value.horaFin + ':00').unix();
                    var timestampFinTemp = moment.unix(timestamp).add(1, 'minutes').unix();
                    $('#allPtesHoy').append(template($('#v-cita').html(), {
                        id: value.codigoPersonaPaciente,
                        inicial: value.primerNombrePaciente.charAt(0),
                        pte: value.primerNombrePaciente + ' ' + value.segundoNombrePaciente + ' ' + value.primerApellidoPaciente + ' ' + value.segundoApellidoPaciente,
                        hora: value.horaInicio,
                        horaFin: value.horaFin,
                        fecha: value.fecha,
                        nhc: value.numeroHistoriaClinica,
                        idh: value.codigoHorario,
                        idt: value.numeroTurno,
                        asistio: value.asistio,
                        numAdm: value.numeroAdmision,
                        timestamp: timestamp,
                        timestampFin: timestampFinTemp,
                    }));
                    console.log(value.fecha + ' ' + value.horaInicio);
                    console.log(timestamp);
                    if (value.asistio == 'S') {
                        $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-online').attr('title', 'Cita Asistida.');
                    } else {
                        $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-offline').attr('title', 'Cita Pendiente o No Asistida.');
                    }
                } else {
                    var fecha = moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    var timestamp = moment(fecha + 'T' + value.horaInicio + ':00').unix();
                    var timestampFin = moment(fecha + 'T' + value.horaFin + ':00').unix();
                    var timestampFinTemp = moment.unix(timestamp).add(1, 'minutes').unix();
                    $('#allPtesHoy').append(template($('#v-cita').html(), {
                        id: value.codigoPersonaPaciente,
                        inicial: value.primerNombrePaciente.charAt(0),
                        pte: value.primerNombrePaciente + ' ' + value.segundoNombrePaciente + ' ' + value.primerApellidoPaciente + ' ' + value.segundoApellidoPaciente,
                        hora: value.horaInicio,
                        fecha: value.fecha,
                        horaFin: value.horaFin,
                        nhc: value.numeroHistoriaClinica,
                        idh: value.codigoHorario,
                        idt: value.numeroTurno,
                        numAdm: value.numeroAdmision,
                        asistio: value.asistio,
                        timestamp: timestamp,
                        timestampFin: timestampFin,
                    }));
                    console.log(value.fecha + ' ' + value.horaInicio);
                    console.log(timestamp);
                    if (value.asistio == 'S') {
                        $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-online').attr('title', 'Cita Asistida.');
                    } else {
                        $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-offline').attr('title', 'Cita Pendiente o No Asistida.');
                    }
                }
            });
            initDashforgeContacts();
            setActiveCita();
        } else {
            $('#allPtesHoy').html(template($('#v-not-results-sidebar').html(), {}));
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function _loadPTE() {
    var formData = new FormData();
    formData.append('codigoPersona', localStorage.idpte);
    $('#paciente').html(template($('#v-loader').html(), {}));
    fetch(epDatosPaciente, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $('#paciente').html('');
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
            textMediosContacto += value.tipo + ': ' + value.valor + ' - ';
        });
        data.data[0]['textMediosContacto'] = textMediosContacto.slice(0, -2);
        // Set Direcciones
        var arrDirecciones = data.data[0].direcciones;
        var textDirecciones = '';
        $.each(arrDirecciones, function(key, value) {
            textDirecciones += value.tipoDireccion + ': ' + value.calle + ' ' + value.numero + ' ' + value.interseccion + ' ' + value.referencia + ' <br/> ';
        });
        data.data[0]['textDirecciones'] = textDirecciones;
        $('#paciente').append(template($('#v-paciente').html(), data.data[0]));
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
            $('#t-initCallZoom').parent().remove();
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function _loadHistoriasClinicas() {
    $('#lists-hc').html('');
    $('#load-lists-hc').removeClass('d-none');
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    fetch(epHistoriasClinicasAnteriores, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $('#load-lists-hc').addClass('d-none');
        if (data.status) {
            $.each(data.data, function(index, value) {
                if (value.registraHistoriaClinica == 'S') {
                    $('#lists-hc').append(template($('#v-h-tel-clinicas').html(), value));
                } else {
                    $('#lists-hc').append(template($('#v-h-clinicas').html(), value));
                }
            });
            $('#lists-hc').removeClass('d-none');
            $('.detalle-hc').click(function(e) {
                e.preventDefault();
                var adm = $(this).attr('data-adm');
                var fechaHC = $(this).attr('data-fechahc');
                localStorage.setItem('adm', adm);
                localStorage.setItem('fechaHC', fechaHC);
                initViewHC();
            });
        } else {
            $('#lists-hc').html(template($('#v-not-results').html(), {}));
            $('#lists-hc').removeClass('d-none');
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function setViewHC(json) {
    // DATOS MOTIVO CONSULTA
    var arrMotivoConsulta = json.data.motivoConsulta;
    if (Object.keys(arrMotivoConsulta).length > 0) {
        $('#motivo').html(template($('#v-motivo-consulta').html(), {
            motivoConsulta: json.data.motivoConsulta['motivoConsulta'],
            antecedentesPersonales: json.data.motivoConsulta['antecedentesPersonales'],
            enfermedadActual: json.data.motivoConsulta['enfermedadActual'],
        }));
    } else {
        $('#motivo').html(template($('#v-not-data').html(), {}));
    }
    // DATOS REVISION DE ORGANOS
    var arrRevisionOrganos = json.data.revisionOrganos;
    var textRevision = '';
    $.each(arrRevisionOrganos, function(key, value) {
        if (key == 'cardioVascular') {
            textRevision += ' Cardiovascular: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'digestivo') {
            textRevision += ' Digestivo: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'endocrino') {
            textRevision += ' Endócrino: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'genital') {
            textRevision += ' Genital: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'hemoLinfatico') {
            textRevision += ' Hemolinfatico: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'muscEsqueletico') {
            textRevision += ' Musc. Esqueletico: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'nervioso') {
            textRevision += ' Nervioso: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'respiratorio') {
            textRevision += ' Respiratorio: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'sentidos') {
            textRevision += ' Sentidos: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'urinario') {
            textRevision += ' Uriniario: ' + ((value != '') ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
    });
    $('#organos').html(template($('#v-revision-organos').html(), {
        revisionOrganos: textRevision
    }));
    //Anteceentes familiares
    var arrAntecedentesFamiliares = json.data.antecedentesFamiliares;
    var textAntecedentes = '';
    $.each(arrAntecedentesFamiliares, function(key, value) {
        if (key == 'cancer') {
            textAntecedentes += ' Cáncer: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'cardiopatia') {
            textAntecedentes += ' Cardiopatía: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'diabetes') {
            textAntecedentes += ' Diabetes: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'enfermedadInfecciosa') {
            textAntecedentes += ' E. Infecciosas: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'enfermedadVascular') {
            textAntecedentes += ' E. Vascular: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'enfermendadMental') {
            textAntecedentes += ' E. Mental: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'hipertension') {
            textAntecedentes += ' Hipertensión: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'malformacion') {
            textAntecedentes += ' Malformación: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'tuberculosis') {
            textAntecedentes += ' Tuberculosis: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'otro') {
            textAntecedentes += ' Otros: ' + ((value != '') ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
    });
    $('#ante').html(template($('#v-antecedentes').html(), {
        ante: textAntecedentes
    }));
    // Signos Vitales
    var arrSignosVitales = json.data.signosVitales;
    var textSignos = '';
    if (Object.keys(arrSignosVitales).length > 0) {
        $('#signos').html(template($('#v-signos').html(), {}));
        $.each(arrSignosVitales, function(key, value) {
            $('#detalle-signos').append(template($('#v-signos-detalle').html(), value));
        });
    } else {
        $('#signos').html(template($('#v-not-data').html(), {}));
    }
    // Examen Físico
    var arrExamenFisico = json.data.examenFisico;
    if (Object.keys(arrExamenFisico).length > 0) {
        $('#examen').html(template($('#v-examen').html(), {
            abdomen4R: arrExamenFisico['abdomen4R'],
            cabeza1R: arrExamenFisico['cabeza1R'],
            cuello2R: arrExamenFisico['cuello2R'],
            extremidades6R: arrExamenFisico['extremidades6R'],
            pelvis5R: arrExamenFisico['pelvis5R'],
            planTratamiento: arrExamenFisico['planTratamiento'],
            torax3R: arrExamenFisico['torax3R'],
        }));
    } else {
        $('#examen').html(template($('#v-not-data').html(), {}));
    }
    // Diagnosticos
    var arrDiagnosticos = json.data.diagnosticos;
    if (Object.keys(arrDiagnosticos).length > 0) {
        $('#diagnosticos').html(template($('#v-diagnosticos').html(), {}));
        $.each(arrDiagnosticos, function(key, value) {
            $('#detalle-diag').append(template($('#v-diag-detalle').html(), value));
        });
    } else {
        $('#diagnosticos').html(template($('#v-not-data').html(), {}));
    }
    // Evoluciones
    var arrEvoluciones = json.data.evoluciones;
    if (Object.keys(arrEvoluciones).length > 0) {
        $('#evoluciones').html(template($('#v-evoluciones').html(), {
            codigo: arrEvoluciones['codigo'],
            descripcion: arrEvoluciones['descripcion'],
        }));
    } else {
        $('#evoluciones').html(template($('#v-not-data').html(), {}));
    }
    // Preecripciones
    var arrPreecripciones = json.data.prescripciones;
    if (Object.keys(arrPreecripciones).length > 0) {
        $('#prees').html(template($('#v-prees').html(), {}));
        $.each(arrPreecripciones, function(key, value) {
            $('#detalle-prees').append(template($('#v-prees-detalle').html(), value));
        });
    } else {
        $('#prees').html(template($('#v-not-data').html(), {}));
    }
}

function _loadHC() {
    $('#load-view-hc').removeClass('d-none');
    $('.contact-content-body').scrollTop(0);
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    formData.append('numeroAdmision', localStorage.adm);
    fetch(epHistoriasClinicasConsultar, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        console.log('data = ', json);
        if (json.status) {
            var primerNombPte, segundoNombPte, primerApePte, segundoApePte;
            primerNombPte = ((json.data.primerNombrePaciente !== null) ? json.data.primerNombrePaciente : '');
            segundoNombPte = ((json.data.segundoNombrePaciente !== null) ? json.data.segundoNombrePaciente : '');
            primerApePte = ((json.data.primerApellidoPaciente !== null) ? json.data.primerApellidoPaciente : '');
            segundoApePte = ((json.data.segundoApellidoPaciente !== null) ? json.data.segundoApellidoPaciente : '');
            $('#navPacientes').addClass('d-none');
            $('#load-view-hc').addClass('d-none');
            $('#view-hc').removeClass('d-none');
            $('#view-hc').html(template($('#v-hc-detalle').html(), {}));
            $('#fechaHC').html('<b>FECHA:</b> ' + localStorage.fechaHC);
            $('#nPaciente').html(' <b>PTE:</b> ' + ((primerNombPte !== '') ? primerNombPte : '') + ' ' + ((segundoNombPte !== '') ? segundoNombPte : '') + ' ' + ((primerApePte !== '') ? primerApePte : '') + ' ' + ((segundoApePte !== '') ? segundoApePte : ''));
            $('#nhcPaciente').html(' <b>NHC:</b> ' + json.data.numeroHistoriaClinica);
            $('#admPaciente').html(' <b>ADM:</b> ' + json.data.numeroAdmision);
            setViewHC(json);
            $('.reset-render-hc').click(function(e) {
                e.preventDefault();
                $('#navPacientes').removeClass('d-none');
                $('.contact-sidebar').removeClass('d-none');
                $('.contact-content').css('left', '340px');
                $('.contact-content-header').css('right', '290px');
                $('.contact-content-body').css('right', '290px');
                $('#lists-hc').removeClass('d-none');
                $('#view-hc').addClass('d-none').html('');
            });
        } else {
            $('#navPacientes').addClass('d-none');
            $('#load-view-hc').addClass('d-none');
            $('#view-hc').removeClass('d-none');
            $('#view-hc').html(template($('#v-not-results').html(), {}));
            setTimeout(function() {
                $('#navPacientes').removeClass('d-none');
                $('.contact-sidebar').removeClass('d-none');
                $('.contact-content').css('left', '340px');
                $('.contact-content-header').css('right', '290px');
                $('.contact-content-body').css('right', '290px');
                $('#lists-hc').removeClass('d-none');
                $('#view-hc').addClass('d-none').html('');
                resetRenderHC();
            }, 1200);
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function resetRenderHC() {
    setTimeout(function() {
        $('.contact-sidebar').removeClass('d-none');
        $('.contact-content').css('left', '340px');
        $('.contact-content-header').css('right', '290px');
        $('.contact-content-body').css('right', '290px');
        $('#lists-hc').removeClass('d-none');
        $('#load-view-hc').addClass('d-none');
        $('#view-hc').addClass('d-none').html('');
    }, 8000);
}

function resetViewHC() {
    $('.contact-sidebar').addClass('d-none');
    $('.contact-content').css('left', '60px');
    $('.contact-content-header').css('right', '300px');
    $('.contact-content-body').css('right', '300px');
    $('.contact-content-sidebar').addClass('d-none');
    $('.contact-content-header').removeClass('wd-100p');
    $('.contact-content-body').removeClass('wd-100p');
    $('#lists-hc').addClass('d-none');
    $('#view-file-hc').removeClass('d-none');
    $('#view-file-hc').html(template($('#v-hc-detalle').html(), {}));
}

function initViewHC() {
    $('.contact-sidebar').addClass('d-none');
    $('.contact-content').css('left', '60px');
    $('.contact-content-header').css('right', '300px');
    $('.contact-content-body').css('right', '300px');
    $('.contact-content-header').addClass('wd-100p');
    $('.contact-content-body').addClass('wd-100p');
    $('.contact-content-sidebar').addClass('d-none');
    $('#lists-hc').addClass('d-none');
    $('#view-file-hc').removeClass('d-none');
    $('#view-file-hc').html(template($('#v-loader').html(), {}));
    _loadHC();
}

function resetCallZoom() {
    $('#navPacientes').removeClass('d-none');
    $('.contact-sidebar').removeClass('d-none');
    $('.contact-content').css('left', '340px');
    $('.contact-content-header').css('right', '290px');
    $('.contact-content-body').css('right', '290px');
    $('.contact-content-sidebar').css('width', '290px');
    $('.contact-content-sidebar').addClass('d-none');
    $('.contact-content-header').removeClass('wd-100p');
    $('.contact-content-body').removeClass('wd-100p');
}

*/
function setInsertHistoriaClinica() {
    var motivoConsulta = new Quill('#motivoConsulta', {
        modules: {
            toolbar: []
        },
        bounds: '#motivoConsulta',
        scrollingContainer: '#scrolling-container-motivoConsulta',
        placeholder: 'Escribir...',
        theme: 'bubble'
    });
    motivoConsulta.setContents([{
        insert: (localStorage.ultimoMotivo === undefined || localStorage.ultimoMotivo === '') ? '' : localStorage.ultimoMotivo,
    }]);
    motivoConsulta.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            var text_motivo, itext_motivo;
            text_motivo = motivoConsulta.getContents();
            itext_motivo = text_motivo.ops[0].insert;
            localStorage.setItem('hcmotivoConsulta', itext_motivo);
            $('.save-1').removeClass('d-none');
            setTimeout(function() {
                $('.save-1').addClass('d-none');
                $('.check-1').removeClass('d-none');
            }, 3000);
            setTimeout(function() {
                $('.check-1').addClass('d-none');
            }, 6000);
        }
    });
    var antecedentes = new Quill('#antecedentes', {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{
                    'header': 1
                }, {
                    'header': 2
                }, 'blockquote'],
                ['link', 'image', 'code-block'],
            ]
        },
        bounds: '#antecedentes',
        scrollingContainer: '#scrolling-container-antecedentes',
        placeholder: 'Escribir...',
        theme: 'bubble'
    });
    antecedentes.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            var text_antecedentes, itext_antecedentes;
            text_antecedentes = antecedentes.getContents();
            itext_antecedentes = text_antecedentes.ops[0].insert;
            localStorage.setItem('hcantecedentes', itext_antecedentes);
            $('.save-2').removeClass('d-none');
            setTimeout(function() {
                $('.save-2').addClass('d-none');
                $('.check-2').removeClass('d-none');
            }, 3000);
            setTimeout(function() {
                $('.check-2').addClass('d-none');
            }, 6000);
            console.log("A user action triggered this change.");
        }
    });
    var evoluciones = new Quill('#evoluciones', {
        modules: {
            toolbar: []
        },
        bounds: '#evoluciones',
        scrollingContainer: '#scrolling-container-evoluciones',
        placeholder: 'Escribir Evolución...',
        theme: 'bubble'
    });
    evoluciones.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            var text_evoluciones, itext_evoluciones;
            text_evoluciones = evoluciones.getContents();
            itext_evoluciones = text_evoluciones.ops[0].insert;
            localStorage.setItem('hcevoluciones', itext_evoluciones);
            $('.save-4').removeClass('d-none');
            setTimeout(function() {
                $('.save-4').addClass('d-none');
                $('.check-4').removeClass('d-none');
            }, 3000);
            setTimeout(function() {
                $('.check-4').addClass('d-none');
            }, 6000);
            console.log("A user action triggered this change.");
        }
    });
    var preescripciones = new Quill('#preescripciones', {
        modules: {
            toolbar: []
        },
        bounds: '#preescripciones',
        scrollingContainer: '#scrolling-container-preescripciones',
        placeholder: 'Escribir Preescripción...',
        theme: 'bubble'
    });
    preescripciones.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            var text_preescripciones, itext_preescripciones;
            text_preescripciones = preescripciones.getContents();
            itext_preescripciones = text_preescripciones.ops[0].insert;
            localStorage.setItem('hcpreescripciones', itext_preescripciones);
            $('.save-5').removeClass('d-none');
            setTimeout(function() {
                $('.save-5').addClass('d-none');
                $('.check-5').removeClass('d-none');
            }, 3000);
            setTimeout(function() {
                $('.check-5').addClass('d-none');
            }, 6000);
            console.log("A user action triggered this change.");
        }
    });
    var diagnosticos = new Quill('#diagnosticos', {
        modules: {
            toolbar: []
        },
        bounds: '#diagnosticos',
        scrollingContainer: '#scrolling-container-diagnosticos',
        placeholder: 'Escribir Diagnóstico...',
        theme: 'bubble'
    });
    diagnosticos.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            var text_diagnosticos, itext_diagnosticos;
            text_diagnosticos = diagnosticos.getContents();
            itext_diagnosticos = text_diagnosticos.ops[0].insert;
            localStorage.setItem('hcdiagnosticos', itext_diagnosticos);
            $('.save-3').removeClass('d-none');
            setTimeout(function() {
                $('.save-3').addClass('d-none');
                $('.check-3').removeClass('d-none');
            }, 3000);
            setTimeout(function() {
                $('.check-3').addClass('d-none');
            }, 6000);
            console.log("A user action triggered this change.");
        }
    });
    getDiagnosticos();
}

function getDiagnosticos() {
    var formData = new FormData();
    formData.append('start', 1);
    formData.append('length', 1000);
    fetch('https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/diagnosticos/consultar', {
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
            $.each(json.data, function(i, item) {
                $('.select-diag').append($('<option>', {
                    value: item.codigoDiagnostico + ',' + item.codigoGrupoDiagnostico,
                    text: item.descripcionDiagnostico
                }));
            });
        }
        $('.select-diag').select2({
            width: '60%',
            placeholder: 'Diagnóstico...',
            maximumSelectionLength: 1,
        });
        /*
        $(".select-diag").on("select2:select", function(e) {
            var select_val = $(e.currentTarget).val();
            localStorage.setItem('codigoGrupoDiagnostico', select_val);
        });
        */
    }).catch(function(err) {
        console.error(err);
    });
}

function _ini_new_cita() {
    $('#t-initCallZoom').html('Procesando...');
    $('#t-initCallZoom').attr('disabled', true);
    var formData = new FormData();
    formData.append('idH', localStorage.idh);
    formData.append('idT', localStorage.idt);
    formData.append('nhcPte', localStorage.hcpte);
    fetch(apiCitas, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        if (json.status) {
            $('#t-initCallZoom').addClass('d-none');
            $('#zoomLive').attr('src', json.url);
            $('.misPacientes').addClass('d-none');
            $('.nav-live').removeClass('d-none');
            $('.tab-live').removeClass('d-none');
            $('.citaClose').addClass('d-none');
            $('.closeLive').addClass('active-red');
            // $('.reconnectLive').removeClass('d-none');
            $('.livePte').removeClass('d-none').click();
            $('#livePte').addClass('show active');
            // Status en una videollamada
            localStorage.setItem('sts', 5);
            localStorage.setItem('online', 0);
            // links teleconsultas
            localStorage.setItem('id_call', json.id_call);
            $('.accordion').accordion({
                heightStyle: 'content'
            });
            var px_h = ($('.chat-content-body').height() - ($('.chat-content-footer').height() + ($('.nav').height() * 3.2))) + 'px';
            $('.d-panelHC').css('height', px_h);
            setInterval(function() {
                statusParticipantes();
            }, 1000);
            /*
            $('.reconnectLive').click(function(e) {
                e.preventDefault();
                document.getElementById('zoomLive').contentWindow.location.reload(true);
            });
            */
            $('.closeLive').click(function(e) {
                e.preventDefault();
                var r = confirm("¿Esta Ud. seguro de cerrar la presente Teleconsulta?.");
                if (r == true) {
                    _del_call_zoom();
                } else {
                    return false;
                }
            });
            $('header').addClass('control');
            $('.control').on('click', function(e) {
                e.preventDefault();
                console.log('APP Online');
            });
            $('.control > a').on('click', function(e) {
                e.preventDefault();
                console.log('APP Online');
            });
        } else {
            alert(json.message);
            //  $('#f-new-cita-response').html(json.message).css('font-weight', 'bold');
            //  $("#f-new-cita-response").removeClass('alert-warning');
            //  $("#f-new-cita-response").addClass('alert-danger');
            //  $('#f-new-cita-send').removeAttr('disabled');
            //  $('#f-new-cita-send').html('Generar');
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function _ini_new_cita_v2() {
    $('#t-initCallZoom').html('Procesando...');
    $('#t-initCallZoom').attr('disabled', true);
    $('#t-initCallZoom').addClass('d-none');
    $('#zoomLive').attr('src', 'https://telemedico.hospitalmetropolitano.org/blank');
    $('.misPacientes').addClass('d-none');
    $('.nav-live').removeClass('d-none');
    $('.tab-live').removeClass('d-none');
    $('.citaClose').addClass('d-none');
    //  $('.reconnectLive').removeClass('d-none');
    $('.livePte').removeClass('d-none').click();
    $('#livePte').addClass('show active');
    // Status en una videollamada
    localStorage.setItem('sts', 5);
    localStorage.setItem('online', 0);
    // links teleconsultas
    localStorage.setItem('id_call', 123456789);
    $('.accordion').accordion({
        heightStyle: 'content'
    });
    var px_h = ($('.chat-content-body').height() - ($('.chat-content-footer').height() + ($('.nav').height() * 3.2))) + 'px';
    $('.d-panelHC').css('height', px_h);
    setInterval(function() {
        statusParticipantes_v2();
    }, 1000);
    /*
    $('.reconnectLive').click(function(e) {
        e.preventDefault();
        document.getElementById('zoomLive').contentWindow.location.reload(true);
    });
    */
    $('header').addClass('control');
    $('.control').on('click', function(e) {
        e.preventDefault();
        console.log('APP Online');
    });
    $('.control > a').on('click', function(e) {
        e.preventDefault();
        console.log('APP Online');
    });
};

function initCallZoom() {
    var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
    retrievedObject_Tabs.live.load = true;
    retrievedObject_Tabs.live.view = true;
    localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
    _ini_new_cita();
    setUltimoMotivo();
}

function setUltimoMotivo() {
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    formData.append('numeroAdmision', localStorage.numAdm);
    fetch('https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/citas/motivo-cita', {
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
        console.log(json);
        if (json.data) {
            localStorage.setItem('ultimoMotivo', json.data.motivoCita);
            setInsertHistoriaClinica();
        } else {
            localStorage.setItem('ultimoMotivo', '');
            setInsertHistoriaClinica();
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function MaysPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function _del_call_zoom() {
    $(document).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        alert('Cerrando la presente Teleconsulta. No salga de este sitio.');
        console.log('Ternimando Teleconsulta. No salga de este sitio.');
    });
    var formData = new FormData();
    formData.append('id_call', localStorage.id_call);
    fetch(apiZoomEliminar, {
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
            createHC();
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function _del_call_zoom_v2() {
    createHC();
};

function _send_factura_zoom() {
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    formData.append('numeroAdmision', localStorage.numAdm);
    formData.append('codigoHorario', localStorage.idh);
    formData.append('numeroTurno', localStorage.idt);
    fetch(epFacturarAtencion, {
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
            window.location.reload();
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function statusParticipantes() {
    if (localStorage.online === '0') {
        var formData = new FormData();
        formData.append('id_call', localStorage.id_call);
        fetch(apiStatusPartcipantes, {
            method: "POST",
            body: formData,
            contentType: false,
            processData: false,
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log('json = ', json);
            if (json.status) {
                if (json.totalRecords === 2) {
                    localStorage.setItem('online', '1');
                    localStorage.setItem('timeOnline', moment(moment().format("DD-MM-YYYY HH:mm"), 'DD-MM-YYYY HH:mm').unix());
                    // Contador hacia atras de cita
                    countDownCita();
                    $('#s-statusConnectPte').hide();
                    $('#statusConnectPte').removeClass('d-none').html(template($('#v-time-cita').html(), {}));
                    $('.closeLive').click(function(e) {
                        e.preventDefault();
                        var r = confirm("¿Esta Ud. seguro de cerrar la presente Teleconsulta?.");
                        if (r == true) {
                            _del_call_zoom();
                        } else {
                            return false;
                        }
                    });
                    /*
                    $(document).on('click', function(evt) {
                        if (localStorage.online !== undefined && localStorage.online == '1') {
                            evt.preventDefault();
                            if (confirm("¿Esta Ud. seguro de cerrar la presente Teleconsulta?.")) {
                                _del_call_zoom();
                            }
                        }
                    });
                    */
                }
            } else {
                alert(json.message);
            }
        }).catch(function(err) {
            console.error(err);
        });
    } else {
        console.log('Call Online');
    }
};

function statusParticipantes_v2() {
    if (localStorage.online === '0') {
        localStorage.setItem('online', '1');
        localStorage.setItem('timeOnline', moment(moment().format("DD-MM-YYYY HH:mm"), 'DD-MM-YYYY HH:mm').unix());
        // Contador hacia atras de cita
        countDownCita();
        $('#s-statusConnectPte').hide();
        $('#statusConnectPte').removeClass('d-none').html(template($('#v-time-cita').html(), {}));
        $('.closeLive').click(function(e) {
            e.preventDefault();
            var r = confirm("¿Esta Ud. seguro de cerrar la presente Teleconsulta?.");
            if (r == true) {
                _del_call_zoom();
            } else {
                return false;
            }
        });
    } else {
        console.log('Call Online');
    }
};

function countDownCita() {
    console.log(localStorage.timestampFinCita);
    console.log(parseInt(localStorage.timestampFinCita, 10));
    var eventTime = parseInt(localStorage.timestampFinCita, 10);
    var currentTime = parseInt(localStorage.timeOnline, 10);
    var diffTime = eventTime - currentTime;
    var duration = moment.duration(diffTime * 1000, 'milliseconds');
    var interval = 1000;
    var alarm = '<i class="icon ion-md-alarm"></i> ';
    $('#opcClose').removeClass('d-none');
    $('.countdown').removeClass('d-none');
    setInterval(function() {
        duration = moment.duration(duration - interval, 'milliseconds');
        console.log(duration.minutes());
        if (duration.hours() <= 0 && duration.minutes() <= 0 && duration.seconds() <= 0) {
            $('.countdown').html(alarm + '00:00:00');
            throw "Teleconsulta Finalizada";
        } else {
            $('.countdown').html(alarm + ((duration.hours() < 10) ? '0' + duration.hours() : duration.hours()) + ":" + ((duration.minutes() < 10) ? '0' + duration.minutes() : duration.minutes()) + ":" + ((duration.seconds() < 10) ? '0' + duration.seconds() : duration.seconds()));
        }
    }, interval);
}

function searchContacts() {
    setTimeout(function() {
        $("#searchCitas").keyup(function() {
            var search = $(this).val();
            if (search != "") {
                $('#allPtesHoy').parent().removeClass('active show');
                $('#allPtesRecientes').parent().removeClass('active show');
                $('#allSearchPtes').parent().addClass('active show');
                var formData = new FormData();
                formData.append('codigoMedico', _codMedico_);
                formData.append('nombresPaciente', search);
                formData.append('tipoHorario', '2');
                formData.append('start', 0);
                formData.append('length', 10);
                $('#allSearchPtes').html(template($('#v-loader').html(), {}));
                fetch(epCitasNombres, {
                    method: "POST",
                    body: formData,
                    contentType: false,
                    processData: false,
                }).then(function(response) {
                    return response.json();
                }).then(function(data) {
                    console.log('data = ', data);
                    $('#allSearchPtes').html('');
                    $('#allSearchPtes').append(template($('#l-citasHoy').html(), {}));
                    // Llamada creada
                    if (data.status) {
                        $.each(data.data.reverse(), function(index, value) {
                            // Set valores null
                            $.each(value, function(_i_, _val_) {
                                if (_val_ === null) {
                                    value[_i_] = '';
                                }
                            });
                            var fecha = moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
                            var timestamp = moment(fecha + 'T' + value.horaInicio + ':00').unix();
                            var timestampFin = moment(fecha + 'T' + value.horaFin + ':00').unix();
                            $('#allSearchPtes').append(template($('#v-cita').html(), {
                                id: value.codigoPersonaPaciente,
                                inicial: value.primerNombrePaciente.charAt(0),
                                pte: value.primerNombrePaciente + ' ' + value.segundoNombrePaciente + ' ' + value.primerApellidoPaciente + ' ' + value.segundoApellidoPaciente,
                                hora: value.horaInicio,
                                horaFin: value.horaFin,
                                fecha: value.fecha,
                                nhc: value.numeroHistoriaClinica,
                                idh: value.codigoHorario,
                                idt: value.numeroTurno,
                                asistio: value.asistio,
                                timestamp: timestamp,
                                numAdm: value.numeroAdmision,
                                timestampFin: timestampFin,
                            }));
                            console.log(value.fecha + ' ' + value.horaInicio + ':00');
                            console.log(timestamp);
                            if (value.asistio == 'S') {
                                $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-online').attr('title', 'Cita Asistida.');
                            } else {
                                $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-offline').attr('title', 'Cita Pendiente o No Asistida.');
                            }
                        });
                        initDashforgeContacts();
                        setActiveCita();
                    } else {
                        $('#allPtesHoy').html(template($('#v-not-results-sidebar').html(), {}));
                    }
                }).catch(function(err) {
                    console.error(err);
                });
            }
        });
    }, 900);
}

function setPanelDiagnosticos() {
    var maxField = 100; //Input fields increment limitation
    var addButton = $('.add_button_diag'); //Add button selector
    var wrapper = $('.field_wrapper_diag'); //Input field wrapper
    var fieldHTML = '<div><input type="text" name="field_name_diag[]" value=""/><a href="javascript:void(0);" class="link"><i class="icon ion-md-remove-circle"></i></a></div>'; //New input field html 
    var x = 1; //Initial field counter is 1
    //Once add button is clicked
    $(addButton).click(function() {
        //Check maximum number of input fields
        if (x < maxField) {
            x++; //Increment field counter
            $(wrapper).append(fieldHTML); //Add field html
        }
    });
    //Once remove button is clicked
    $(wrapper).on('click', '.remove_button', function(e) {
        e.preventDefault();
        $(this).parent('div').remove(); //Remove field html
        x--; //Decrement field counter
    });
}

function createHC() {
    var fechaHC = moment().format("DD-MM-YYYY HH:mm");
    var _motivoConsulta_ = {
        motivoConsulta: localStorage.hcmotivoConsulta,
        antecedentesPersonales: localStorage.hcantecedentes,
        enfermedadActual: '',
    };
    // var codigoDiag = localStorage.codigoGrupoDiagnostico.spli(',');
    var _diagnosticos1_ = {
        numeroDiagnostico: '1',
        codigo: 'V30',
        grupo: 'V30-V39',
        descripcion: localStorage.hcdiagnosticos,
        tipo: 'PRESUNTIVO',
        clasificacionDiagnostico: 'INGRESO',
        principal: 'SI'
    };
    var _diagnosticos2_ = {
        numeroDiagnostico: '2',
        codigo: 'V31',
        grupo: 'V30-V39',
        descripcion: localStorage.hcdiagnosticos,
        tipo: 'DEFINITIVO',
        clasificacionDiagnostico: 'EGRESO',
        principal: 'SI'
    };
    var _evoluciones_ = {
        codigo: '1',
        descripcion: localStorage.hcevoluciones
    };
    var _prees_ = {
        codigo: '1',
        descripcion: localStorage.hcpreescripciones
    };
    var _jsonBody_ = {
        numeroHistoriaClinica: localStorage.hcpte,
        numeroAdmision: localStorage.numAdm,
        usuarioCrea: 'GEMA',
        usuarioModifica: '',
        primerApellidoPaciente: localStorage.primerApePte,
        segundoApellidoPaciente: localStorage.segundoApePte,
        primerNombrePaciente: localStorage.primerNombPte,
        segundoNombrePaciente: localStorage.segundoNombPte,
        motivoConsulta: _motivoConsulta_,
        revisionOrganos: {},
        antecedentesFamiliares: {},
        signosVitales: [],
        examenFisico: {},
        diagnosticos: [_diagnosticos1_, _diagnosticos2_],
        evoluciones: _evoluciones_,
        prescripciones: [_prees_]
    };
    // request
    fetch(epCrearHC, {
        headers: {
            'Authorization': localStorage.accessToken,
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(_jsonBody_)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        if (data.status) {
            _send_factura_zoom();
        } else {
            if (data.errorCode === 0) {
                _send_factura_zoom();
            }
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function resizeIframe(obj) {
    obj.style.height = ($('.chat-content-body').height() - ($('.chat-content-footer').height() + ($('.badge').height() * 2))) + 'px';
}

function stsAppOnLine() {}