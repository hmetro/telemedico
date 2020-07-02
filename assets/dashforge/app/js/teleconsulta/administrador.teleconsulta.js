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
         'mi-calendario': function() {
             // $('#content').html(template($('#v-calendar').html(), {}));
         },
         '*': function() {
             // Cargar contactos de doctor
             loadContactos();
             $('.select2').select2({
                 placeholder: 'Tipo de nota',
                 searchInputPlaceholder: 'Buscar...'
             });
         }
     }).resolve();
     // set all evetn
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
     $('#fecha_cita').datepicker({
         showOtherMonths: true,
         selectOtherMonths: true,
         changeMonth: true,
         changeYear: true
     });
 }

 function loadContactos() {
     $('#allContacts').html(template($('#v-spinner').html(), {}));
     fetch('api/contactos', {
         method: "GET",
     }).then(function(response) {
         return response.json();
     }).then(function(data) {
         console.log('data = ', data);
         $('#allContacts').html('');
         // Llamada creada
         if (data.status) {
             $.each(data.customData, function(index, value) {
                 $('#allContacts').append(template($('#v-contacto').html(), {
                     id: value.id,
                     inicial: value.contacto.charAt(0),
                     contacto: value.contacto,
                     email: value.correo,
                 }));
             });
             $('.m-contacto').click(function(e) {
                 e.preventDefault();
                 localStorage.setItem('id_contacto', this.id);
                 localStorage.setItem('contacto', $('#contacto-' + this.id).text());
                 localStorage.setItem('correo', $('#correo-' + this.id).text());
                 $('#v-contacto-inicial').html($('#inicial-' + this.id).text());
                 $('#v-contacto-contacto').html($('#contacto-' + this.id).text());
                 $('#v-contacto-correo').html($('#correo-' + this.id).text());
                 $('.contact-content-sidebar').removeClass('d-none');
                 $('.contact-content-header').css('right', '690px');
                 $('.contact-content-body').css('right', '690px');
             });
             $('#initCall').click(function(e) {
                 e.preventDefault();
                 $('#modalInitCall').modal('show');
                 initCallZoom();
             });
         } else {
             $('#allContacts').html(template($('#v-not-contactos').html(), {}));
         }
     }).catch(function(err) {
         console.error(err);
     });
 }

 function initCallZoom() {
     $('#f-new-cita').show();
     $('#f-new-cita-response').addClass('d-none');
     $('#f-new-cita-contacto').val($.trim(localStorage.contacto));
     $('#f-new-cita-correo').val($.trim(localStorage.correo));
     $('#f-new-cita-id-contacto').val($.trim(localStorage.id_contacto));
     $('#res-cita').addClass('d-none');
     $('.contact-content-sidebar').removeClass('d-none');
     $('.contact-content-header').css('right', '690px');
     $('.contact-content-body').css('right', '690px');
     $('#f-new-cita-send').click(function(e) {
         e.preventDefault();
         _ini_new_cita();
     });
     dataPickersMX();
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

 function _ini_new_contacto() {
     $('#f-new-contacto-response').removeClass('alert-danger');
     $('#f-new-contacto-response').removeClass('alert-warning');
     $('#f-new-contacto-response').addClass('alert-warning');
     $("#f-new-contacto-response").html('Procesando...');
     $('#f-new-contacto-response').removeClass('d-none');
     $('#f-new-contacto-send').html('Procesando...');
     $('#f-new-contacto-send').attr('disabled', true);
     $.ajax({
         type: "POST",
         url: "api/contactos",
         data: $('#f-new-contacto').serialize(),
         success: function(json) {
             if (json.status) {
                 $('#f-new-contacto-response').html(json.message).css('font-weight', 'bold');
                 $("#f-new-contacto-response").removeClass('alert-warning');
                 $("#f-new-contacto-response").addClass('alert-success');
                 $('#f-new-contacto-send').removeAttr('disabled');
                 $('#f-new-contacto-send').html('Gurdar Contacto');
                 $('#f-new-contacto').trigger("reset");
                 $('#modalNewContact').modal("hide");
                 loadContactos();
             } else {
                 $('#f-new-contacto-response').html(json.message).css('font-weight', 'bold');
                 $("#f-new-contacto-response").removeClass('alert-warning');
                 $("#f-new-contacto-response").addClass('alert-danger');
                 $('#f-new-contacto-send').removeAttr('disabled');
                 $('#f-new-contacto-send').html('Gurdar Contacto');
             }
         },
         error: function() {
             window.alert('#Request Error!');
         }
     });
 };
 if (document.getElementById('f-new-contacto-send')) {
     document.getElementById('f-new-contacto-send').onclick = function(e) {
         e.preventDefault();
         _ini_new_contacto();
     };
 }
 if (document.getElementById('f-new-contacto')) {
     document.getElementById('f-new-contacto').onkeypress = function(e) {
         if (!e) e = window.event;
         var keyCode = e.keyCode || e.which;
         if (keyCode == '13') {
             _ini_new_contacto();
             return false;
         }
     };
 }

 function _ini_new_cita() {
     $('#f-new-cita-response').addClass('d-none');
     $('#f-new-cita-response').removeClass('alert-danger');
     $('#f-new-cita-response').removeClass('alert-warning');
     $('#f-new-cita-response').addClass('alert-warning');
     $("#f-new-cita-response").html('Procesando...');
     $('#f-new-cita-response').removeClass('d-none');
     $('#f-new-cita-send').html('Procesando...');
     $('#f-new-cita-send').attr('disabled', true);
     $.ajax({
         type: "POST",
         url: "api/citas",
         data: $('#f-new-cita').serialize(),
         success: function(json) {
             if (json.status) {
                 $('#f-new-cita-response').html(json.message).css('font-weight', 'bold');
                 $("#f-new-cita-response").removeClass('alert-warning');
                 $("#f-new-cita-response").addClass('alert-success');
                 $('#f-new-cita-send').removeAttr('disabled');
                 $('#f-new-cita-send').html('Generar');
                 $('#f-new-cita').trigger("reset");
                 $('#f-new-cita').hide();
                 $('#modalInitCall').modal("hide");
                 $('#i-live').attr('src', json.url);
                 $('.live-active').removeClass('d-none').click();
                 $('.paciente').removeClass('active');
                 $('#live').addClass('show active');
                 $('.contact-content').css('left', 'inherit');
                 $('.contact-sidebar').hide();
                 $('.contact-navleft').hide();
                 // links teleconsultas
                 $('#l-link-teleconsulta').removeClass('d-none');
                 $('#p-link-teleconsulta').removeClass('d-none');
                 $('#link-teleconsulta').attr('href', json.url_zoom).html(json.url_zoom);
             } else {
                 $('#f-new-cita-response').html(json.message).css('font-weight', 'bold');
                 $("#f-new-cita-response").removeClass('alert-warning');
                 $("#f-new-cita-response").addClass('alert-danger');
                 $('#f-new-cita-send').removeAttr('disabled');
                 $('#f-new-cita-send').html('Generar');
             }
         },
         error: function() {
             window.alert('#Request Error!');
         }
     });
 };
 if (document.getElementById('f-new-cita')) {
     document.getElementById('f-new-cita').onkeypress = function(e) {
         if (!e) e = window.event;
         var keyCode = e.keyCode || e.which;
         if (keyCode == '13') {
             _ini_new_cita();
             return false;
         }
     };
 }