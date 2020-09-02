function _tableResultadosLab() {
    $('#load-labPte').removeClass('d-none');
    $('#table-labPte').addClass('d-none');
    fetch("api/laboratorio/resultados/" + localStorage.hcpte, {
        method: "GET",
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        if (data.status) {
            $('#load-labPte').addClass('d-none');
            $('#table-labPte').removeClass('d-none');
            var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
            retrievedObject_Tabs.labPte.load = true;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            tableLab(data.data);
        } else {
            $('#load-labPte').addClass('d-none');
            $('#table-labPte').removeClass('d-none');
            tableLab({});
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function tableLab(_data) {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#table-resultados-lab').DataTable({
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
                return template($('#btn-table-opc-lab').html(), {
                    id: full.ID_RESULTADO,
                    fecha: full.FECHA_RES,
                    pdf: full.PDF,
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
            $('.ver-resultado').click(function(e) {
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
                var pdf = urlhome + 'api/documentos/resultados/' + $(this).attr('id') + '.pdf';
                var Object_td = {
                    'id_resultado': id_resultado,
                    'fecha': fecha,
                    'origen': origen,
                    'paciente': paciente,
                    'convenio': convenio,
                    'pdf': pdf
                };
                // Put the object into storage
                localStorage.setItem('Object_td', JSON.stringify(Object_td));
                getDocumentoLab(id_resultado);
            });
        },
        "order": [
            [0, 'Desc']
        ],
    });
    return table;
}

function getDocumentoLab(id_documento) {
    $('#load-labPte').removeClass('d-none');
    $('#table-labPte').addClass('d-none');
    var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
    fetch('api/laboratorio/resultado', {
        method: "GET",
        headers: {
            "X-REQUEST-ID-DOCUMENTO": id_documento,
            "X-REQUEST-FECHA-DOCUMENTO": retrievedObject_td.fecha,
        },
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (data.status) {
            var _td = $('#' + retrievedObject_td.id_resultado);
            _td.removeAttr('disabled', 'disabled');
            _td.html('<i class="icon ion-md-document"></i> Ver').removeClass('pos-absolute');
            // Set cabeceras
            $('#load-labPte').addClass('d-none');
            $('#table-labPte').addClass('d-none');
            $('#view-resultado-lab').removeClass('d-none').html(template($('#v-ver-resultado').html(), {}));
            loadPdf(retrievedObject_td.pdf);
            localStorage.setItem('sts', 3);
            var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
            retrievedObject_Tabs.labPte.view = true;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            $('.reset-loader-img').addClass('d-none');
            $('.reset-render-hc').addClass('d-none');
            $('.reset-render-lab').removeClass('d-none');
            $('.reset-render-lab').click(function(e) {
                e.preventDefault();
                localStorage.setItem('sts', 0);
                var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
                retrievedObject_Tabs.labPte.view = false;
                localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
                $('#view-resultado-lab').html('').addClass('d-none');
                $('#table-labPte').removeClass('d-none');
                $('.reset-render-lab').addClass('d-none');
            });
        } else {
            var _td = $('#' + retrievedObject_td.id_resultado);
            _td.removeAttr('disabled', 'disabled');
            _td.html('<i class="icon ion-md-document"></i> Ver').removeClass('pos-absolute');
            // Set cabeceras
            $('#load-labPte').addClass('d-none');
            $('#table-labPte').addClass('d-none');
            $('#view-resultado-lab').removeClass('d-none').html(template($('#v-not-results').html(), {}));
            localStorage.setItem('sts', 3);
            var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
            retrievedObject_Tabs.labPte.view = true;
            localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
            $('.reset-loader-img').addClass('d-none');
            $('.reset-render-hc').addClass('d-none');
            $('.reset-render-lab').removeClass('d-none');
            $('.reset-render-lab').click(function(e) {
                e.preventDefault();
                localStorage.setItem('sts', 0);
                var retrievedObject_Tabs = JSON.parse(localStorage.getItem('Object_Tabs'));
                retrievedObject_Tabs.labPte.view = false;
                localStorage.setItem('Object_Tabs', JSON.stringify(retrievedObject_Tabs));
                $('#view-resultado-lab').html('').addClass('d-none');
                $('#table-labPte').removeClass('d-none');
                $('.reset-render-lab').addClass('d-none');
            });
        }
        console.log('data = ', data);
    }).catch(function(err) {
        console.error(err);
    });
}

function loadPdf(url) {
    // If absolute URL from the remote server is provided, configure the CORS
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    var pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.75,
        canvas = document.getElementById('render-resultado'),
        ctx = canvas.getContext('2d');
    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport({
                scale: scale
            });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            // Wait for rendering to finish
            renderTask.promise.then(function() {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
        // Update page counters
        // document.getElementsByClassName('page_num').textContent = num;
        $('.page_num').text(num);
    }
    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }
    /**
     * Displays previous page.
     */
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }
    /*
    document.getElementsByClassName('prev').onclick = function(e) {
        e.preventDefault();
        onPrevPage();
    };
    */
    $('.prev').click(function(e) {
        e.preventDefault();
        onPrevPage();
    });
    /**
     * Displays next page.
     */
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }
    /*
    document.getElementsByClassName('next').onclick = function(e) {
        e.preventDefault();
        onNextPage();
    };
    */
    $('.next').click(function(e) {
        e.preventDefault();
        onNextPage();
    });
    /**
     * Asynchronously downloads PDF.
     */
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        $('.page_count').text(pdfDoc.numPages);
        // document.getElementsByClassName('page_count').textContent = pdfDoc.numPages;
        // Initial/first page rendering
        renderPage(pageNum);
    });
}