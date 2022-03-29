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
let paramCubo = 'pais-nacimiento';
let arrayPaisNacimiento = [];
let arraySexo = [];
let arrayPeriodo = [];
let arrayMunicipio = [];
let arrayDistrito = [];
let arrayDistrito2 = [];
let arrayBarrio = [];
let arraySeccionCensal = [];
let arrayEdadesQuinquenales = [];
let urlAjax = '';
let arrayIframesMapas = [
    'iframeGraficoMapa',
    'iframeGraficoMapaComp'
];
let arrayIframes = [
    'iframeGraficoMapa',
    'iframeGraficoMapaComp',
    'iframeGraficoBarras',
    'iframeGraficoPiramide',
    'iframeGraficoPiramide2',
    'iframeGraficoLinea',
    'iframeGraficoSexoCombinado',
    'iframeGraficoTarta',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2'
];
let cambioTerritorio = '';

/*
    Método para aplicar filtros en el cubo de datos pais de nacimiento
*/
function aplicaFiltro() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [aplicaFiltro]');
    }

    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if (cambioTerritorio) {
        aplicaFiltroTerritorio(cambioTerritorio, arrayIframesMapas);
        cambioTerritorio = '';
    }

    $('#criterioTerritorio').html('');
    $('#criterioPaisNac').html('');
    $('#criterioPeriodo').html('');
    $('#criterioEdadQuinquenales').html('');
    $('#criterioSexo').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPaisNac').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioEdadQuinquenales').hide();
    $('#pcriterioSexo').hide();

    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectPaisNacimientoPais', 'paisNacimiento', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'paisNacimiento');
    }
    filtroAux = aplicaFiltroElement('selectEdadQuinquenalesPais', 'edadQuinquenales', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'edadGruposQuinquenales');
    }
    filtroAux = aplicaFiltroElement('selectSexoPais', 'sexo', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoPais', 'periodo', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioPais', 'municipio', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoPais', 'distrito', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioPais', 'barrio', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalPais', 'seccionCensalId', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    indicadores(urlIndicador1, filtro);

    let esMultiple = chequeaMultiple('selectPeriodoPais') || chequeaMultiple('selectDistritoPais')
        || chequeaMultiple('selectBarrioPais') || chequeaMultiple('selectSeccionCensalPais')
        || chequeaMultiple('selectMunicipioPais') || chequeaMultiple('selectDistritoSCPais');
    if (esMultiple) {
        deshabilitaTerritorio();
    } else {
        habilitaTerritorio();
    }
}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaPaisNacimiento() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [cambioCapaPaisNacimiento]');
    }

    location.replace('pais_nacimiento.html');
}

