function cambioCSSAyuda() {
    cambioCSSPlantilla();
    $('#buttonAyuda').css('font-weight', 'bold');
}

function cambioCapaAyuda() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaAyuda');
    }

    location.replace('ayuda.html');
}
