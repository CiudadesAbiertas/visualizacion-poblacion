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
let urlIndicador1 = '';
let filtro = '';
let paramCubo = 'procedencia';
let arrayPaisProcedencia = [];
let arrayProvinciaProcedencia = [];
let arrayMunicipioProcedencia = [];
let arrayNivelEstudio = [];
let arrayPeriodo = [];
let arrayEdadesQuinquenales = [];
let arrayMunicipio = [];
let arrayDistrito = [];
let arrayDistrito2 = [];
let arrayBarrio = [];
let arraySeccionCensal = [];
let urlAjax = '';
let arrayIframesMapas = [
    'iframeGraficoMapa',
    'iframeGraficoMapaComp'
];
let arrayIframes = [
    'iframeGraficoMapa',
    'iframeGraficoMapaComp',
    'iframeGraficoBarras',
    'iframeGraficoBarras2',
    'iframeGraficoBarras3',
    'iframeGraficoLinea',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2'
];
let cambioTerritorio = '';

/*
	Método para aplicar filtros en el cubo de datos procedencia
*/
function aplicaFiltro() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [aplicaFiltro]');
    }
    
    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if(cambioTerritorio) {
        aplicaFiltroTerritorio(cambioTerritorio,arrayIframesMapas);
        cambioTerritorio = '';
    }

    $('#criterioTerritorio').html('');
    $('#criterioPaisPro').html('');
    $('#criterioProvPro').html('');
    $('#criterioMunPro').html('');
    $('#criterioPeriodo').html('');
    $('#criterioNivelEstudio').html('');
    $('#criterioEdadQuinquenales').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPaisPro').hide();
    $('#pcriterioProvPro').hide();
    $('#pcriterioMunPro').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioNivelEstudio').hide();
    $('#pcriterioEdadQuinquenales').hide();

    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectPaisProcedenciaPro','paisProcedencia',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'paisProcedencia');
    }
    filtroAux = aplicaFiltroElement('selectProvinciaProcedenciaPro','provinciaProcedencia',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'provinciaProcedencia');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioProcedenciaPro','municipioProcedencia',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioProcedencia');
    }
    filtroAux = aplicaFiltroElement('selectNivelEstudioPro', 'nivelEstudio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'tipoNivelEstudio');
    }
	filtroAux = aplicaFiltroElement('selectEdadQuinquenalesPro','edadQuinquenales',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'edadGruposQuinquenales');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoPro', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioPro', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoPro', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioPro', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalPro','seccionCensalId',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    indicadores(urlIndicador1,filtro);

    let esMultiple = chequeaMultiple('selectPeriodoPro') || chequeaMultiple('selectDistritoPro') 
    || chequeaMultiple('selectBarrioPro') || chequeaMultiple('selectSeccionCensalPro') 
    || chequeaMultiple('selectMunicipioPro') || chequeaMultiple('selectDistritoSCPro');
    if(esMultiple) {
        deshabilitaTerritorio();
    } else {
        habilitaTerritorio();
    }
}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaNacionalidad() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [cambioCapaNacionalidad]');
    }

    location.replace('procedencia.html');
}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [inicializaDatos]');
    }

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax

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
    obtenerComboValores('selectPaisProcedenciaPro', arrayPaisProcedencia, urlAjax, valores, 'checkbox', 
    false, taskCombos, 0);
	
    //selectProvinciaProcedencia
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=provinciaProcedencia&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectProvinciaProcedenciaPro', arrayProvinciaProcedencia, urlAjax, valores, 'checkbox', 
    false, taskCombos, 1);
	
    //selectMunicipioProcedencia
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioProcedencia&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectMunicipioProcedenciaPro', arrayMunicipioProcedencia, urlAjax, valores, 'checkbox', 
    false, taskCombos, 2);
	
    //selectEdadQuinquenales
    obtenerComboValoresConstantes('selectEdadQuinquenalesPro', arrayEdadesQuinquenales, 'VALORES_EDAD_QUINQUENAL', 
    false, taskCombos, 3);

    //selectNivelEstudio
    obtenerComboValoresConstantes('selectNivelEstudioPro', arrayNivelEstudio, 'VALORES_NIVEL_ESTUDIOS', 
    false, taskCombos, 4);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoPro', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 5);
    urlIndicador1 = urlAjax;
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    let chequeaUltimo = ('Municipio'.indexOf(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0])!=-1);
    obtenerCombo('selectMunicipioPro', arrayMunicipio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 6);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    chequeaUltimo = ('Distrito'.indexOf(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0])!=-1);
    obtenerCombo('selectDistritoPro', arrayDistrito, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 7);

    obtenerCombo('selectDistritoSCPro', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 7);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    chequeaUltimo = ('Barrio'.indexOf(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0])!=-1);
    obtenerCombo('selectBarrioPro', arrayBarrio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 8);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null' + 
            '&page=1&pageSize=100'
    );
    chequeaUltimo = ('Sección Censal'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0])!=-1);
    obtenerCombo('selectSeccionCensalPro', arraySeccionCensal, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 9);

}

