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
var ultimaKeyInd = '';
var arrayIndices = [];
var arrayPorcentajes = [];
var urlIndicador1 = '';
var filtro = '';
let arrayPeriodo = [];
let arrayMunicipio = [];
let arrayDistrito = [];
let arrayDistrito2 = [];
let arrayBarrio = [];
let arraySeccionCensal = [];
let urlAjax = '';
let arrayIframesMapas = [
    'iframeGraficoMapa',
    'iframeGraficoMapa2'
];
let arrayIframes = [
    'iframeGraficoMapa',
    'iframeGraficoMapa2',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio2',
    'iframeRadar'
];
/*
	Método para aplicar filtros en el cubo de datos indicadores
*/
function aplicaFiltro(territorio) {
    if (LOG_DEBUG_COMUN) {
        console.log('[aplicaFiltro]');
    }
    
    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if(territorio) {
        aplicaFiltroTerritorio(territorio,arrayIframesMapas);
    }

    $('#criterioTerritorio').html('');
    $('#criterioPeriodo').html('');
    $('#criterioIndicadores').html('');

    $('#criterioTerritorio2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioIndicadores2').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioIndicadores').hide();

    $('#pcriterioTerritorio2').hide();
    $('#pcriterioPeriodo2').hide();
    $('#pcriterioIndicadores2').hide();

    if(territorio) {
        seleccionTerritorio(territorio);
    }

    let medidaInd = dameMedida('selectIndicesInd');
    let medidaPor = dameMedida('selectPorcentajesInd');

    if(medidaInd.indexOf(',')==-1 && medidaPor.indexOf(',')==-1) {
        arrayIframes = [
            'iframeGraficoMapa',
            'iframeGraficoMapa2',
            'iframetablaDatosGenerica',
            'iframeComparadorTerritorio2',
            // 'iframeRadar'
        ];
        $('#iframeGraficoMapa2').show();
        $('#iframeRadar').attr('src', '');
    }else {
        arrayIframes = [
            'iframeGraficoMapa',
            // 'iframeGraficoMapa2',
            'iframetablaDatosGenerica',
            'iframeComparadorTerritorio2',
            'iframeRadar'
        ];
        $('#iframeGraficoMapa2').hide();
        $('#iframeRadar').attr('src', 'grafico_radar.html?lang=es&titulo=Indicador por territorio&operacion=SUM&ejeX2=refPeriod&ejeY=porcentajePoblacionNacidaExtranjero&municipio=28006&cubo=indicadores');
    }

    filtro = '';
    let filtroAux = '';
    let medida = '';
    filtroAux = aplicaFiltroElement('selectIndicesInd','medidaInd',arrayIframes,'checkbox');
    if(filtroAux) {
        medida = filtroAux;
    }   
    filtroAux = aplicaFiltroElement('selectPorcentajesInd','medidaPor',arrayIframes,'checkbox');
    if(filtroAux) {
        medida = filtroAux;
    } 
    filtroAux = aplicaFiltroElement('selectPeriodoInd', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioInd', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoInd', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioInd', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalInd','seccionCensalId',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    urlIndicador1 = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure='+medida+'&page=1&pageSize=100'
    );

    if(medida.indexOf(',')==-1) {
        indicadores(urlIndicador1,filtro);
    }
    
}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaIndicadores() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaIndicadores');
    }

    location.replace('indicadores.html');
}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosIndicadores');
    }
   


    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

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
    $('#selectPorcentajesInd'+ultimaKeyInd).prop('checked', true);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure='+ultimaKeyInd+'&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoInd', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 0);
    urlIndicador1 = urlAjax;
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure='+ultimaKeyInd+'&page=1&pageSize=100'
    );
    obtenerCombo('selectMunicipioInd', arrayMunicipio, urlAjax, 'checkbox', true, taskCombos, 1);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure='+ultimaKeyInd+'&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoInd', arrayDistrito, urlAjax, 'checkbox', false, taskCombos, 2);

    obtenerCombo('selectDistritoSCInd', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 4);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure='+ultimaKeyInd+'&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioInd', arrayBarrio, urlAjax, 'checkbox', false, taskCombos, 3);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure='+ultimaKeyInd+'&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalInd', arraySeccionCensal, urlAjax, 'checkbox', false, taskCombos, 4);

    cargaTerminada();

}

