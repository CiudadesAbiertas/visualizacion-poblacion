/*
Copyright 2018 Ayuntamiento de A Coruña, Ayuntamiento de Madrid, Ayuntamiento de Santiago de Compostela, Ayuntamiento de Zaragoza, Entidad Pública Empresarial Red.es

This visualization is part of the actions carried out within the 'Ciudades Abiertas' project.

Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the 'Licence');
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an 'AS IS' basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and limitations under the Licence.
*/

/*
	Método para aplicar filtros en el cubo de datos procedencia
*/
function aplicaFiltro(territorio) {
    if (LOG_DEBUG_COMUN) {
        console.log('[aplicaFiltro]');
    }
    let arrayIframesMapas = [
        'iframeGraficoMapa',
        'iframeGraficoMapa2'
    ];
    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if(territorio) {
        aplicaFiltroTerritorio(territorio,arrayIframesMapas);
    }
    /* Se configura los iframes a los que les afecta los filtros */
    let arrayIframes = [
        'iframeGraficoMapa',
        'iframeGraficoMapa2',
        'iframeGraficoBarras',
        'iframeGraficoBarras2',
        'iframeGraficoBarras3',
        'iframeGraficoLinea',
        'iframetablaDatosGenerica',
        'iframeComparadorTerritorio',
        'iframeComparadorTerritorio2'
    ];

    $('#criterioTerritorio').html('');
    $('#criterioPaisPro').html('');
    $('#criterioProvPro').html('');
    $('#criterioMunPro').html('');
    $('#criterioPeriodo').html('');
    $('#criterioNivelEstudio').html('');
    $('#criterioEdadQuinquenales').html('');

    $('#criterioTerritorio2').html('');
    $('#criterioPaisPro2').html('');
    $('#criterioProvPro2').html('');
    $('#criterioMunPro2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioNivelEstudio2').html('');
    $('#criterioEdadQuinquenales2').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPaisPro').hide();
    $('#pcriterioProvPro').hide();
    $('#pcriterioMunPro').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioNivelEstudio').hide();
    $('#pcriterioEdadQuinquenales').hide();

    $('#pcriterioTerritorio2').hide();
    $('#pcriterioPaisPro2').hide();
    $('#pcriterioProvPro2').hide();
    $('#pcriterioMunPro2').hide();
    $('#pcriterioPeriodo2').hide();
    $('#pcriterioNivelEstudio2').hide();
    $('#pcriterioEdadQuinquenales2').hide();

    if(territorio) {
        seleccionTerritorio(territorio);
    }

    aplicaFiltroElement('selectPaisProcedenciaPro','paisProcedencia',arrayIframes,'checkbox');
    aplicaFiltroElement('selectProvinciaProcedenciaPro','provinciaProcedencia',arrayIframes,'checkbox');
    aplicaFiltroElement('selectMunicipioProcedenciaPro','municipioProcedencia',arrayIframes),'checkbox';
    aplicaFiltroElement('selectNivelEstudioPro', 'nivelEstudios', arrayIframes),'checkbox';
	aplicaFiltroElement('selectEdadQuinquenalesPro','edadQuinquenales',arrayIframes,'checkbox');
    aplicaFiltroElement('selectPeriodoPro', 'periodo', arrayIframes,'checkbox');
    aplicaFiltroElement('selectMunicipioPro', 'municipio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectDistritoPro', 'distrito', arrayIframes,'checkbox');
    aplicaFiltroElement('selectBarrioPro', 'barrio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectSeccionCensalPro','seccionCensalId',arrayIframes,'checkbox');

}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaNacionalidad() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaProcedencia');
    }

    location.replace('procedencia.html');
}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosProcedencia');
    }

    let paramCubo = 'procedencia';

    let arrayPaisProcedencia = [];
    let arrayProvinciaProcedencia = [];
    let arrayMunicipioProcedencia = [];
    let arrayNivelEstudio = [];
    let arrayPeriodo = [];
    let arrayEdadesQuinquenales = [];
    let arrayMunicipio = [];
    let arrayDistrito = [];
    let arrayBarrio = [];
    let arraySeccionCensal = [];
    let urlAjax = '';

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

    let combos = [
        'selectPaisProcedenciaPro',
        'selectProvinciaProcedenciaPro',
		'selectMunicipioProcedenciaPro',
	    'selectNivelEstudioPro',
		'selectEdadQuinquenalesPro',
        'selectPeriodoPro',
        'selectMunicipioPro',
        'selectDistritoPro',
        'selectBarrioPro',
        'selectSeccionCensalPro',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false, false, false, false];

    //selectPaisProcedencia
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=paisProcedencia&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPaisProcedenciaPro', arrayPaisProcedencia, urlAjax, valores, 'checkbox', false, taskCombos, 0);
	
    //selectProvinciaProcedencia
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=provinciaProcedencia&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectProvinciaProcedenciaPro', arrayProvinciaProcedencia, urlAjax, valores, 'checkbox', false, taskCombos, 1);
	
    //selectMunicipioProcedencia
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioProcedencia&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectMunicipioProcedenciaPro', arrayMunicipioProcedencia, urlAjax, valores, 'checkbox', false, taskCombos, 2);
	
    //selectEdadQuinquenales
    urlAjax = dameURL(
        DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_EDAD_QUINQUENAL +
            DSD_VALORES_DIMENSIONES_URL_2
    );
    obtenerComboValores('selectEdadQuinquenalesPro', arrayEdadesQuinquenales, urlAjax, valores2, 'checkbox', false, taskCombos, 3);

    //selectNivelEstudio
    urlAjax = dameURL(
        DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_NIVEL_ESTUDIOS +
            DSD_VALORES_DIMENSIONES_URL_2
    );
    obtenerComboValores('selectNivelEstudioPro', arrayNivelEstudio, urlAjax, valores2, 'checkbox', false, taskCombos, 4);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoPro', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 5);
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectMunicipioPro', arrayMunicipio, urlAjax, 'checkbox', true, taskCombos, 6);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoPro', arrayDistrito, urlAjax, 'checkbox', false, taskCombos, 7);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioPro', arrayBarrio, urlAjax, 'checkbox', false, taskCombos, 8);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalPro', arraySeccionCensal, urlAjax, 'checkbox', false, taskCombos, 9);

    cargaTerminada();

}

