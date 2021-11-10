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
	Método para aplicar filtros en el cubo de datos de indicadores
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
    //Iframes particulares de nivel de estudio
    let arrayIframes = [
        'iframeGraficoMapa',
        'iframeGraficoMapa2',
        'iframeGraficoNivelEstudioCombinado',
        'iframeGraficoLinea',
        'iframeGraficoBarras',
        'iframeGraficoTarta',
        'iframetablaDatosGenerica',
        'iframeComparadorTerritorio',
        'iframeComparadorTerritorio2'
    ];
    
    $('#criterioTerritorio').html('');
    $('#criterioNivelEstudio').html('');
    $('#criterioPeriodo').html('');
    $('#criterioEdad').html('');
    $('#criterioSexo').html('');

    $('#criterioTerritorio2').html('');
    $('#criterioNivelEstudio2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioEdad2').html('');
    $('#criterioSexo2').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioNivelEstudio').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioEdad').hide();
    $('#pcriterioSexo').hide();

    $('#pcriterioTerritorio2').hide();
    $('#pcriterioNivelEstudio2').hide();
    $('#pcriterioPeriodo2').hide();
    $('#pcriterioEdad2').hide();
    $('#pcriterioSexo2').hide();

    if(territorio) {
        seleccionTerritorio(territorio);
    }
    
    aplicaFiltroElement('selectNivelEstudioEst', 'nivelEstudio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectPeriodoEst', 'periodo', arrayIframes,'checkbox');
    aplicaFiltroElement('selectMunicipioEst', 'municipio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectDistritoEst', 'distrito', arrayIframes,'checkbox');
    aplicaFiltroElement('selectBarrioEst', 'barrio', arrayIframes,'checkbox');
    aplicaFiltroElement('selectSeccionCensalEst','seccionCensalId',arrayIframes,'checkbox');

    
}

/* 
	Función que permite cambiar a la capa  del cubo
*/
function cambioCapaNivelEstudio() {
    if (LOG_DEBUG_COMUN) {
        console.log('[cambioCapaNivelEstudio]');
    }

    location.replace('nivel_estudio.html');
}

/*
	Función que iniciliza los datos
*/
function inicializaDatosNivelEstudios() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosNivelesEstudio');
    }
    
    let paramCubo = 'estudios';
    let arrayPeriodo = [];
    let arrayNivelEstudios = [];
    let arrayEdadSimple = [];
    let arraySexo = [];
    let arrayMunicipio = [];
    let arrayDistrito = [];
    let arrayBarrio = [];
    let arraySeccionCensal = [];
    let urlAjax = '';

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

    let combos = [
      "selectNivelEstudioEst",
      "selectPeriodoEst",
      "selectMunicipioEst",
      "selectDistritoEst",
      "selectBarrioEst",
      "selectSeccionCensalEst",
      "selectSexoEst",
      "selectEdadSimpleEst",
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false, false];

    //selectNivelEstudio
    urlAjax = dameURL(
        DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_NIVEL_ESTUDIOS +
            DSD_VALORES_DIMENSIONES_URL_2
    );
    obtenerComboValores('selectNivelEstudioEst', arrayNivelEstudios, urlAjax, valores2, 'checkbox', false, taskCombos, 0);

    //selectEdadSimple
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=age&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectEdadSimpleEst', arrayEdadSimple, urlAjax, valores, 'checkbox',  false, taskCombos, 1);

    //selectSexo
    urlAjax = dameURL(
        DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_SEXO +
            DSD_VALORES_DIMENSIONES_URL_2
    );
    obtenerComboValores('selectSexoEst', arraySexo, urlAjax, valores2, 'checkbox',  false, taskCombos, 2);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoEst', arrayPeriodo, urlAjax, valores, 'checkbox',  true, taskCombos, 3);
    indicadores(urlAjax);

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectMunicipioEst', arrayMunicipio, urlAjax, 'checkbox',  true, taskCombos,  4);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoEst', arrayDistrito, urlAjax, 'checkbox',  false, taskCombos, 5);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioEst', arrayBarrio, urlAjax, 'checkbox',  false, taskCombos, 6);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalEst', arraySeccionCensal, urlAjax, 'checkbox', taskCombos, 7);

    cargaTerminada();
}

function cambioCSSNivelEstudio() {
    cambioCSSPlantilla();
    $('#buttonNivelEstudio').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    $('#selectMunicipio .checkbox label input').prop('checked', false);
    $('#selectDistrito .checkbox label input').prop('checked', false);
    $('#selectBarrio .checkbox label input').prop('checked', false);
    $('#selectSeccionCensal .checkbox label input').prop('checked', false);
    $('#selectNivelEstudio .checkbox label input').prop('checked', false);
    $('#selectPeriodo .checkbox label input').prop('checked', false);
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioEst').show();
        $('#selectMunicipioEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoEst').hide();
        quitarSeleccion('selectDistritoEst')
        $('#selectBarrioEst').hide();
        quitarSeleccion('selectBarrioEst')
        $('#selectSeccionCensalEst').hide();
        quitarSeleccion('selectSeccionCensalEst')
    }else if(territorio=='distrito') {
        $('#selectMunicipioEst').hide();
        quitarSeleccion('selectMunicipioEst')
        $('#selectDistritoEst').show();
        $('#selectDistritoEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioEst').hide();
        quitarSeleccion('selectBarrioEst')
        $('#selectSeccionCensalEst').hide();
        quitarSeleccion('selectSeccionCensalEst')
    }else if(territorio=='barrio') {
        $('#selectMunicipioEst').hide();
        quitarSeleccion('selectMunicipioEst')
        $('#selectDistritoEst').hide();
        quitarSeleccion('selectDistritoEst')
        $('#selectBarrioEst').show();
        $('#selectBarrioEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalEst').hide();
        quitarSeleccion('selectSeccionCensalEst')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioEst').hide();
        quitarSeleccion('selectMunicipioEst')
        $('#selectDistritoEst').hide();
        quitarSeleccion('selectDistritoEst')
        $('#selectBarrioEst').hide();
        quitarSeleccion('selectBarrioEst')
        $('#selectSeccionCensalEst').show();
        $('#selectSeccionCensalEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

}