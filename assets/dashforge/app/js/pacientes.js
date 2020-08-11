$(function() {
    getAgendasMedico();
    loadPanelDatosMedico();
    // Select2
});

function getAgendasMedico() {
    $('#horarios').hide();
    $('#v-loader').show();
    var formData = new FormData();
    formData.append('codigoMedico', '681');
    fetch('https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/agendas-medico/agendas-creadas', {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        if (data.status) {
            tableAgendas(data.data);
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function tableAgendas(_data) {
    $('#horarios').show();
    $('#v-loader').hide();
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#horarios').DataTable({
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
            title: "Tipo Horario:"
        }, {
            title: "Desde:"
        }, {
            title: "Hasta:"
        }, {
            title: "Dias:"
        }, {
            title: "Duración:"
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
                return full.descripcionTipoHorario;
            },
            visible: true,
            aTargets: [1]
        }, {
            mRender: function(data, type, full) {
                return full.desde.split(' ')[0];
            },
            visible: true,
            aTargets: [2]
        }, {
            mRender: function(data, type, full) {
                return full.hasta.split(' ')[0];
            },
            visible: true,
            aTargets: [3]
        }, {
            mRender: function(data, type, full) {
                var dias = '';
                if (full.lunes == '1') {
                    dias += ',LUN';
                }
                if (full.martes == '1') {
                    dias += ',MAR';
                }
                if (full.miercoles == '1') {
                    dias += ',MIE';
                }
                if (full.jueves == '1') {
                    dias += ',JUE';
                }
                if (full.viernes == '1') {
                    dias += ',VIE';
                }
                if (full.sabado == '1') {
                    dias += ',SAB';
                }
                if (full.domingo == '1') {
                    dias += ',DOM';
                }
                return dias.substring(1);
            },
            visible: true,
            aTargets: [4]
        }, {
            mRender: function(data, type, full) {
                return full.duracionMinutos + ' Min';
            },
            visible: true,
            aTargets: [5]
        }, {
            mRender: function(data, type, full) {
                return template($('#btn-table-opc').html(), {
                    idHorario: full.tipoHorario
                });
            },
            visible: true,
            aTargets: [6]
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