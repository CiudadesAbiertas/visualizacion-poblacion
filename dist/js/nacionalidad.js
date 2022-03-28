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
let paramCubo = 'nacionalidad';
let arrayNacionalidad = [];
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
    'iframeGraficoPiramide',
    'iframeGraficoPiramide2',
    'iframeGraficoBarras',
    'iframeGraficoTarta',
    'iframeGraficoLinea',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2'
];
let cambioTerritorio = '';

/*
    Método para aplicar filtros en el cubo de datos nacionalidad
*/
function aplicaFiltro() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [aplicaFiltro]');
    }

    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if (cambioTerritorio) {
        aplicaFiltroTerritorio(cambioTerritorio, arrayIframesMapas);
        cambioTerritorio = '';
    }

    $('#criterioTerritorio').html('');
    $('#criterioNacionalidad').html('');
    $('#criterioPeriodo').html('');
    $('#criterioEdadQuinquenales').html('');
    $('#criterioSexo').html('');

    $('#criterioTerritorio2').html('');
    $('#criterioNacionalidad2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioEdadQuinquenales2').html('');
    $('#criterioSexo2').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioNacionalidad').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioEdadQuinquenales').hide();
    $('#pcriterioSexo').hide();

    $('#pcriterioTerritorio2').hide();
    $('#pcriterioNacionalidad2').hide();
    $('#pcriterioPeriodo2').hide();
    $('#pcriterioEdadQuinquenales2').hide();
    $('#pcriterioSexo2').hide();

    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectNacionalidadNac', 'nacionalidad', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'nacionalidad');
    }
    filtroAux = aplicaFiltroElement('selectEdadQuinquenalesNac', 'edadQuinquenales', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'edadGruposQuinquenales');
    }
    filtroAux = aplicaFiltroElement('selectSexoNac', 'sexo', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoNac', 'periodo', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioNac', 'municipio', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoNac', 'distrito', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioNac', 'barrio', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalNac', 'seccionCensalId', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    indicadores(urlIndicador1, filtro);

    let esMultiple = chequeaMultiple('selectPeriodoNac') || chequeaMultiple('selectDistritoNac')
        || chequeaMultiple('selectBarrioNac') || chequeaMultiple('selectSeccionCensalNac')
        || chequeaMultiple('selectMunicipioNac') || chequeaMultiple('selectDistritoSCNac');
    if (esMultiple) {
        deshabilitaTerritorio();
    } else {
        habilitaTerritorio();
    }
}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaNacionalidad() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [cambioCapaNacionalidad]');
    }

    location.replace('nacionalidad.html');
}

