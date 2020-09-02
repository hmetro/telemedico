$(function() {
    getPagosMedico();
    loadPerfilMedico();
    // Select2
});

function getPagosMedico() {
    $('#pagos').hide();
    $('#v-loader').show();
    var formData = new FormData();
    formData.append('codigoMedico', _codMedico_);
    formData.append('numeroMes', _mes_);
    fetch(epFacturacion, {
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
        if (data.status) {
            tablePagos(data.data);
        } else {
            tablePagos({});
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function tablePagos(_data) {
    $('#pagos').show();
    $('#v-loader').hide();
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#pagos').DataTable({
        "data": _data,
        dom: 't',
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
            title: "Fecha Horario:"
        }, {
            title: "Cod. Horario:"
        }, {
            title: "NHC:"
        }, {
            title: "N° Admisión:"
        }, {
            title: "Paciente:"
        }, {
            title: "N° de Prefactura:"
        }, {
            title: "Total Factura:"
        }, {
            title: "N° Factura:"
        }, {
            title: "Fecha Factura:"
        }, ],
        aoColumnDefs: [{
            mRender: function(data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            },
            visible: true,
            aTargets: [0]
        }, {
            mRender: function(data, type, full) {
                return full.fechaHorario.split(' ')[0];
            },
            visible: true,
            aTargets: [1]
        }, {
            mRender: function(data, type, full) {
                return full.numeroTurno;
            },
            visible: true,
            aTargets: [2]
        }, {
            mRender: function(data, type, full) {
                return full.codigoPaciente;
            },
            visible: true,
            aTargets: [3]
        }, {
            mRender: function(data, type, full) {
                return full.numeroAdmision;
            },
            visible: true,
            aTargets: [4]
        }, {
            mRender: function(data, type, full) {
                return full.nombresPaciente;
            },
            visible: true,
            aTargets: [5]
        }, {
            mRender: function(data, type, full) {
                return full.numeroPreFactura;
            },
            visible: true,
            aTargets: [6]
        }, {
            mRender: function(data, type, full) {
                return full.totalFactura;
            },
            visible: true,
            aTargets: [7]
        }, {
            mRender: function(data, type, full) {
                return full.numeroFactura;
            },
            visible: true,
            aTargets: [8]
        }, {
            mRender: function(data, type, full) {
                return full.fechaFactura;
            },
            visible: true,
            aTargets: [9]
        }, ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            /*$(nRow).closest("tr").find("td:eq(1)").html(template($('#check-opc').html(), {
                id: aData.ID_RESULTADO
            }));*/
        },
        "drawCallback": function(settings) {},
    });
    return table;
}

function template(templateid, data) {
    return templateid.replace(/%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
        function(m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        });
}