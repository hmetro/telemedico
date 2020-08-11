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
});

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
}
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
                var timestamp = moment(moment(value.fecha + ' ' + value.horaInicio).format('DD-MM-YYYY HH:mm')).unix();
                var timestampFin = moment(moment(value.fecha + ' ' + value.horaFin).format('DD-MM-YYYY HH:mm')).unix();
                $('#allPtesRecientes').append(template($('#v-cita-pasada').html(), {
                    id: value.codigoPersonaPaciente,
                    inicial: value.nombresPaciente.charAt(0),
                    pte: value.nombresPaciente + ' ' + value.apellidosPaciente,
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
                moment.invalid();
                // value.fecha = '04-08-2020';
                if (value.fecha === '10-08-2020') {
                    // value.horaInicio = moment().format("HH:mm");
                    var timestamp = moment(moment(value.fecha + ' ' + value.horaInicio).format('DD-MM-YYYY HH:mm')).unix();
                    var timestampFin = moment(moment(value.fecha + ' ' + value.horaFin).format('DD-MM-YYYY HH:mm')).unix();
                    var timestampFinTemp = moment.unix(timestamp).add(1, 'minutes').unix();
                    $('#allPtesHoy').append(template($('#v-cita').html(), {
                        id: value.codigoPersonaPaciente,
                        inicial: value.nombresPaciente.charAt(0),
                        pte: value.nombresPaciente + ' ' + value.apellidosPaciente,
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
                    var timestamp = moment(moment(value.fecha + ' ' + value.horaInicio).format('DD-MM-YYYY HH:mm')).unix();
                    var timestampFin = moment(moment(value.fecha + ' ' + value.horaFin).format('DD-MM-YYYY HH:mm')).unix();
                    $('#allPtesHoy').append(template($('#v-cita').html(), {
                        id: value.codigoPersonaPaciente,
                        inicial: value.nombresPaciente.charAt(0),
                        pte: value.nombresPaciente + ' ' + value.apellidosPaciente,
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
        // Set datos de paciente
        localStorage.setItem('primerNombPte', data.data[0].primerNombre);
        localStorage.setItem('segundoNombPte', data.data[0].segundoNombre);
        localStorage.setItem('primerApePte', data.data[0].primerApellido);
        localStorage.setItem('segundoApePte', data.data[0].segundoApellido);
        // Set Medios de contacto
        var arrMediosContacto = data.data[0].mediosContacto;
        var textMediosContacto = '';
        $.each(arrMediosContacto, function(key, value) {
            textMediosContacto += value.tipo + ' ' + value.valor + ' - ';
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
                if (value.esTeleconsulta == 'S') {
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
            textRevision += ' Cardiovascular: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'digestivo') {
            textRevision += ' Digestivo: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'endocrino') {
            textRevision += ' Endócrino: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'genital') {
            textRevision += ' Genital: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'hemoLinfatico') {
            textRevision += ' Hemolinfatico: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'muscEsqueletico') {
            textRevision += ' Musc. Esqueletico: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'nervioso') {
            textRevision += ' Nervioso: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'respiratorio') {
            textRevision += ' Respiratorio: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'sentidos') {
            textRevision += ' Sentidos: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
        }
        if (key == 'urinario') {
            textRevision += ' Uriniario: ' + ((value != null) ? value : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
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
            textAntecedentes += ' Cáncer: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'cardiopatia') {
            textAntecedentes += ' Cardiopatía: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'diabetes') {
            textAntecedentes += ' Diabetes: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'enfermedadInfecciosa') {
            textAntecedentes += ' E. Infecciosas: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'enfermedadVascular') {
            textAntecedentes += ' E. Vascular: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'enfermendadMental') {
            textAntecedentes += ' E. Mental: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'hipertension') {
            textAntecedentes += ' Hipertensión: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'malformacion') {
            textAntecedentes += ' Malformación: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'tuberculosis') {
            textAntecedentes += ' Tuberculosis: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code></br>');
        }
        if (key == 'otro') {
            textAntecedentes += ' Otros: ' + ((value != null) ? value + '</br>' : '<code><i class="icon ion-md-close-circle-outline"></i></code>');
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
            primerNombPte = json.data.primerNombrePaciente;
            segundoNombPte = json.data.segundoNombrePaciente;
            primerApePte = json.data.primerApellidoPaciente;
            segundoApePte = json.data.segundoApellidoPaciente;
            $('.contact-content-body').scrollTop(0);
            $('#navPacientes').addClass('d-none');
            $('#load-view-hc').addClass('d-none');
            $('#view-hc').removeClass('d-none');
            $('#view-hc').html(template($('#v-hc-detalle').html(), {}));
            $('#fechaHC').html('<b>FECHA:</b> ' + localStorage.fechaHC);
            $('#nPaciente').html(' <b>PTE:</b> ' + ((primerNombPte !== null) ? primerNombPte : '') + ' ' + ((segundoNombPte !== null) ? segundoNombPte : '') + ' ' + ((primerApePte !== null) ? primerApePte : '') + ' ' + ((segundoApePte !== null) ? segundoApePte : ''));
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
            resetRenderHC();
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
    $('.contact-sidebar').removeClass('d-none');
    $('.contact-content').css('left', '340px');
    $('.contact-content-header').css('right', '290px');
    $('.contact-content-body').css('right', '290px');
    $('.contact-content-sidebar').css('width', '290px');
    $('.contact-content-sidebar').addClass('d-none');
    $('.contact-content-header').removeClass('wd-100p');
    $('.contact-content-body').removeClass('wd-100p');
}

function initCallZoom() {
    $('.contact-sidebar').addClass('d-none');
    $('.contact-content').css('left', '60px');
    $('.contact-content-header').css('right', '600px');
    $('.contact-content-body').css('right', '600px');
    $('.contact-content-sidebar').css('width', '600px');
    $('.contact-content-sidebar').removeClass('d-none');
    $('.contact-content-header').removeClass('wd-100p');
    $('.contact-content-body').removeClass('wd-100p');
    $('#s-nombresPte').html('<i class="icon ion-md-person"></i> ' + localStorage.nombpte);
    $('#s-nhcPte').html('<b>NHC:</b>' + localStorage.hcpte);
    setInsertHistoriaClinica();
    _ini_new_cita();
}
// Updated 28 October 2011: Now allows 0, NaN, false, null and undefined in output. 
function template(templateid, data) {
    return templateid.replace(/%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
        function(m, key) {
            return data.hasOwnProperty(key) ? (data[key] != null) ? data[key] : '' : "";
        });
}

function MaysPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function _ini_new_cita() {
    /*
    $('#t-initCallZoom').hide();
    $('#i-live').attr('src', urlhome + 'blank');
    $('.live-active').removeClass('d-none').click();
    $('.paciente').removeClass('active');
    $('#live').addClass('show active');
    // links teleconsultas
    $('.close-zoom').removeClass('d-none');
    $('.notas').removeClass('d-none');
    window.localStorage.setItem('id_call', '#!');
    $('#t-initCallZoom').parent().remove();
    // Status conexion participantes
    localStorage.setItem('online', '1');
    statusParticipantes();
    */
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
            $('#t-initCallZoom').hide();
            $('#i-live').attr('src', json.url);
            $('.live-active').removeClass('d-none').click();
            $('.paciente').removeClass('active');
            $('#live').addClass('show active');
            // links teleconsultas
            $('.close-zoom').removeClass('d-none');
            $('.notas').removeClass('d-none');
            window.localStorage.setItem('id_call', json.id_call);
            $('#t-initCallZoom').parent().remove();
            // Init panel diagnositicos
            // setPanelDiagnosticos();
            // Status conexion participantes
            localStorage.setItem('online', '0');
            setInterval(function() {
                statusParticipantes();
            }, 1000);
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

function _del_call_zoom() {
    /*
    createHC();
    // _send_factura_zoom();
    /*
    */
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

function _send_factura_zoom() {
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    formData.append('numeroAdmision', localStorage.numAdm);
    formData.append('codigoHorario', localStorage.idh);
    formData.append('numeroTurno', localStorage.idt);
    fetch(epFacturarAtencion, {
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
    /*
    localStorage.setItem('online', '1');
    localStorage.setItem('timeOnline', moment(moment().format("DD-MM-YYYY HH:mm"), 'DD-MM-YYYY HH:mm').unix());
    // Contador hacia atras de cita
    countDownCita();
    $('#s-statusConnectPte').hide();
    $('#statusConnectPte').html(template($('#v-time-cita').html(), {}));
    */
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
                    $('#statusConnectPte').html(template($('#v-time-cita').html(), {}));
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

function countDownCita() {
    console.log(localStorage.timestampFinCita);
    console.log(parseInt(localStorage.timestampFinCita, 10));
    var eventTime = parseInt(localStorage.timestampFinCita, 10);
    var currentTime = parseInt(localStorage.timeOnline, 10);
    var diffTime = eventTime - currentTime;
    var duration = moment.duration(diffTime * 1000, 'milliseconds');
    var interval = 1000;
    setInterval(function() {
        duration = moment.duration(duration - interval, 'milliseconds');
        console.log(duration.minutes());
        if (duration.hours() <= 0 && duration.minutes() <= 0 && duration.seconds() <= 0) {
            $('#opcClose').removeClass('d-none');
            $('.countdown').text('00:00:00');
            throw "Teleconsulta Finalizada";
        } else {
            $('.countdown').text(((duration.hours() < 10) ? '0' + duration.hours() : duration.hours()) + ":" + ((duration.minutes() < 10) ? '0' + duration.minutes() : duration.minutes()) + ":" + ((duration.seconds() < 10) ? '0' + duration.seconds() : duration.seconds()));
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
                            moment.invalid();
                            var timestamp = moment(moment(value.fecha + ' ' + value.horaInicio).format('DD-MM-YYYY HH:mm')).unix();
                            var timestampFin = moment(moment(value.fecha + ' ' + value.horaFin).format('DD-MM-YYYY HH:mm')).unix();
                            $('#allSearchPtes').append(template($('#v-cita').html(), {
                                id: value.codigoPersonaPaciente,
                                inicial: value.nombresPaciente.charAt(0),
                                pte: value.nombresPaciente + ' ' + value.apellidosPaciente,
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
    var jsonBody_ = '{"numeroHistoriaClinica":"' + localStorage.hcpte + '","numeroAdmision":"' + localStorage.numAdm + '","usuarioCrea":"GEMA","usuarioModifica":null,"primerApellidoPaciente":"' + localStorage.primerApePte + '","segundoApellidoPaciente":"' + localStorage.segundoApePte + '","primerNombrePaciente":"' + localStorage.primerNombPte + '","segundoNombrePaciente":"' + localStorage.segundoNombPte + '","motivoConsulta":{"motivoConsulta":"' + localStorage.hcmotivoConsulta + '","antecedentesPersonales":"' + localStorage.hcantecedentes + '","enfermedadActual":null},"revisionOrganos":{"sentidos":null,"cardioVascular":null,"genital":null,"muscEsqueletico":null,"hemoLinfatico":null,"respiratorio":null,"digestivo":null,"urinario":null,"endocrino":null,"nervioso":null},"antecedentesFamiliares":{"cardiopatia":null,"diabetes":null,"enfermedadVascular":null,"hipertension":null,"cancer":null,"tuberculosis":null,"enfermendadMental":null,"enfermedadInfecciosa":null,"malformacion":null,"otro":null},"signosVitales":[{"fecha":null,"temperaturaBucal":null,"temperaturaAxiliar":null,"temperaturaRectal":null,"taSistolica":null,"taDiastolica":null,"pulso":null,"frecuenciaRespiratoria":null,"perimetroCef":null,"peso":null,"talla":null,"imc":null}],"examenFisico":{"cabeza1R":null,"cuello2R":null,"torax3R":null,"abdomen4R":null,"pelvis5R":null,"extremidades6R":null,"planTratamiento":null},"diagnosticos":[{"numeroDiagnostico":"1","codigo":"V30","grupo":"V30-V39","descripcion":"' + localStorage.hcdiagnosticos + '","tipo":"PRESUNTIVO","clasificacionDiagnostico":"INGRESO","principal":"SI"},{"numeroDiagnostico":"2","codigo":"V31","grupo":"V30-V39","descripcion":"' + localStorage.hcdiagnosticos + '","tipo":"DEFINITIVO","clasificacionDiagnostico":"EGRESO","principal":"SI"}],"evoluciones":{"codigo":"1","descripcion":"' + localStorage.hcevoluciones + '"},"prescripciones":[{"codigo":"1","descripcion":"' + localStorage.hcpreescripciones + '"}]}';
    var jsonBody = '{"numeroHistoriaClinica":"' + localStorage.hcpte + '","numeroAdmision":"' + localStorage.numAdm + '","usuarioCrea":"GEMA","usuarioModifica":null,"primerApellidoPaciente":"CHANG","segundoApellidoPaciente":"CHAVEZ","primerNombrePaciente":"MARTIN","segundoNombrePaciente":"FRANCISCO","motivoConsulta":{"motivoConsulta":"PRUEBA MOTIVO CONSULTA","antecedentesPersonales":"PRUEBA ANTECEDENTES PERSONALES","enfermedadActual":"PRUEBA ENFERMEDAD ACTUAL"},"revisionOrganos":{"sentidos":"PRUEBA 3 SENTIDOS","cardioVascular":"PRUEBA CARDIO VASCULAR","genital":"PRUEBA  GENITAL","muscEsqueletico":"PRUEBA MUSCULO ESQUELETICO","hemoLinfatico":"PRUEBA HEMO LINFATICO","respiratorio":"PRUEBA RESPIRATORIO","digestivo":"PRUEBA DIGESTIVO","urinario":"PRUEBA URINARIO","endocrino":"PRUEBA ENDOCRINO","nervioso":"PRUEBA NERVIOSO"},"antecedentesFamiliares":{"cardiopatia":"PRUEBA ANTECEDENTES CARDIOPATIA","diabetes":"PRUEBA ANTECEDENTES DIABETES","enfermedadVascular":"PRUEBA ANTECEDENTES VASCULAR","hipertension":"PRUEBA ANTECEDENTES HIPERTENSION","cancer":"PRUEBA ANTECEDENTES CANCER","tuberculosis":"PRUEBA ANTECEDENTES TUBERCULOSIS","enfermendadMental":"PRUEBA ANTECEDENTES ENFERMEDAD MENTAL","enfermedadInfecciosa":"PRUEBA ANTECEDENTES ENFERMEDAD INFECCIOSA","malformacion":"PRUEBA ANTECEDENTES MALFORMACION","otro":"PRUEBA ANTECEDENTES OTRO"},"signosVitales":[{"fecha":"15-07-2020 11:04","temperaturaBucal":"37","temperaturaAxiliar":"38","temperaturaRectal":"39","taSistolica":"120","taDiastolica":"80","pulso":"60","frecuenciaRespiratoria":"30","perimetroCef":"80","peso":"72","talla":"172","imc":"24,34"}],"examenFisico":{"cabeza1R":"PRUEBA EXAMEN CABEZA","cuello2R":"PRUEBA EXAMEN CUELLO","torax3R":"PRUEBA EXAMEN TORAX","abdomen4R":"PRUEBA EXAMEN ABDOMEN","pelvis5R":"PRUEBA EXAMEN PELVIS","extremidades6R":"PRUEBA EXAMEN EXTREMIDADES","planTratamiento":"PRUEBA EL PLAN DE TRATAMIENTO"},"diagnosticos":[{"numeroDiagnostico":"1","codigo":"V30","grupo":"V30-V39","descripcion":"PRUEBA DIAG","tipo":"PRESUNTIVO","clasificacionDiagnostico":"INGRESO","principal":"SI"},{"numeroDiagnostico":"2","codigo":"V31","grupo":"V30-V39","descripcion":"PRUEBA DIAG","tipo":"DEFINITIVO","clasificacionDiagnostico":"EGRESO","principal":"SI"}],"evoluciones":{"codigo":"1","descripcion":"PRUEBA DE PRIMERA NOTA DE EVOLUCION"},"prescripciones":[{"codigo":"1","descripcion":"PRUEBA DE PRESCRIPCION"}]}';
    fetch(epCrearHC, {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(JSON.parse(jsonBody))
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        if (data.status) {
            _send_factura_zoom();
        }
    }).catch(function(err) {
        console.error(err);
    });
}