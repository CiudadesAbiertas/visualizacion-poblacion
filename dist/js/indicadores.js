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
let paramCubo = 'indicadores';
let ultimaKeyInd = '';
let primeraKeyInd = '';
let arrayIndices = [];
let arrayPorcentajes = [];
let urlIndicador1 = '';
let filtro = '';
let arrayPeriodo = [];
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
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio2',
    'iframeRadar'
];
let cambioTerritorio = '';

/*
    Método para aplicar filtros en el cubo de datos indicadores
*/
function aplicaFiltro() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [aplicaFiltro]');
    }

    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if (cambioTerritorio) {
        aplicaFiltroTerritorio(cambioTerritorio, arrayIframesMapas, true);
        cambioTerritorio = '';
    }

    $('#criterioTerritorio').html('');
    $('#criterioPeriodo').html('');
    $('#criterioIndicadores').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioIndicadores').hide();

    let medidaInd = dameMedida('selectIndicesInd');
    let medidaPor = dameMedida('selectPorcentajesInd');

    if (medidaInd.indexOf(',') == -1 && medidaPor.indexOf(',') == -1) {
        arrayIframes = [
            'iframeGraficoMapa',
            'iframeGraficoMapaComp',
            'iframetablaDatosGenerica',
            'iframeComparadorTerritorio2',
        ];
        $('#iframeGraficoMapaComp').show();
        $('#iframeRadar').attr('src', '');
        $('#capaGraficoRadar').hide();
    } else {
        arrayIframes = [
            'iframeGraficoMapa',
            'iframetablaDatosGenerica',
            'iframeComparadorTerritorio2',
            'iframeRadar'
        ];
        $('#iframeGraficoMapaComp').hide();
        $('#iframeRadar').attr('src', 'grafico_radar.html?lang=es&titulo=indicador_territorio&operacion=SUM' +
            '&ejeX2=refPeriod&ejeY=porcentajePoblacionNacidaExtranjero&municipio=28006&cubo=indicadores&iframe=iframeRadar');
        $('#capaGraficoRadar').show();
    }

    filtro = '';
    let filtroAux = '';
    let medida = '';
    let filtroMunicipio = '';
    filtroAux = aplicaFiltroElement('selectIndicesInd', 'medidaInd', arrayIframes, 'checkbox');
    if (filtroAux) {
        medida = filtroAux;
    }
    filtroAux = aplicaFiltroElement('selectPorcentajesInd', 'medidaPor', arrayIframes, 'checkbox');
    if (filtroAux) {
        medida = filtroAux;
    }
    filtroAux = aplicaFiltroElement('selectPeriodoInd', 'periodo', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioInd', 'municipio', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'municipioId');
        filtroMunicipio = ' and distritoId=null and barrioId=null and seccionCensalId=null';
    }
    filtroAux = aplicaFiltroElement('selectDistritoInd', 'distrito', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioInd', 'barrio', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalInd', 'seccionCensalId', arrayIframes, 'checkbox');
    if (filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    urlIndicador1 = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=refPeriod&group=SUM&measure=' + medida + '&page=1&pageSize=100'
    );

    if (medida.indexOf(',') == -1) {
        indicadores(urlIndicador1, filtro + filtroMunicipio, true);
    }

    let esMultiple = chequeaMultiple('selectPeriodoInd') || chequeaMultiple('selectDistritoInd')
        || chequeaMultiple('selectBarrioInd') || chequeaMultiple('selectSeccionCensalInd')
        || chequeaMultiple('selectMunicipioInd') || chequeaMultiple('selectDistritoSCInd')
        || chequeaMultiple('selectIndicesInd') || chequeaMultiple('selectPorcentajesInd');
    if (esMultiple) {
        deshabilitaTerritorio();
    } else {
        habilitaTerritorio();
    }

}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaIndicadores() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [cambioCapaIndicadores]');
    }

    location.replace('indicadores.html');
}