function cambioCSSProcedencia() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [cambioCSSProcedencia]');
    }
    
    cambioCSSPlantilla();
    $('#buttonProcedencia').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [quitaSeleccionTodos]');
    }

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

    if (FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        seleccionTerritorio('municipio')
    } else if (FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        seleccionTerritorio('distrito')
    } else if (FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        seleccionTerritorio('barrio')
    } else if (FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        seleccionTerritorio('seccion_censal')
    }
    $('#selectPeriodoPro .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [seleccionTerritorio]');
    }
    
    cambioTerritorio = territorio;
    if(territorio=='municipio') {
        $('#selectMunicipioPro').show();
        $('#selectMunicipioPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoPro').hide();
        quitarSeleccion('selectDistritoPro')
        $('#selectBarrioPro').hide();
        quitarSeleccion('selectBarrioPro')
        $('#selectSeccionCensalPro').hide();
        $('#selectDistritoSCPro').hide();
        quitarSeleccion('selectSeccionCensalPro')
    }else if(territorio=='distrito') {
        $('#selectMunicipioPro').hide();
        quitarSeleccion('selectMunicipioPro')
        $('#selectDistritoPro').show();
        $('#selectDistritoPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioPro').hide();
        quitarSeleccion('selectBarrioPro')
        $('#selectSeccionCensalPro').hide();
        $('#selectDistritoSCPro').hide();
        quitarSeleccion('selectSeccionCensalPro')
    }else if(territorio=='barrio') {
        $('#selectMunicipioPro').hide();
        quitarSeleccion('selectMunicipioPro')
        $('#selectDistritoPro').hide();
        quitarSeleccion('selectDistritoPro')
        $('#selectBarrioPro').show();
        $('#selectBarrioPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalPro').hide();
        $('#selectDistritoSCPro').hide();
        quitarSeleccion('selectSeccionCensalPro')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioPro').hide();
        quitarSeleccion('selectMunicipioPro')
        $('#selectDistritoPro').hide();
        quitarSeleccion('selectDistritoPro')
        $('#selectBarrioPro').hide();
        quitarSeleccion('selectBarrioPro')
        $('#selectSeccionCensalPro').show();
        $('#selectDistritoSCPro').show();
        $('#selectSeccionCensalPro .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log(
            '[procedencia] [addFiltro] [paramValor:' +
                paramValor +
                '] [campo:' +
                campo +
                '] '
        );
    }

    if (!filtro) {
        filtro = filtro + '&where=(';
    } else {
        filtro = filtro + ' and (';
    }
    if (paramValor.includes(',')) {
        let params = paramValor.split(',');
        let h;
        for (h = 0; h < params.length; h++) {
            filtro = filtro + campo + "='" + params[h];
            if (h < params.length - 1) {
                filtro = filtro + "' or ";
            } else {
                filtro = filtro + "'";
            }
        }
    } else {
        filtro = filtro + campo + "='" + paramValor + "'";
    }
    filtro = filtro + ')';

    if (LOG_DEBUG_PROCEDENCIA) {
        console.log(
            '[procedencia] [addFiltro] [filtro:' +
                filtro +
                ']'
        );
    }
}

function filtraTerritorio() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [filtraTerritorio]');
    }

    filtroAux = aplicaFiltroElement('selectDistritoSCPro', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalPro').html('<div class="text-right">' + 
        '<button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalEdad\')">' + 
        '<i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button>' + 
        '<button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalEdad\')">' + 
        '<i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+
                filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem('selectSeccionCensalPro');
        obtenerCombo('selectSeccionCensalPro', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}

function inicializaInicio() {
    if (LOG_DEBUG_PROCEDENCIA) {
        console.log('[procedencia] [inicializaInicio]');
    }

    if(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        cambioTerritorio = 'municipio';
    }else if(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        cambioTerritorio = 'distrito';
    }else if(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        cambioTerritorio = 'barrio';
    }else if(FILTRO_SLIDER_TERRITORIO_PROCEDENCIA[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        cambioTerritorio = 'seccion_censal';
    }

    seleccionTerritorio(cambioTerritorio); 
    aplicaFiltro();
    cargaTerminada();
}