/*
    Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [inicializaDatos]');
    }

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax

    let combos = [
        'selectPaisNacimientoPais',
        'selectEdadQuinquenalesPais',
        'selectSexoPais',
        'selectPeriodoPais',
        'selectMunicipioPais',
        'selectDistritoPais',
        'selectBarrioPais',
        'selectSeccionCensalPais',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false, false];

    //selectPaisNacimiento
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=paisNacimiento&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPaisNacimientoPais', arrayPaisNacimiento, urlAjax, valores, 'checkbox', false,
        taskCombos, 0);

    //selectEdadQuinquenales
    obtenerComboValoresConstantes('selectEdadQuinquenalesPais', arrayEdadesQuinquenales, 'VALORES_EDAD_QUINQUENAL',
        false, taskCombos, 1);

    //selectSexo
    obtenerComboValoresConstantes('selectSexoPais', arraySexo, 'VALORES_SEXO', false, taskCombos, 2);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoPais', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 3);
    urlIndicador1 = urlAjax;
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    let chequeaUltimo = ('Municipio'.indexOf(FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0]) != -1);
    obtenerCombo('selectMunicipioPais', arrayMunicipio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 4);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    chequeaUltimo = ('Distrito'.indexOf(FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0]) != -1);
    obtenerCombo('selectDistritoPais', arrayDistrito, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 5);

    obtenerCombo('selectDistritoSCPais', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 5);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    chequeaUltimo = ('Barrio'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0]) != -1);
    obtenerCombo('selectBarrioPais', arrayBarrio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 6);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null' +
        '&page=1&pageSize=100'
    );
    chequeaUltimo = ('Sección Censal'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0]) != -1);
    obtenerCombo('selectSeccionCensalPais', arraySeccionCensal, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 7);

}

function cambioCSSPaisNacimiento() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [cambioCSSPaisNacimiento]');
    }

    cambioCSSPlantilla();
    $('#buttonPaisNacimiento').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [quitaSeleccionTodos]');
    }

    $('#selectMunicipioPais .checkbox label input').prop('checked', false);
    $('#selectDistritoPais .checkbox label input').prop('checked', false);
    $('#selectBarrioPais .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalPais .checkbox label input').prop('checked', false);
    $('#selectPaisNacimientoPais .checkbox label input').prop('checked', false);
    $('#selectEdadQuinquenalesPais .checkbox label input').prop('checked', false);
    $('#selectSexoPais .checkbox label input').prop('checked', false);
    $('#selectPeriodoPais .checkbox label input').prop('checked', false);

    if (FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        seleccionTerritorio('municipio')
    } else if (FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        seleccionTerritorio('distrito')
    } else if (FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        seleccionTerritorio('barrio')
    } else if (FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        seleccionTerritorio('seccion_censal')
    }
    $('#selectPeriodoPais .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [seleccionTerritorio]');
    }

    cambioTerritorio = territorio;
    if (territorio == 'municipio') {
        $('#selectMunicipioPais').show();
        $('#selectMunicipioPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoPais').hide();
        quitarSeleccion('selectDistritoPais')
        $('#selectBarrioPais').hide();
        quitarSeleccion('selectBarrioPais')
        $('#selectSeccionCensalPais').hide();
        $('#selectDistritoSCPais').hide();
        quitarSeleccion('selectSeccionCensalPais')
    } else if (territorio == 'distrito') {
        $('#selectMunicipioPais').hide();
        quitarSeleccion('selectMunicipioPais')
        $('#selectDistritoPais').show();
        $('#selectDistritoPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioPais').hide();
        quitarSeleccion('selectBarrioPais')
        $('#selectSeccionCensalPais').hide();
        $('#selectDistritoSCPais').hide();
        quitarSeleccion('selectSeccionCensalPais')
    } else if (territorio == 'barrio') {
        $('#selectMunicipioPais').hide();
        quitarSeleccion('selectMunicipioPais')
        $('#selectDistritoPais').hide();
        quitarSeleccion('selectDistritoPais')
        $('#selectBarrioPais').show();
        $('#selectBarrioPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalPais').hide();
        $('#selectDistritoSCPais').hide();
        quitarSeleccion('selectSeccionCensalPais')
    } else if (territorio == 'seccion_censal') {
        $('#selectMunicipioPais').hide();
        quitarSeleccion('selectMunicipioPais')
        $('#selectDistritoPais').hide();
        quitarSeleccion('selectDistritoPais')
        $('#selectBarrioPais').hide();
        quitarSeleccion('selectBarrioPais')
        $('#selectSeccionCensalPais').show();
        $('#selectDistritoSCPais').show();
        $('#selectSeccionCensalPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log(
            '[paisNacimiento] [addFiltro] [paramValor:' +
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

    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log(
            '[paisNacimiento] [addFiltro] [filtro:' +
            filtro +
            ']'
        );
    }
}

function filtraTerritorio() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [filtraTerritorio]');
    }

    filtroAux = aplicaFiltroElement('selectDistritoSCPais', 'distrito', arrayIframes, 'checkbox');
    if (filtroAux) {
        filtro = '';
        $('#selectSeccionCensalPais').html('<div class="text-right">' +
            '<button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalEdad\')">' +
            '<i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button>' +
            '<button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalEdad\')">' +
            '<i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if (filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax =
            POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100' +
            filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem('selectSeccionCensalPais');
        obtenerCombo('selectSeccionCensalPais', arraySeccionCensal, urlAjax, 'checkbox', false, null);
    }
}

function inicializaInicio() {
    if (LOG_DEBUG_PAIS_NACIMIENTO) {
        console.log('[paisNacimiento] [inicializaInicio]');
    }

    if(FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        cambioTerritorio = 'municipio';
    }else if(FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        cambioTerritorio = 'distrito';
    }else if(FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        cambioTerritorio = 'barrio';
    }else if(FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        cambioTerritorio = 'seccion_censal';
    }

    seleccionTerritorio(cambioTerritorio);
    aplicaFiltro();
    cargaTerminada();
}