function loadPerfilMedico() {
    var formData = new FormData();
    formData.append('codigoMedico', _codMedico_);
    fetch(epDatosMedico, {
        method: "POST",
        body: formData,
        contentType: false,
        processData: false,
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log('data = ', data);
        if (data.status) {
            $('.nombMedico').html(data.data[0].nombres);
            $('.iNombMedico').html(data.data[0].nombres);
        } else {}
    }).catch(function(err) {
        console.error(err);
    });
}