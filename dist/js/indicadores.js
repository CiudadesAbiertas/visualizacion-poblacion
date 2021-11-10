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

var ultimaKeyInd = '';
var  arrayIndices = [];
var  arrayPorcentajes = [];
/*
	Método para aplicar filtros en el cubo de datos indicadores
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
        'iframetablaDatosGenerica',
        'iframeComparadorTerritorio2'
    ];

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

    aplicaFiltroElement('selectIndicesInd','medidaInd',arrayIframes,'checkbox');
    aplicaFiltroElement('selectPorcentajesInd','medidaPor',arrayIframes,'checkbox');
    aplicaFiltroElement('selectPeriodoInd', 'periodo', arrayIframes,'checkbox');
    aplicaFiltroElement('selectMunicipioInd', 'municipio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectDistritoInd', 'distrito', arrayIframes,'checkbox');
    aplicaFiltroElement('selectBarrioInd', 'barrio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectSeccionCensalInd','seccionCensalId',arrayIframes,'checkbox');

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

    let paramCubo = 'indicadores';

    
    let arrayPeriodo = [];
    let arrayMunicipio = [];
    let arrayDistrito = [];
    let arrayBarrio = [];
    let arraySeccionCensal = [];
    let urlAjax = '';

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
    $('#selectIndicadoresInd .checkbox label input').prop('checked', false);
    $('#selectPeriodoInd .checkbox label input').prop('checked', false);
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
        quitarSeleccion('selectSeccionCensalInd')
    }else if(territorio=='distrito') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').show();
        $('#selectDistritoInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    }else if(territorio=='barrio') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').show();
        $('#selectBarrioInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalInd').hide();
        quitarSeleccion('selectSeccionCensalInd')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioInd').hide();
        quitarSeleccion('selectMunicipioInd')
        $('#selectDistritoInd').hide();
        quitarSeleccion('selectDistritoInd')
        $('#selectBarrioInd').hide();
        quitarSeleccion('selectBarrioInd')
        $('#selectSeccionCensalInd').show();
        $('#selectSeccionCensalInd .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}

function obtenerComboIndices(value, key, map) {

    $('#selectIndicesInd' ).append(
        '<div class="checkbox"><label ><input type="checkbox" id="selectIndicesInd' +
        key +
            '" value="' +
            key +
            '"><span id=etiqueta'+key+'>' +
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

    $('#selectPorcentajesInd' ).append(
        '<div class="checkbox"><label ><input type="checkbox" id="selectPorcentajesInd' +
        key +
            '" value="' +
            key +
            '"><span id=etiqueta'+key+'>' +
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