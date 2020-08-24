function loadCitas() {
    $('.citasHoy').removeClass('d-none');
    $('.citasHoy').html(template($('#v-loader').html(), {}));
    var formData = new FormData();
    formData.append('codigoMedico', _codMedico_);
    formData.append('tipoHorario', '2');
    formData.append('endDate', _diaPosterior_);
    formData.append('start', 0);
    formData.append('length', 100);
    fetch(epCitasAgendaPendientes, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        if (json.status) {
            $('.citasHoy').html(template($('#v-citasHoy').html(), {}));
            $.each(json.data.reverse(), function(index, value) {
                // Set valores null
                $.each(value, function(_i_, _val_) {
                    if (_val_ === null) {
                        value[_i_] = '';
                    }
                });
                // value.horaInicio = moment().format("HH:mm");
                var fecha = moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
                var timestamp = moment(fecha + 'T' + value.horaInicio + ':00').unix();
                var timestampFin = moment(fecha + 'T' + value.horaFin + ':00').unix();
                var timestampFinTemp = moment.unix(timestamp).add(1, 'minutes').unix();
                $('.l-citasHoy').append(template($('#v-cita').html(), {
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
                if (value.asistio == 'S') {
                    $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-online').attr('title', 'Cita Asistida.');
                } else {
                    $('#asistio-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-offline').attr('title', 'Cita Pendiente o No Asistida.');
                }
            });
            $('.citasHoy .media').on('click', function(e) {
                e.preventDefault();
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                $('.misPacientes').removeClass('active');
                var dataCita = $(this).data();
                // Set variables de cita paiente
                localStorage.setItem('codPte', dataCita.codpte);
                localStorage.setItem('sts', 1); // Estado ver ficha de pte
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
                var directUser = $(this).find('h6').text();
                $('#nombPte').text(directUser);
                $('#nhcPte').html('NHC: ' + dataCita.hcpte);
                var avatar = $(this).find('.avatar');
                $('#pte .avatar').replaceWith(avatar.clone());
                // view direct title
                $('#pte').removeClass('d-none');
                $('.chat-sidebar').addClass('d-none');
                $('.chat-content').css('left', '60px');
                $('.chat-content-body').css('bottom', '0px');
                $('.chat-content-header').addClass('custom-chat-header-active');
                // view direct nav icon
                $('#datosPte').click();
                $('.datosPte').click();
                $('#panelPte').removeClass('d-none');
                $('#citaNav').removeClass('d-none');
                $('.citaClose').removeClass('d-none');
                $('.fechaHC').addClass('d-none');
                $('.admPaciente').addClass('d-none');
                $('.reset-render-hc').addClass('d-none');
                $('body').removeClass('show-sidebar-right');
                $('#showMemberList').removeClass('active');
                if (window.matchMedia('(max-width: 991px)').matches) {
                    showChatContent();
                }
                // Vistas
                _loadPTE();
            });
            $('.citaClose').on('click', function(e) {
                e.preventDefault();
                setEventCitaClose();
            });
            $('.setTabs').on('click', function(e) {
                e.preventDefault();
                setAtenciones(this.href);
            });
            initDashforge();
        } else {
            $('.citasHoy').html(template($('#v-not-results').html(), {
                message: 'Ud. todavía no tiene citas agendadas.'
            }));
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function setAtenciones(_href) {
    console.log(_href);
    $('.fechaHC').addClass('d-none');
    $('.admPaciente').addClass('d-none');
    $('.reset-render-hc').addClass('d-none');
    $('.citaClose').removeClass('d-none');
    $('#view-file-hc').addClass('d-none');
    if (localStorage.sts == '2' && _href == 'https:' + urlhome + '#hcPte') {
        $('.fechaHC').removeClass('d-none');
        $('.admPaciente').removeClass('d-none');
        $('.reset-render-hc').removeClass('d-none');
        $('.citaClose').addClass('d-none');
        $('#listas-hc').addClass('d-none');
        $('#view-file-hc').removeClass('d-none');
    } else if (localStorage.sts == '2' && _href !== 'https:' + urlhome + '#hcPte') {
        $('.fechaHC').addClass('d-none');
        $('.admPaciente').addClass('d-none');
        $('.reset-render-hc').addClass('d-none');
        $('.citaClose').removeClass('d-none');
    } else {
        _loadHistoriasClinicas();
    }
}

function setEventCitaClose() {
    $('.chat-content-header').removeClass('custom-chat-header-active');
    $('.chat-content-header').addClass('custom-chat-header');
    $('#pte').addClass('d-none');
    $('#panelPte').addClass('d-none');
    $('#citaNav').addClass('d-none');
    $('.misPacientes').addClass('active');
    $('.chat-sidebar').removeClass('d-none');
    $('.chat-content').removeAttr('style');
}

function getMisPacientes() {
    $('.misPacientes').on('click', function(e) {
        e.preventDefault();
        $('#pte').addClass('d-none');
        $('#panelPte').addClass('d-none');
        $('#citaNav').addClass('d-none');
        $('.misPacientes').addClass('active');
        $('.chat-sidebar').removeClass('d-none');
        $('.chat-content').removeAttr('style');
    });
}