/*
    Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [inicializaDatos]');
    }

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax

    let combos = [
        'selectNacionalidadNac',
        'selectEdadQuinquenalesNac',
        'selectSexoNac',
        'selectPeriodoNac',
        'selectMunicipioNac',
        'selectDistritoNac',
        'selectBarrioNac',
        'selectSeccionCensalNac',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false, false];

    //selectNacionalidad
    obtenerComboValoresConstantes('selectNacionalidadNac', arrayNacionalidad, 'VALORES_NACIONALIDAD', false,
        taskCombos, 0);

    //selectEdadQuinquenales
    obtenerComboValoresConstantes('selectEdadQuinquenalesNac', arrayEdadesQuinquenales, 'VALORES_EDAD_QUINQUENAL',
        false, taskCombos, 1);

    //selectSexo
    obtenerComboValoresConstantes('selectSexoNac', arraySexo, 'VALORES_SEXO', false, taskCombos, 2);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoNac', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 3);
    urlIndicador1 = urlAjax;
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    let chequeaUltimo = ('Municipio'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0]) != -1);
    obtenerCombo('selectMunicipioNac', arrayMunicipio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 4);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    chequeaUltimo = ('Distrito'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0]) != -1);
    obtenerCombo('selectDistritoNac', arrayDistrito, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 5);

    obtenerCombo('selectDistritoSCNac', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 5);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    chequeaUltimo = ('Barrio'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0]) != -1);
    obtenerCombo('selectBarrioNac', arrayBarrio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 6);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas' +
        '&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    chequeaUltimo = ('Sección Censal'.indexOf(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0]) != -1);
    obtenerCombo('selectSeccionCensalNac', arraySeccionCensal, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 7);
}

function cambioCSSNacionalidad() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [cambioCSSNacionalidad]');
    }

    cambioCSSPlantilla();
    $('#buttonNacionalidad').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [quitaSeleccionTodos]');
    }

    $('#selectMunicipioNac .checkbox label input').prop('checked', false);
    $('#selectDistritoNac .checkbox label input').prop('checked', false);
    $('#selectBarrioNac .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalNac .checkbox label input').prop('checked', false);
    $('#selectNacionalidadNac .checkbox label input').prop('checked', false);
    $('#selectEdadQuinquenalesNac .checkbox label input').prop('checked', false);
    $('#selectSexoNac .checkbox label input').prop('checked', false);
    $('#selectPeriodoNac .checkbox label input').prop('checked', false);

    if (FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        seleccionTerritorio('municipio')
    } else if (FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        seleccionTerritorio('distrito')
    } else if (FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        seleccionTerritorio('barrio')
    } else if (FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        seleccionTerritorio('seccion_censal')
    }
    $('#selectPeriodoNac .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [seleccionTerritorio]');
    }

    cambioTerritorio = territorio;
    if (territorio == 'municipio') {
        $('#selectMunicipioNac').show();
        $('#selectMunicipioNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoNac').hide();
        quitarSeleccion('selectDistritoNac')
        $('#selectBarrioNac').hide();
        quitarSeleccion('selectBarrioNac')
        $('#selectSeccionCensalNac').hide();
        $('#selectDistritoSCNac').hide();
        quitarSeleccion('selectSeccionCensalNac')
    } else if (territorio == 'distrito') {
        $('#selectMunicipioNac').hide();
        quitarSeleccion('selectMunicipioNac')
        $('#selectDistritoNac').show();
        $('#selectDistritoNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioNac').hide();
        quitarSeleccion('selectBarrioNac')
        $('#selectSeccionCensalNac').hide();
        $('#selectDistritoSCNac').hide();
        quitarSeleccion('selectSeccionCensalNac')
    } else if (territorio == 'barrio') {
        $('#selectMunicipioNac').hide();
        quitarSeleccion('selectMunicipioNac')
        $('#selectDistritoNac').hide();
        quitarSeleccion('selectDistritoNac')
        $('#selectBarrioNac').show();
        $('#selectBarrioNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalNac').hide();
        $('#selectDistritoSCNac').hide();
        quitarSeleccion('selectSeccionCensalNac')
    } else if (territorio == 'seccion_censal') {
        $('#selectMunicipioNac').hide();
        quitarSeleccion('selectMunicipioNac')
        $('#selectDistritoNac').hide();
        quitarSeleccion('selectDistritoNac')
        $('#selectBarrioNac').hide();
        quitarSeleccion('selectBarrioNac')
        $('#selectSeccionCensalNac').show();
        $('#selectDistritoSCNac').show();
        $('#selectSeccionCensalNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log(
            '[nacionalidad] [addFiltro] [paramValor:' +
            paramValor +
            '] [campo:' +
            campo +
            '] [filtro:' +
            filtro +
            ']'
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

    if (LOG_DEBUG_NACIONALIDAD) {
        console.log("[nacionalidad] [addFiltro] [filtro:" + filtro + "]");
    }
}

function filtraTerritorio() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [filtraTerritorio]');
    }

    filtroAux = aplicaFiltroElement('selectDistritoSCNac', 'distrito', arrayIframes, 'checkbox');
    if (filtroAux) {
        filtro = '';
        $('#selectSeccionCensalNac').html('<div class="text-right">' +
            '<button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalNac\')">' +
            '<i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button>' +
            '<button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalNac\')">' +
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
        sessionStorage.removeItem('selectSeccionCensalNac');
        obtenerCombo('selectSeccionCensalNac', arraySeccionCensal, urlAjax, 'checkbox', false, null);
    }
}

function inicializaInicio() {
    if (LOG_DEBUG_NACIONALIDAD) {
        console.log('[nacionalidad] [inicializaInicio]');
    }

    if(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        cambioTerritorio = 'municipio';
    }else if(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        cambioTerritorio = 'distrito';
    }else if(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        cambioTerritorio = 'barrio';
    }else if(FILTRO_SLIDER_TERRITORIO_NACIONALIDAD[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        cambioTerritorio = 'seccion_censal';
    }

    seleccionTerritorio(cambioTerritorio);
    aplicaFiltro();
    cargaTerminada();
}