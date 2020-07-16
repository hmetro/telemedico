$(function() {
    'use strict'
    // Initialize tooltip
    $('[data-toggle="tooltip"]').tooltip()
    // Sidebar calendar
    $('#calendarInline').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        beforeShowDay: function(date) {
            // add leading zero to single digit date
            var day = date.getDate();
            console.log(day);
            return [true, (day < 10 ? 'zero' : '')];
        }
    });
    // getCitasMedico
    var calendarEvents = {
        id: 1,
        backgroundColor: '#d9e8ff',
        borderColor: '#0168fa',
        events: getCitasMedico()
    };
    var fechaInicioCalendar = calendarEvents.events;
    console.log(fechaInicioCalendar);
    setTimeout(function() {
        $('#calendar').fullCalendar({
            locale: 'es',
            height: 'parent',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,listWeek'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                list: 'Lista'
            },
            navLinks: true,
            selectable: true,
            selectLongPressDelay: 100,
            editable: true,
            nowIndicator: true,
            defaultView: 'listMonth',
            defaultDate: moment('2021-01-01'),
            views: {
                agenda: {
                    columnHeaderHtml: function(mom) {
                        return '<span>' + mom.format('ddd') + '</span>' + '<span>' + mom.format('DD') + '</span>';
                    }
                },
                day: {
                    columnHeader: false
                },
                listMonth: {
                    listDayFormat: 'ddd DD',
                    listDayAltFormat: false
                },
                listWeek: {
                    listDayFormat: 'ddd DD',
                    listDayAltFormat: false
                },
                agendaThreeDay: {
                    type: 'agenda',
                    duration: {
                        days: 3
                    },
                    titleFormat: 'MMMM YYYY'
                }
            },
            eventSources: [calendarEvents],
            eventAfterAllRender: function(view) {
                if (view.name === 'listMonth' || view.name === 'listWeek') {
                    var dates = view.el.find('.fc-list-heading-main');
                    dates.each(function() {
                        var text = $(this).text().split(' ');
                        var now = moment().format('DD');
                        $(this).html(text[0] + '<span>' + text[1] + '</span>');
                        if (now === text[1]) {
                            $(this).addClass('now');
                        }
                    });
                }
                console.log(view.el);
            },
            eventRender: function(event, element) {
                if (event.description) {
                    element.find('.fc-list-item-title').append('<span class="fc-desc">' + event.description + '</span>');
                    element.find('.fc-content').append('<span class="fc-desc">' + event.description + '</span>');
                }
                var eBorderColor = (event.source.borderColor) ? event.source.borderColor : event.borderColor;
                element.find('.fc-list-item-time').css({
                    color: eBorderColor,
                    borderColor: eBorderColor
                });
                element.find('.fc-list-item-title').css({
                    borderColor: eBorderColor
                });
                element.css('borderLeftColor', eBorderColor);
            },
        });
        // Initialize fullCalendar
        var calendar = $('#calendar').fullCalendar('getCalendar');
        // change view to week when in tablet
        if (window.matchMedia('(min-width: 576px)').matches) {
            calendar.changeView('agendaWeek');
        }
        // change view to month when in desktop
        if (window.matchMedia('(min-width: 992px)').matches) {
            calendar.changeView('month');
        }
        // change view based in viewport width when resize is detected
        calendar.option('windowResize', function(view) {
            if (view.name === 'listWeek') {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    calendar.changeView('month');
                } else {
                    calendar.changeView('listWeek');
                }
            }
        });
        // Display calendar event modal
        calendar.on('eventClick', function(calEvent, jsEvent, view) {
            var modal = $('#modalCalendarEvent');
            modal.modal('show');
            modal.find('.event-title').text(calEvent.title);
            if (calEvent.description) {
                modal.find('.event-desc').text(calEvent.description);
                modal.find('.event-desc').prev().removeClass('d-none');
            } else {
                modal.find('.event-desc').text('');
                modal.find('.event-desc').prev().addClass('d-none');
            }
            modal.find('.event-start-date').text(moment(calEvent.start).format('LLLL'));
            modal.find('.event-end-date').text(moment(calEvent.end).format('LLLL'));
            //styling
            modal.find('.modal-header').css('backgroundColor', (calEvent.source.borderColor) ? calEvent.source.borderColor : calEvent.borderColor);
        });
        // display current date
        var dateNow = calendar.getDate();
        calendar.option('select', function(startDate, endDate) {
            $('#modalCreateEvent').modal('show');
            $('#eventStartDate').val(startDate.format('LL'));
            $('#eventEndDate').val(endDate.format('LL'));
            $('#eventStartTime').val(startDate.format('LT')).trigger('change');
            $('#eventEndTime').val(endDate.format('LT')).trigger('change');
        });
        $('.select2-modal').select2({
            minimumResultsForSearch: Infinity,
            dropdownCssClass: 'select2-dropdown-modal',
        });
        $('.calendar-add').on('click', function(e) {
            e.preventDefault()
            $('#modalCreateEvent').modal('show');
        });
    }, 900);
})

function getCitasMedico() {
    var arrCitas = [];
    var formData = new FormData();
    formData.append('codigoMedico', '681');
    formData.append('startDate', '01-01-2020');
    formData.append('endDate', '31-12-2021');
    formData.append('tipoHorario', 2);
    formData.append('start', 0);
    formData.append('length', 10);
    fetch('https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/medicos/agenda', {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        $.each(data.data, function(index, value) {
            var fechaInicio = value.fecha.split('-');
            arrCitas.push({
                id: value.codigoHorario + '-' + value.numeroTurno,
                start: fechaInicio[2] + '-' + fechaInicio[1] + '-' + fechaInicio[0] + 'T' + value.horaInicio + ':00',
                end: fechaInicio[2] + '-' + fechaInicio[1] + '-' + fechaInicio[0] + 'T' + value.horaFin + ':00',
                title: value.nombresPaciente + ' ' + value.apellidosPaciente,
                description: value.nombresPaciente + ' ' + value.apellidosPaciente,
            });
        });
    }).catch(function(err) {
        console.error(err);
    });
    console.log(arrCitas);
    return arrCitas;
}