/*
    Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [inicializaDatos]');
    }

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax

    let combos = [
        'selectIndicesInd',
        'selectPorcentajesInd',
        'selectPeriodoInd',
        'selectMunicipioInd',
        'selectDistritoInd',
        'selectBarrioInd',
        'selectSeccionCensalInd',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false];

    //selectIndicadores
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=refPeriod&measure=indiceDependencia&group=AVG&page=1&pageSize=100'
    );

    ETIQUETAS_INDICES_DSD.forEach(obtenerComboIndices);
    ETIQUETAS_PORCENTAJES_DSD.forEach(obtenerComboPorcentajes);
    sessionStorage.setItem('selectIndicesInd', JSON.stringify(arrayIndices));
    sessionStorage.setItem('selectPorcentajesInd', JSON.stringify(arrayPorcentajes));
    $('#selectPorcentajesInd' + primeraKeyInd).prop('checked', true);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=refPeriod&group=SUM&measure=' + primeraKeyInd + '&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoInd', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 0);
    urlIndicador1 = urlAjax;
    // indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=municipioId,municipioTitle&group=SUM&measure=' + primeraKeyInd + '&page=1&pageSize=100'
    );
    let chequeaUltimo = ('Municipio'.indexOf(FILTRO_SLIDER_TERRITORIO_INDICADORES[0]) != -1);
    obtenerCombo('selectMunicipioInd', arrayMunicipio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 1);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=distritoId,distritoTitle&group=SUM&measure=' + primeraKeyInd + '&page=1&pageSize=100'
    );
    chequeaUltimo = ('Distrito'.indexOf(FILTRO_SLIDER_TERRITORIO_INDICADORES[0]) != -1);
    obtenerCombo('selectDistritoInd', arrayDistrito, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 2);

    obtenerCombo('selectDistritoSCInd', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 4);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=barrioId,barrioTitle&group=SUM&measure=' + primeraKeyInd + '&page=1&pageSize=100'
    );
    chequeaUltimo = ('Barrio'.indexOf(FILTRO_SLIDER_TERRITORIO_INDICADORES[0]) != -1);
    obtenerCombo('selectBarrioInd', arrayBarrio, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 3);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=' +
        primeraKeyInd +
        '&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    chequeaUltimo = ('Sección Censal'.indexOf(FILTRO_SLIDER_TERRITORIO_INDICADORES[0]) != -1);
    obtenerCombo('selectSeccionCensalInd', arraySeccionCensal, urlAjax, 'checkbox', chequeaUltimo, taskCombos, 4);

}

function cambioCSSIndicadores() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [cambioCSSIndicadores]');
    }

    cambioCSSPlantilla();
    $('#buttonIndicadores').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [quitaSeleccionTodos]');
    }

    $('#selectMunicipioInd .checkbox label input').prop('checked', false);
    $('#selectDistritoInd .checkbox label input').prop('checked', false);
    $('#selectBarrioInd .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalInd .checkbox label input').prop('checked', false);
    $('#selectIndicesInd .checkbox label input').prop('checked', false);
    $('#selectPorcentajesInd .checkbox label input').prop('checked', false);
    $('#selectPeriodoInd .checkbox label input').prop('checked', false);

    if (FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        seleccionTerritorio('municipio')
    } else if (FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        seleccionTerritorio('distrito')
    } else if (FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        seleccionTerritorio('barrio')
    } else if (FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        seleccionTerritorio('seccion_censal')
    }
    $('#selectPorcentajesInd .checkbox label input').first().prop('checked', true);
    $('#selectPeriodoInd .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [seleccionTerritorio]');
    }

    cambioTerritorio = territorio;
    if (territorio == 'municipio') {
        $('#selectMunicipioInd').show();
        $('#selectMunicipioInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').hide();
        $('#selectDistritoSCInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    } else if (territorio == 'distrito') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').show();
        $('#selectDistritoInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').hide();
        $('#selectDistritoSCInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    } else if (territorio == 'barrio') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').show();
        $('#selectBarrioInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalInd').hide();
        $('#selectDistritoSCInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    } else if (territorio == 'seccion_censal') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').show();
        $('#selectDistritoSCInd').hide();
        $('#selectSeccionCensalInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}

function obtenerComboIndices(value, key, map) {

    $('#selectIndicesInd').append(
        '<div class="checkbox"><label ><input type="checkbox" id="selectIndicesInd' +
        key +
        '" value="' +
        key +
        '"><span id=etiqueta' + key + '>' +
        value +
        '</span></label></div>'
    );

    let componente = {
        id: key,
        title: value
    };
    arrayIndices.push(componente);
}

function obtenerComboPorcentajes(value, key, map) {

    $('#selectPorcentajesInd').append(
        '<div class="checkbox"><label ><input type="checkbox" id="selectPorcentajesInd' +
        key +
        '" value="' +
        key +
        '"><span id=etiqueta' + key + '>' +
        value +
        '</span></label></div>'
    );
    if(!primeraKeyInd) {
        primeraKeyInd = key;
    }
    ultimaKeyInd = key;
    let componente = {
        id: key,
        title: value
    };
    arrayPorcentajes.push(componente);
}

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_INDICADORES) {
        console.log(
            '[indicadores] [addFiltro] [paramValor:' +
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

    if (LOG_DEBUG_INDICADORES) {
        console.log("[indicadores] [addFiltro] [filtro:" + filtro + "]");
    }
}

function dameMedida(elementoId) {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [dameMedida]');
    }

    let medida = '';
    let arrayComponente = JSON.parse(sessionStorage.getItem(elementoId));
    for (o = 0; o < arrayComponente.length; o++) {
        let key = arrayComponente[o].id;
        if ($('#' + elementoId + key).prop('checked')) {
            if (medida) {
                medida = medida + ',';
            }
            medida = medida + $('#' + elementoId + key).val();
        }
    }
    return medida;
}

function filtraTerritorio() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [filtraTerritorio]');
    }

    filtroAux = aplicaFiltroElement('selectDistritoSCInd', 'distrito', arrayIframes, 'checkbox');
    if (filtroAux) {
        filtro = '';
        $('#selectSeccionCensalInd').html('<div class="text-right">' +
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
        sessionStorage.removeItem('selectSeccionCensalInd');
        obtenerCombo('selectSeccionCensalInd', arraySeccionCensal, urlAjax, 'checkbox', false, null);
    }
}

function inicializaInicio() {
    if (LOG_DEBUG_INDICADORES) {
        console.log('[indicadores] [filtraTerritorio]');
    }
    
    if(FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Municipio') {
        $('#radioOptMunicipio').prop('checked', true);
        cambioTerritorio = 'municipio';
    }else if(FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Distrito') {
        $('#radioOptDistrito').prop('checked', true);
        cambioTerritorio = 'distrito';
    }else if(FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Barrio') {
        $('#radioOptBarrio').prop('checked', true);
        cambioTerritorio = 'barrio';
    }else if(FILTRO_SLIDER_TERRITORIO_INDICADORES[0] == 'Sección Censal') {
        $('#radioOptSeccion').prop('checked', true);
        cambioTerritorio = 'seccion_censal';
    }

    seleccionTerritorio(cambioTerritorio);
    aplicaFiltro();
    cargaTerminada();
}