function cambioCSSProcedencia() {
    cambioCSSPlantilla();
    $('#buttonProcedencia').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    $('#selectMunicipioPro .checkbox label input').prop('checked', false);
    $('#selectDistritoPro .checkbox label input').prop('checked', false);
    $('#selectBarrioPro .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalPro .checkbox label input').prop('checked', false);
    $('#selectPaisProcedenciaPro .checkbox label input').prop('checked', false);
    $('#selectProvinciaProcedenciaPro .checkbox label input').prop('checked', false);
    $('#selectMunicipioProcedenciaPro .checkbox label input').prop('checked', false);
    $('#selectNivelEstudioPro .checkbox label input').prop('checked', false);
	$('#selectEdadQuinquenalesPro .checkbox label input').prop('checked', false);
    $('#selectPeriodoPro .checkbox label input').prop('checked', false);
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioPro').show();
        $('#selectMunicipioPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoPro').hide();
        quitarSeleccion('selectDistritoPro')
        $('#selectBarrioPro').hide();
        quitarSeleccion('selectBarrioPro')
        $('#selectSeccionCensalPro').hide();
        quitarSeleccion('selectSeccionCensalPro')
    }else if(territorio=='distrito') {
        $('#selectMunicipioPro').hide();
        quitarSeleccion('selectMunicipioPro')
        $('#selectDistritoPro').show();
        $('#selectDistritoPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioPro').hide();
        quitarSeleccion('selectBarrioPro')
        $('#selectSeccionCensalPro').hide();
        quitarSeleccion('selectSeccionCensalPro')
    }else if(territorio=='barrio') {
        $('#selectMunicipioPro').hide();
        quitarSeleccion('selectMunicipioPro')
        $('#selectDistritoPro').hide();
        quitarSeleccion('selectDistritoPro')
        $('#selectBarrioPro').show();
        $('#selectBarrioPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalPro').hide();
        quitarSeleccion('selectSeccionCensalPro')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioPro').hide();
        quitarSeleccion('selectMunicipioPro')
        $('#selectDistritoPro').hide();
        quitarSeleccion('selectDistritoPro')
        $('#selectBarrioPro').hide();
        quitarSeleccion('selectBarrioPro')
        $('#selectSeccionCensalPro').show();
        $('#selectSeccionCensalPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}