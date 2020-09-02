$(document).ready(function() {
    generateKey();
});

function statusLive() {
    setInterval(function() {
        getLive();
    }, 1100);
}

function generateKey() {
    var formData = new FormData();
    formData.append('DNI', '1501128480');
    formData.append('PASS', '1501128480');
    fetch('https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/login', {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        if (json.status) {
            localStorage.setItem('accessToken', json.user_token);
            getInfoCita();
        } else {
            console.error(json.message);
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function getLive() {
    var formData = new FormData();
    formData.append('idH', idH);
    formData.append('idT', idT);
    fetch('api/live', {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (data.status) {
            $('#loading-cita').addClass('d-none');
            $('#link-zoom').removeClass('d-none');
            $('#b-link-zoom').attr('href', data.link);
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function getInfoCita() {
    var formData = new FormData();
    formData.append('codigoHorario', idH);
    formData.append('numeroTurno', idT);
    fetch('https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/citas/detalle', {
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
        console.log(json);
        if (json.status) {
            $('#doctor').html('<b>Médico:</b></br> ' + json.data.nombresMedico);
            $('#espe').html('<b>Especialidad:</b></br> ' + json.data.especialidadMedico);
            $('#cita').html('<b>Cita:</b></br> ' + json.data.fechaCita + ' ' + json.data.horaCita);
            $('#dura').html('<b>Duración:</b></br> ' + json.data.duracionCita + ' Minutos. ');
            statusLive();
        } else {
            console.log(json);
            // window.location.assign("https://www3.hospitalmetropolitano.org");
        }
    }).catch(function(err) {
        console.error(err);
    });
}