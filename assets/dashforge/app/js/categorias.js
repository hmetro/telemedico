$(function() {
    table()
    // Select2
});

function table() {
    $('#categorias').hide();
    $('#v-loader').show();
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#categorias').DataTable({
        "ajax": {
            url: "api/pacientes/categorias",
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
            title: "Categoria:"
        }, {
            title: "Fecha de creación:"
        }, {
            title: "Usuario:"
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
                return full.categoria;
            },
            visible: true,
            aTargets: [1]
        }, {
            mRender: function(data, type, full) {
                return '24-07-2020';
            },
            visible: true,
            aTargets: [2]
        }, {
            mRender: function(data, type, full) {
                return 'userMedico';
            },
            visible: true,
            aTargets: [3]
        }, {
            mRender: function(data, type, full) {
                return template($('#btn-table-opc').html(), {
                    idCategoria: full.id
                });
            },
            visible: true,
            aTargets: [4]
        }],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            /*$(nRow).closest("tr").find("td:eq(1)").html(template($('#check-opc').html(), {
                id: aData.ID_RESULTADO
            }));*/
        },
        "drawCallback": function(settings) {},
        "order": [
            [0, 'Desc']
        ],
    }).on('xhr.dt', function(e, settings, json, xhr) {
        // Do some staff here...
        $('#v-loader').hide();
        $('#categorias').show();
    });
    return table;
}

function template(templateid, data) {
    return templateid.replace(/%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
        function(m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        });
}