function cambioCSSIndicadores() {
    cambioCSSPlantilla();
    $('#buttonIndicadores').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    $('#selectMunicipioInd .checkbox label input').prop('checked', false);
    $('#selectDistritoInd .checkbox label input').prop('checked', false);
    $('#selectBarrioInd .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalInd .checkbox label input').prop('checked', false);
    $('#selectIndicesInd .checkbox label input').prop('checked', false);
    $('#selectPorcentajesInd .checkbox label input').prop('checked', false);
    $('#selectPeriodoInd .checkbox label input').prop('checked', false);

    $('#radioMunicipio label input').prop('checked', true);
    aplicaFiltro('municipio');
    $('#selectMunicipioInd .checkbox label input').last().prop('checked', true);
    $('#selectPorcentajesInd .checkbox label input').last().prop('checked', true);
    $('#selectPeriodoInd .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioInd').show();
        $('#selectMunicipioInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').hide();
        $('#selectDistritoSCInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    }else if(territorio=='distrito') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').show();
        $('#selectDistritoInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').hide();
        $('#selectDistritoSCInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    }else if(territorio=='barrio') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').show();
        $('#selectBarrioInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalInd').hide();
        $('#selectDistritoSCInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').show();
        $('#selectDistritoSCInd').hide();
        // $('#selectSeccionCensalInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}

function obtenerComboIndices(value, key, map) {

    let onclick = ' onclick="chequeaMultiple(\'selectIndicesInd\')"';
    $('#selectIndicesInd' ).append( 
        '<div class="checkbox"><label ><input type="checkbox" id="selectIndicesInd' +
        key +
            '" value="' +
            key +
            '"'+onclick+'><span id=etiqueta'+key+'>' +
            value +
            '</span></label></div>'
    );

    let componente = {
        id : key,
        title : value
    };
    arrayIndices.push(componente);
}

function obtenerComboPorcentajes(value, key, map) {

    let onclick = ' onclick="chequeaMultiple(\'selectPorcentajesInd\')"';
    $('#selectPorcentajesInd' ).append(
        '<div class="checkbox"><label ><input type="checkbox" id="selectPorcentajesInd' +
        key +
            '" value="' +
            key +
            '"'+onclick+'><span id=etiqueta'+key+'>' +
            value +
            '</span></label></div>'
    );

    ultimaKeyInd = key;
    let componente = {
        id : key,
        title : value
    };
    arrayPorcentajes.push(componente);
}

function addFiltro(paramValor, campo) {
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

    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log(
            '[addFiltro] [paramValor:' +
                paramValor +
                '] [campo:' +
                campo +
                '] [filtro:' +
                filtro +
                ']'
        );
    }
}

function dameMedida(elementoId) {
    let medida = '';
    let arrayComponente = JSON.parse(sessionStorage.getItem(elementoId));
    for(o=0;o<arrayComponente.length;o++) {
        let key = arrayComponente[o].id;
        if($('#'+elementoId+key).prop('checked')) {
            if(medida) {
                medida = medida + ',';
            }
            medida = medida + $('#'+elementoId + key).val();
        }
    }
    return medida;
}

function filtraTerritorio(territorio) {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('filtraTerritorio');
    }

    filtroAux = aplicaFiltroElement('selectDistritoSCInd', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalInd').html('<div class="text-right"><button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalEdad\')"><i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button><button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalEdad\')"><i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem("selectSeccionCensalInd");
        obtenerCombo('selectSeccionCensalInd', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}