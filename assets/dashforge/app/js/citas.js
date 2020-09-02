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
                // Solo las de la fecha vigente
                if (moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                    var fecha = moment(value.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    var timestamp = moment(fecha + 'T' + value.horaInicio + ':00').unix();
                    var timestampFin = moment(fecha + 'T' + value.horaFin + ':00').unix();
                    var timestampFinTemp = moment.unix(timestamp).add(10, 'minutes').unix();
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
                        _id_: 'cita-' + value.codigoHorario + '-' + value.numeroTurno,
                    }));
                    if (value.asistio == 'S') {
                        $('#cita-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-online').attr('title', 'Cita Asistida.');
                    } else {
                        $('#cita-' + value.codigoHorario + '-' + value.numeroTurno).addClass(' avatar-offline').attr('title', 'Cita Pendiente o No Asistida.');
                    }
                }
            });
            $('.citasHoy .media').on('click', function(e) {
                e.preventDefault();
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                var dataCita = $(this).data();
                setActiveCita(dataCita);
                // Set variables de cita paiente
                $('#news-paper').hide();
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
                setTabs($(this).attr('data-tab'));
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

function setActiveCita(dataCita) {
    localStorage.setItem('sts', 1); // Estado ver ficha de pte
    localStorage.setItem('codPte', dataCita.codpte);
    localStorage.setItem('idpte', dataCita.codpte);
    localStorage.setItem('hcpte', dataCita.hcpte);
    localStorage.setItem('nombpte', dataCita.nombpte);
    localStorage.setItem('idh', dataCita.idh);
    localStorage.setItem('idt', dataCita.idt);
    localStorage.setItem('timestampCita', dataCita.timestamp);
    localStorage.setItem('timestampFinCita', dataCita.timestampfin);
    localStorage.setItem('numAdm', dataCita.numadm);
    // Set text data
    $('#nombPte').text(dataCita.nombpte);
    $('#inombPte').text(dataCita.nombpte.charAt(0));
    $('#nhcPte').html('NHC: ' + dataCita.hcpte);
    // Set clases css
    $('.chat-sidebar').addClass('d-none');
    $('.chat-content').css('left', '60px');
    $('.chat-content-body').css('bottom', '0px');
    $('.chat-content-header').addClass('custom-chat-header-active');
    $('.misPacientes').removeClass('active');
    $('.datosPte').click();
    $('#datosPte').click();
    $('#pte').removeClass('d-none');
    $('#panelPte').removeClass('d-none');
    $('#citaNav').removeClass('d-none');
    $('.citaClose').removeClass('d-none');
    var Object_Tabs = {
        datosPte: {
            load: false,
            view: false,
        },
        atenPte: {
            load: false,
            view: false,
        },
        labPte: {
            load: false,
            view: false,
        },
        imgPte: {
            load: false,
            view: false,
        },
        live: {
            load: false,
            view: false,
        }
    };
    // Put the object into storage
    localStorage.setItem('Object_Tabs', JSON.stringify(Object_Tabs));
}

function setTabs(tab) {
    $('.reset-render-lab').addClass('d-none');
    $('.reset-render-hc').addClass('d-none');
    $('.reset-loader-img').addClass('d-none');
    var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
    if (tab === 'datosPte') {
        if (!retrievedObject_Tabs.datosPte.load) {
            _loadPTE();
        }
    }
    if (tab === 'atenPte') {
        if (!retrievedObject_Tabs.atenPte.load) {
            _loadHistoriasClinicas();
        }
        if (retrievedObject_Tabs.atenPte.view) {
            $('.reset-render-lab').addClass('d-none');
            $('.reset-render-hc').removeClass('d-none');
            $('.reset-loader-img').addClass('d-none');
        }
    }
    if (tab === 'labPte') {
        if (!retrievedObject_Tabs.labPte.load) {
            _tableResultadosLab();
        }
        if (retrievedObject_Tabs.labPte.view) {
            $('.reset-render-lab').removeClass('d-none');
            $('.reset-render-hc').addClass('d-none');
            $('.reset-loader-img').addClass('d-none');
        }
        if (!retrievedObject_Tabs.labPte.load && retrievedObject_Tabs.labPte.view) {
            $('#table-labPte').addClass('d-none');
        }
    }
    if (tab === 'imgPte') {
        if (!retrievedObject_Tabs.imgPte.load) {
            _loadImagen();
        }
        if (retrievedObject_Tabs.imgPte.view) {
            $('.reset-render-lab').addClass('d-none');
            $('.reset-render-hc').addClass('d-none');
            $('.reset-loader-img').removeClass('d-none');
        }
    }
}

function setEventCitaClose() {
    $('#news-paper').show();
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