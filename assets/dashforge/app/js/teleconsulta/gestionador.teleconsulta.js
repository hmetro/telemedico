 // the html to: <a href="javascript:void(0);" data-navigo>About</a>
 // valores para el docuemnto CTAs
 // Rutas de la pagina
 $(function() {
     fetch('api/', {
         method: "GET",
         headers: {
             "X-REQUEST-T": mx,
         },
     }).then(function(response) {
         return response.json();
     }).then(function(data) {
         console.log('data = ', data);
         $('.footer').after(data);
         route();
     }).catch(function(err) {
         console.error(err);
     });
 });

 function route() {
     router.on({
         'resultados': function() {
             $('#content').html(template($('#v-table').html(), {}));
             dataPickersMX();
             table();
         },
         'ver-resultado/:id_resultado': function(params) {
             getDocumentoLab(params.id_resultado);
         },
         'descargar-resultado/:id_resultado': function(params) {
             getDocumentoLab(params.id_resultado);
         },
         'enviar-resultado/:id_resultado': function(params) {
             getMailDocumentoLab(params.id_resultado);
         },
         '*': function() {
             $('#content').html(template($('#v-table').html(), {}));
             table();
         }
     }).resolve();
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
     var from, to;
     from = $('#desde').datepicker({
         defaultDate: '+1w',
         numberOfMonths: 1
     }).on('change', function() {
         to.datepicker('option', 'minDate', getDate(this));
     });
     to = $('#hasta').datepicker({
         defaultDate: '+1w',
         numberOfMonths: 1
     }).on('change', function() {
         from.datepicker('option', 'maxDate', getDate(this));
     });

     function getDate(element) {
         var date;
         try {
             date = $.datepicker.parseDate(dateFormat, element.value);
         } catch (error) {
             date = null;
         }
         return date;
     }
 }
 // funcion obtiene datos de usuario
 function getUsuario(id) {
     fetch('api/usuario', {
         method: "GET",
         headers: {
             "X-REQUEST-ID-USER": id,
         },
     }).then(function(response) {
         return response.json();
     }).then(function(data) {
         console.log('data = ', data);
         $('#content').html(template($('#v-usuario').html(), {
             user: data.customData.user,
             email: data.customData.email,
             id: data.customData.id,
         }));
         $('.editar').click(function(e) {
             e.preventDefault();
             router.navigate('/editar-usuario/' + $(this).attr('id'));
         });
         $('.eliminar').click(function(e) {
             e.preventDefault();
             router.navigate('/eliminar-usuario/' + $(this).attr('id'));
         });
     }).catch(function(err) {
         console.error(err);
     });
 }

 function move() {
     var i = 0;
     if (i == 0) {
         i = 1;
         var elem = document.getElementById("loader");
         var width = 1;
         var id = setInterval(frame, 1);

         function frame() {
             if (width >= 100) {
                 clearInterval(id);
                 i = 0;
             } else {
                 width++;
                 elem.style.width = width + "%";
                 elem.innerHTML = width + "%";
             }
         }
     }
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
         canvas = document.getElementById('the-canvas'),
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
         document.getElementById('page_num').textContent = num;
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
     document.getElementById('prev').onclick = function(e) {
         e.preventDefault();
         onPrevPage();
     };
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
     document.getElementById('next').onclick = function(e) {
         e.preventDefault();
         onNextPage();
     };
     /**
      * Asynchronously downloads PDF.
      */
     pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
         pdfDoc = pdfDoc_;
         document.getElementById('page_count').textContent = pdfDoc.numPages;
         // Initial/first page rendering
         renderPage(pageNum);
     });
 }
 // funcion obtiene datos de usuario
 function getDocumentoLab(id_documento) {
     var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
     $('#content').html(template($('#v-spinner').html(), {}));
     move();
     fetch('api/laboratorio/resultado', {
         method: "GET",
         headers: {
             "X-REQUEST-ID-DOCUMENTO": id_documento,
             "X-REQUEST-FECHA-DOCUMENTO": retrievedObject_td.fecha,
         },
     }).then(function(response) {
         return response.json();
     }).then(function(data) {
         console.log('data = ', data);
         $('#content').html(template($('#v-ver-resultado').html(), retrievedObject_td));
         loadPdf(retrievedObject_td.pdf);
     }).catch(function(err) {
         console.error(err);
     });
 }
 // funcion obtiene datos de usuario
 function getMailDocumentoLab(id_documento) {
     var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
     $('#content').html(template($('#v-spinner').html(), {}));
     fetch('api/laboratorio/resultado', {
         method: "GET",
         headers: {
             "X-REQUEST-ID-DOCUMENTO": id_documento,
             "X-REQUEST-FECHA-DOCUMENTO": retrievedObject_td.fecha,
         },
     }).then(function(response) {
         return response.json();
     }).then(function(data) {
         console.log('data = ', data);
         $('#content').html(template($('#v-enviar-resultado').html(), {
             'pdf': data.pdf
         }));
         $('#btn-enviar').click(function(e) {
             e.stopImmediatePropagation();
             e.preventDefault();
             sendMailDocumentoLab(id_documento);
         });
     }).catch(function(err) {
         console.error(err);
     });
 }
 // funcion obtiene datos de usuario
 function sendMailDocumentoLab(id_documento) {
     var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
     $('#response').removeClass('alert-danger');
     $('#response').removeClass('alert-warning');
     $('#response').addClass('alert-warning');
     $("#response").html('Procesando...');
     $('#response').removeClass('d-none');
     $('#btn-enviar').attr('disabled', true);
     fetch('api/laboratorio/enviar-resultado', {
         method: "POST",
         body: $('#enviarresultado_mx').serialize(),
         headers: {
             "Content-Type": "application/x-www-form-urlencoded",
             "X-REQUEST-ID-DOCUMENTO": id_documento,
             "X-REQUEST-FECHA-DOCUMENTO": retrievedObject_td.fecha,
         },
     }).then(function(response) {
         return response.json();
     }).then(function(data) {
         console.log('data = ', data);
         if (data.success) {
             $('#response').html(data.message).css('font-weight', 'bold');
             $("#response").removeClass('alert-warning');
             $("#response").addClass('alert-success');
             $('#btn-enviar').removeAttr('disabled');
             $('#enviarresultado_mx').trigger('reset');
         } else {
             $('#response').html(data.message).css('font-weight', 'bold');
             $("#response").removeClass('alert-warning');
             $("#response").addClass('alert-danger');
             $('#btn-enviar').removeAttr('disabled');
         }
     }).catch(function(err) {
         console.error(err);
     });
 }
 // Updated 28 October 2011: Now allows 0, NaN, false, null and undefined in output. 
 function template(templateid, data) {
     return templateid.replace(/%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
         function(m, key) {
             return data.hasOwnProperty(key) ? data[key] : "";
         });
 }

 function MaysPrimera(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
 }

 function downloadFiles(urls) {
     var zip = new JSZip();
     var a = $("#downall");

     function request(url) {
         return new Promise(function(resolve) {
             var httpRequest = new XMLHttpRequest();
             httpRequest.open("GET", url);
             httpRequest.onload = function() {
                 zip.file(url, this.responseText);
                 resolve()
             }
             httpRequest.send()
         })
     }
     Promise.all(urls.map(function(url) {
         return request(url)
     })).then(function() {
         console.log(zip);
         zip.generateAsync({
             type: "blob"
         }).then(function(content) {
             a.attr('download', "folder" + new Date().getTime());
             a.attr('href', URL.createObjectURL(content));
         });
     })
 }

 function table() {
     $.fn.dataTable.ext.errMode = 'none';
     $('#loader').show();
     $('#v-v-table').hide();
     var table = $('#table').DataTable({
         "ajax": {
             url: "api/laboratorio/resultados",
             dataSrc: "customData",
             serverSide: true,
         },
         processing: true,
         serverSide: true,
         responsive: false,
         dom: 'ltp',
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
             title: "Documento:"
         }, {
             title: "Paciente:"
         }, {
             title: "Convenio:"
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
                 return full.CEDULA;
             },
             visible: true,
             aTargets: [3]
         }, {
             mRender: function(data, type, full) {
                 return full.NOMBRE_PERSONA;
             },
             visible: true,
             aTargets: [4]
         }, {
             mRender: function(data, type, full) {
                 return full.ORIGEN;
             },
             visible: true,
             aTargets: [5]
         }, {
             mRender: function(data, type, full) {
                 return template($('#btn-table-opc').html(), {
                     id: full.ID_RESULTADO,
                     fecha: full.FECHA_RES,
                     pdf: full.PDF,
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
         "drawCallback": function(settings) {
             $("#selectall").on("click", function(e) {
                 e.stopImmediatePropagation();
                 $(".check-descargar-resultado").prop("checked", this.checked);
                 var archivos = [];
                 $("input:checkbox[name=case]:checked").each(function() {
                     $(this).val();
                     archivos.push(urlhome + 'api/documentos/resultados/' + $(this).val() + '.pdf');
                 });

                 function create_zip() {
                     var fileURL = archivos[0];
                     var request = $.ajax({
                         url: fileURL,
                         type: "GET",
                         contentType: "application/pdf",
                     });
                     request.done(function(data) {
                         var zip = new JSZip();
                         zip.add(data, {
                             binary: true
                         });
                         content = zip.generate();
                         location.href = "data:application/zip;base64," + content;
                     });
                 }
                 create_zip();
             });
             $('.ver-resultado').click(function(e) {
                 e.stopImmediatePropagation();
                 e.preventDefault();
                 var currentRow = $(this).closest("tr");
                 var id_resultado = $(this).attr('id');
                 var fecha = $(this).attr('data-fecha');
                 var paciente = currentRow.find("td:eq(3)").text();
                 var origen = currentRow.find("td:eq(5)").text();
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
                 window.open(urlhome + 'laboratorio#!/ver-resultado/' + $(this).attr('id'), '_blank');
             });
             $('.descargar-resultado').click(function(e) {
                 e.stopImmediatePropagation();
                 e.preventDefault();
                 var _td = $(this);
                 _td.attr('disabled', 'disabled');
                 _td.html('Procesando...').addClass('pos-absolute');
                 var currentRow = $(this).closest("tr");
                 var id_resultado = $(this).attr('id');
                 var fecha = $(this).attr('data-fecha');
                 var paciente = currentRow.find("td:eq(3)").text();
                 var origen = currentRow.find("td:eq(5)").text();
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
                 var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
                 fetch('api/laboratorio/resultado', {
                     method: "GET",
                     headers: {
                         "X-REQUEST-ID-DOCUMENTO": id_resultado,
                         "X-REQUEST-FECHA-DOCUMENTO": retrievedObject_td.fecha,
                     },
                 }).then(function(response) {
                     _td.html('<i class="icon ion-md-download"></i> Descargar');
                     _td.removeAttr('disabled').removeClass('pos-absolute');
                     return response.json();
                 }).then(function(data) {
                     console.log('data = ', data);
                     var link = document.createElement('a');
                     link.href = data.pdf;
                     link.download = "Res_Lab_" + id_resultado + " _" + retrievedObject_td.fecha + "_.pdf";
                     link.click();
                 }).catch(function(err) {
                     alert(err);
                     console.error(err);
                 });
             });
             $('.enviar-resultado').click(function(e) {
                 e.stopImmediatePropagation();
                 e.preventDefault();
                 var currentRow = $(this).closest("tr");
                 var id_resultado = $(this).attr('id');
                 var fecha = $(this).attr('data-fecha');
                 var paciente = currentRow.find("td:eq(3)").text();
                 var origen = currentRow.find("td:eq(5)").text();
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
                 var retrievedObject_td = JSON.parse(localStorage.getItem('Object_td'));
                 $('#content').html(template($('#v-enviar-resultado').html(), Object_td));
                 router.navigate('/enviar-resultado/' + $(this).attr('id'));
             });
         },
         "order": [
             [0, 'Desc']
         ],
     }).on('xhr.dt', function(e, settings, json, xhr) {
         // Do some staff here...
         $('#loader').hide();
         $('#v-v-table').show();
     });
     $('.dataTables_length select').select2({
         minimumResultsForSearch: Infinity
     });
     $('#button-buscar-t').click(function(e) {
         e.preventDefault();
         $('#loader').show();
         $('#v-v-table').hide();
         table.search($('#_dt_search_text').val()).draw();
     });
     $('#filtrar').click(function(e) {
         e.preventDefault();
         $('#loader').show();
         $('#v-v-table').hide();
         table.search('fechas-' + $('#desde').val() + '-' + $('#hasta').val()).draw();
     });
     return table;
 }