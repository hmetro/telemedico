function _tableResultadosImg() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#table-resultados-img').DataTable({
        "ajax": {
            url: "api/imagen/resultados/65304201",
            dataSrc: "customData",
            serverSide: true,
        },
        processing: true,
        serverSide: true,
        responsive: false,
        dom: 'tp',
        language: {
            searchPlaceholder: 'Buscar...',
            sSearch: '',
            lengthMenu: 'Mostrar _MENU_ registros por página',
            sProcessing: "Procesando...",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        cache: false,
        columns: [{
            title: "N°:"
        }, {
            title: "Fecha:"
        }, {
            title: "Id Transaccion:"
        }, {
            title: "Paciente:"
        }, {
            title: "Origen:"
        }, {
            title: "Opciones:"
        }, ],
        aoColumnDefs: [{
            mRender: function(data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            },
            visible: true,
            aTargets: [0]
        }, {
            mRender: function(data, type, full) {
                return full.FECHA;
            },
            visible: true,
            aTargets: [1]
        }, {
            mRender: function(data, type, full) {
                return full.SC;
            },
            visible: true,
            aTargets: [2]
        }, {
            mRender: function(data, type, full) {
                return full.COD_PERSONA;
            },
            visible: true,
            aTargets: [3]
        }, {
            mRender: function(data, type, full) {
                return full.ORIGEN;
            },
            visible: true,
            aTargets: [4]
        }, {
            mRender: function(data, type, full) {
                return template($('#btn-table-opc-img').html(), {
                    id: full.ID_RESULTADO,
                    fecha: full.FECHA,
                });
            },
            visible: true,
            aTargets: [5]
        }, ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            /*$(nRow).closest("tr").find("td:eq(1)").html(template($('#check-opc').html(), {
                id: aData.ID_RESULTADO
            }));*/
        },
        "drawCallback": function(settings) {
            $('.ver-resultado-img').click(function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                var _td = $(this);
                _td.attr('disabled', 'disabled');
                _td.html('Procesando...').addClass('pos-absolute');
                var currentRow = $(this).closest("tr");
                var id_resultado = $(this).attr('id');
                var fecha = $(this).attr('data-fecha');
                var paciente = currentRow.find("td:eq(3)").text();
                var origen = currentRow.find("td:eq(4)").text();
                var convenio = '';
                var linkZfp = zfpImgLink + zfpToken;
                var Object_td = {
                    'id_resultado': id_resultado,
                    'fecha': fecha,
                    'origen': origen,
                    'paciente': paciente,
                    'convenio': convenio,
                    'linkZfp': linkZfp,
                    'pdf': ''
                };
                // Put the object into storage
                localStorage.setItem('Object_td', JSON.stringify(Object_td));
                getDocumentoImg(id_resultado);
            });
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity
            });
        },
        "order": [
            [0, 'Desc']
        ],
    }).on('xhr.dt', function(e, settings, json, xhr) {
        // Do some staff here...
        $('#load-resultados-img').addClass('d-none');
        $('#resultados-img').removeClass('d-none');
    });
    $('.dataTables_length select').select2({
        minimumResultsForSearch: Infinity
    });
    return table;
}

function getDocumentoImg(id_documento) {
    $('#load-resultados-img').removeClass('d-none');
    $('#resultados-img').addClass('d-none');
    var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
    var _td = $('#' + retrievedObject_td.id_resultado);
    _td.removeAttr('disabled', 'disabled');
    _td.html('<i class="icon ion-md-document"></i> Ver').removeClass('pos-absolute');
    // Set cabeceras
    $('.fechaHC').removeClass('d-none');
    $('.origenPaciente').removeClass('d-none');
    $('#origenPaciente').html('<b>ORIGEN:</b> ' + retrievedObject_td.origen);
    $('#fechaHC').html('<b>FECHA:</b> ' + retrievedObject_td.fecha);
    $('.citaClose').addClass('d-none');
    $('#load-resultados-img').addClass('d-none');
    $('#resultados-img').addClass('d-none');
    $('#view-resultado-img').removeClass('d-none');
    $('#zfpImg').attr('src', retrievedObject_td.linkZfp);
    localStorage.setItem('sts', 4);
    $('.reset-render-img').removeClass('d-none');
    $('#imgPte').removeClass('pd-20 pd-xl-25');
    $('.reset-render-img').click(function(e) {
        e.preventDefault();
        localStorage.setItem('sts', 0);
        $('#imgPte').addClass('pd-20 pd-xl-25');
        $('#view-resultado-img').html('').addClass('d-none');
        $('.fechaHC').addClass('d-none');
        $('#zfpImg').attr('src', '#!');
        $('.origenPaciente').addClass('d-none');
        $('.reset-render-img').addClass('d-none');
        $('#resultados-img').removeClass('d-none');
        $('.citaClose').removeClass('d-none');
    });
}

function _loadImagen() {
    $('#zfpImg').attr('src', zfpImgLink + zfpToken);
    $('#load-imgPte').removeClass('d-none');
    $('#zfpImg').parent('div').addClass('d-none');
    setTimeout(function() {
        $('#zfpImg').parent('div').removeClass('d-none');
        $('#load-imgPte').addClass('d-none');
        var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
        retrievedObject_Tabs.imgPte.load = true;
        retrievedObject_Tabs.imgPte.view = true;
        localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
        $('.reset-loader-img').removeClass('d-none');
        $('.reset-loader-img').click(function(e) {
            e.preventDefault();
            localStorage.setItem('sts', 0);
            var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
            retrievedObject_Tabs.imgPte.load = false;
            retrievedObject_Tabs.imgPte.view = false;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            $('.reset-loader-img').addClass('d-none');
            $('.citaClose').removeClass('d-none');
            _loadImagen();
        });
    }, 7000);
}