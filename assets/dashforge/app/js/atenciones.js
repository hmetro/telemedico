function _loadHistoriasClinicas() {
    $('#listas-hc').html('');
    $('#load-hcPte').removeClass('d-none');
    $('.chat-content-body').scrollTop(0);
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    fetch(epHistoriasClinicasAnteriores, {
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
        $('#load-hcPte').addClass('d-none');
        if (data.status) {
            $.each(data.data, function(index, value) {
                if (value.registraHistoriaClinica == 'S') {
                    $('#listas-hc').append(template($('#v-h-tel-clinicas').html(), value));
                } else {
                    $('#listas-hc').append(template($('#v-h-clinicas').html(), value));
                }
            });
            $('#listas-hc').removeClass('d-none');
            $('.detalle-hc').click(function(e) {
                e.preventDefault();
                var adm = $(this).attr('data-adm');
                var fechaHC = $(this).attr('data-fechahc');
                localStorage.setItem('admHC', adm);
                localStorage.setItem('fechaHC', fechaHC);
                // Set estado ver un hc especifico
                localStorage.setItem('sts', 2);
                initViewHC();
            });
        } else {
            $('#listas-hc').html(template($('#v-not-results').html(), {}));
            $('#listas-hc').removeClass('d-none');
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function initViewHC() {
    $('#listas-hc').addClass('d-none');
    $('#load-view-hc').removeClass('d-none');
    $('#view-file-hc').html('');
    _loadHC();
}

function _loadHC() {
    $('.chat-content-body').scrollTop(0);
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    formData.append('numeroAdmision', localStorage.adm);
    fetch(epHistoriasClinicasConsultar, {
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
        console.log('data = ', json);
        if (json.status) {
            var primerNombPte, segundoNombPte, primerApePte, segundoApePte;
            primerNombPte = ((json.data.primerNombrePaciente !== null) ? json.data.primerNombrePaciente : '');
            segundoNombPte = ((json.data.segundoNombrePaciente !== null) ? json.data.segundoNombrePaciente : '');
            primerApePte = ((json.data.primerApellidoPaciente !== null) ? json.data.primerApellidoPaciente : '');
            segundoApePte = ((json.data.segundoApellidoPaciente !== null) ? json.data.segundoApellidoPaciente : '');
            $('#load-view-hc').addClass('d-none');
            $('#view-file-hc').removeClass('d-none');
            $('#view-file-hc').html(template($('#v-hc-detalle').html(), {}));
            $('#fechaHC').html('FECHA: ' + localStorage.fechaHC);
            $('#admPaciente').html('ADM: ' + localStorage.admHC);
            $('.fechaHC').removeClass('d-none');
            $('.admPaciente').removeClass('d-none');
            $('.reset-render-hc').removeClass('d-none');
            $('.citaClose').addClass('d-none');
            setViewHC(json);
            $('.reset-render-hc').click(function(e) {
                e.preventDefault();
                $('.fechaHC').addClass('d-none');
                $('.admPaciente').addClass('d-none');
                $('.reset-render-hc').addClass('d-none');
                $('.citaClose').removeClass('d-none');
                $('#listas-hc').removeClass('d-none');
                $('#view-file-hc').addClass('d-none').html('');
                localStorage.setItem('sts', 1);
            });
        } else {
            $('#load-view-hc').addClass('d-none');
            $('#view-file-hc').removeClass('d-none');
            $('#view-file-hc').html(template($('#v-not-results').html(), {}));
            setTimeout(function() {
                $('#listas-hc').removeClass('d-none');
                $('#view-file-hc').addClass('d-none').html('');
                resetRenderHC();
            }, 1200);
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function resetRenderHC() {
    setTimeout(function() {
        $('#listas-hc').removeClass('d-none');
        $('#load-view-hc').addClass('d-none');
        $('#view-file-hc').addClass('d-none').html('');
    }, 8000);
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