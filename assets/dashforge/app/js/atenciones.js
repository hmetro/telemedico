function _loadHistoriasClinicas() {
    $('.chat-content-body').scrollTop(0);
    $('#hcPte').html(template($('#v-loader').html(), {}));
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
        $('#hcPte').html(template($('#v-l-atenciones').html(), {}));
        if (data.status) {
            var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
            retrievedObject_Tabs.atenPte.load = true;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            $.each(data.data, function(index, value) {
                if (value.registraHistoriaClinica == 'S') {
                    if (value.codigoMedicoTratante == _codMedico_) {
                        $('#l-atenciones').append(template($('#v-h-tel-clinicas').html(), value));
                    } else {
                        value.message = 'Historia Clínica no disponible.';
                        $('#l-atenciones').append(template($('#v-h-clinicas').html(), value));
                    }
                } else {
                    value.message = 'Atención no registra Historia Clínica.';
                    $('#l-atenciones').append(template($('#v-h-clinicas').html(), value));
                }
            });
            $('.detalle-hc').click(function(e) {
                e.preventDefault();
                var dataCita, fechaHC, adm;
                dataCita = $(this).data();
                adm = dataCita.numadm;
                fechaHC = dataCita.fechahc;
                localStorage.setItem('admHC', adm);
                localStorage.setItem('fechaHC', fechaHC);
                // Set estado ver un hc especifico
                localStorage.setItem('sts', 2);
                initViewHC();
            });
            $('[data-toggle="tooltip"]').tooltip();
        } else {
            $('#hcPte').html(template($('#v-not-results').html(), {}));
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function initViewHC() {
    $('.chat-content-body').scrollTop(0);
    $('#hcPte').html(template($('#v-loader').html(), {}));
    $('#hcPte').addClass('wd-100p');
    _loadHC();
}

function _loadHC() {
    var formData = new FormData();
    formData.append('numeroHistoriaClinica', localStorage.hcpte);
    formData.append('numeroAdmision', localStorage.admHC);
    fetch(apiReporte002, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        if (json.status) {
            var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
            retrievedObject_Tabs.atenPte.view = true;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            $('#hcPte').html(template($('#v-hc-detalle').html(), {}));
            $('.reset-render-hc').removeClass('d-none');
            loadPdf(json.url);
            $('.reset-render-hc').click(function(e) {
                retrievedObject_Tabs.atenPte.view = false;
                localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
                e.preventDefault();
                resetRenderHC();
            });
        } else {
            retrievedObject_Tabs.atenPte.view = true;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            $('#hcPte').html(template($('#v-not-results').html(), {
                message: json.message
            }));
            $('.reset-render-hc').removeClass('d-none');
            $('.reset-render-hc').click(function(e) {
                retrievedObject_Tabs.atenPte.view = false;
                localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
                e.preventDefault();
                resetRenderHC();
            });
        }
    }).catch(function(err) {
        console.error(err);
    });
};

function resetRenderHC() {
    $('#datosPte').removeClass('d-none');
    $('.reset-render-hc').addClass('d-none');
    localStorage.setItem('sts', 1);
    _loadHistoriasClinicas();
}