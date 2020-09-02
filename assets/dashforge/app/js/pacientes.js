$(function() {
    localStorage.setItem('sts', 0);
    initDashforge();
    initChatDashboard();
    generateKey();
    loadPerfilMedico();
    loadCitas();
    getMisPacientes();
    startTime();
    setActionTabs();
});

function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    //Add a zero in front of numbers<10
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clockApp").innerHTML = hr + " : " + min;
    var time = setTimeout(function() {
        startTime()
    }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
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
        } else {
            console.error(json.message);
        }
    }).catch(function(err) {
        console.error(err);
    });
}

function setActionTabs() {
    var Object_Tabs = {
        datosPte: {
            load: false,
            view: false,
        },
        atenPte: {
            load: false,
            view: false,
        },
        labPte: {
            load: false,
            view: false,
        },
        imgPte: {
            load: false,
            view: false,
        },
        live: {
            load: false,
            view: false,
        }
    };
    // Put the object into storage
    localStorage.setItem('Object_Tabs', JSON.stringify(Object_Tabs));
}