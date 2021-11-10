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
	Método para aplicar filtros en el cubo de datos de edad simple
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
        'iframeGraficoPiramide',
        'iframeGraficoTarta',
        'iframetablaDatosGenerica',
        'iframeGraficoMapa2',
        'iframeGraficoBarras',
        'iframeGraficoLinea',
        'iframeGraficoSexoCombinado',
        'iframeComparadorTerritorio',
        'iframeComparadorTerritorio2'
    ];

    $('#criterioTerritorio').html('');
    $('#criterioPeriodo').html('');
    $('#criterioEdad').html('');
    $('#criterioSexo').html('');

    $('#criterioTerritorio2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioEdad2').html('');
    $('#criterioSexo2').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioEdad').hide();
    $('#pcriterioSexo').hide();

    $('#pcriterioTerritorio2').hide();
    $('#pcriterioPeriodo2').hide();
    $('#pcriterioEdad2').hide();
    $('#pcriterioSexo2').hide();

    if(territorio) {
        seleccionTerritorio(territorio);
    }

    aplicaFiltroElement('selectEdadSimpleEdad','edadSimple',arrayIframes,'checkbox');
    aplicaFiltroElement('selectSexoEdad', 'sexo', arrayIframes,'checkbox');
    aplicaFiltroElement('selectPeriodoEdad', 'periodo', arrayIframes,'checkbox');
    aplicaFiltroElement('selectMunicipioEdad', 'municipio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectDistritoEdad', 'distrito', arrayIframes,'checkbox');
    aplicaFiltroElement('selectBarrioEdad', 'barrio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectSeccionCensalEdad','seccionCensalId',arrayIframes,'checkbox');

}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosEdadSimple');
    }

    let paramCubo = 'edad';

    let arraySexo = [];
    let arrayPeriodo = [];
    let arrayMunicipio = [];
    let arrayDistrito = [];
    let arrayBarrio = [];
    let arraySeccionCensal = [];
    let arrayEdadSimple = [];
    let urlAjax = '';

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

    let combos = [
        'selectEdadSimpleEdad',
        'selectSexoEdad',
        'selectPeriodoEdad',
        'selectMunicipioEdad',
        'selectDistritoEdad',
        'selectBarrioEdad',
        'selectSeccionCensalEdad',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false];

    //selectEdadSimple
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=age&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectEdadSimpleEdad', arrayEdadSimple, urlAjax, valores, 'checkbox', false, taskCombos, 0);

    //selectSexo
    urlAjax = dameURL(
        DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_SEXO +
            DSD_VALORES_DIMENSIONES_URL_2
    );
    obtenerComboValores('selectSexoEdad', arraySexo, urlAjax, valores2, 'checkbox', false, taskCombos, 1);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoEdad', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 2);
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectMunicipioEdad', arrayMunicipio, urlAjax, 'checkbox', true, taskCombos, 3);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoEdad', arrayDistrito, urlAjax, 'checkbox', false, taskCombos, 4);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioEdad', arrayBarrio, urlAjax, 'checkbox', false, taskCombos, 5);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalEdad', arraySeccionCensal, urlAjax, 'checkbox', false, taskCombos, 6);    

    cargaTerminada();

}

function cambioCSSEdadSimple() {
    cambioCSSPlantilla();
    $('#buttonEdadSimple').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    $('#selectMunicipioEdad .checkbox label input').prop('checked', false);
    $('#selectDistritoEdad .checkbox label input').prop('checked', false);
    $('#selectBarrioEdad .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalEdad .checkbox label input').prop('checked', false);
    $('#selectEdadSimpleEdad .checkbox label input').prop('checked', false);
    $('#selectSexoEdad .checkbox label input').prop('checked', false);
    $('#selectPeriodoEdad .checkbox label input').prop('checked', false);
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioEdad').show();
        $('#selectMunicipioEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoEdad').hide();
        quitarSeleccion('selectDistritoEdad')
        $('#selectBarrioEdad').hide();
        quitarSeleccion('selectBarrioEdad')
        $('#selectSeccionCensalEdad').hide();
        quitarSeleccion('selectSeccionCensalEdad')
    }else if(territorio=='distrito') {
        $('#selectMunicipioEdad').hide();
        quitarSeleccion('selectMunicipioEdad')
        $('#selectDistritoEdad').show();
        $('#selectDistritoEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioEdad').hide();
        quitarSeleccion('selectBarrioEdad')
        $('#selectSeccionCensalEdad').hide();
        quitarSeleccion('selectSeccionCensalEdad')
    }else if(territorio=='barrio') {
        $('#selectMunicipioEdad').hide();
        quitarSeleccion('selectMunicipioEdad')
        $('#selectDistritoEdad').hide();
        quitarSeleccion('selectDistritoEdad')
        $('#selectBarrioEdad').show();
        $('#selectBarrioEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalEdad').hide();
        quitarSeleccion('selectSeccionCensalEdad')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioEdad').hide();
        quitarSeleccion('selectMunicipioEdad')
        $('#selectDistritoEdad').hide();
        quitarSeleccion('selectDistritoEdad')
        $('#selectBarrioEdad').hide();
        quitarSeleccion('selectBarrioEdad')
        $('#selectSeccionCensalEdad').show();
        $('#selectSeccionCensalEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}