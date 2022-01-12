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
var urlIndicador1 = '';
var filtro = '';
let paramCubo = 'estudios';
let arrayPeriodo = [];
let arrayNivelEstudios = [];
let arrayEdadSimple = [];
let arraySexo = [];
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
    'iframeGraficoNivelEstudioCombinado',
    'iframeGraficoLinea',
    'iframeGraficoBarras',
    'iframeGraficoTarta',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2'
];
/*
	Método para aplicar filtros en el cubo de datos de indicadores
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
    
    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectNivelEstudioEst', 'nivelEstudio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'tipoNivelEstudio');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoEst', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioEst', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoEst', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioEst', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalEst','seccionCensalId',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }
    filtroAux = aplicaFiltroElement('selectSexoEst', 'sexo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectEdadSimpleEst','edadSimple',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'age');
    }

    indicadores(urlIndicador1,filtro);
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
    obtenerComboValoresConstantes('selectNivelEstudioEst', arrayNivelEstudios, 'VALORES_NIVEL_ESTUDIOS', false, taskCombos, 0);

    //selectEdadSimple
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=age&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectEdadSimpleEst', arrayEdadSimple, urlAjax, valores, 'checkbox',  false, taskCombos, 1);

    //selectSexo
    obtenerComboValoresConstantes('selectSexoEst', arraySexo, 'VALORES_SEXO', false, taskCombos, 2);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoEst', arrayPeriodo, urlAjax, valores, 'checkbox',  true, taskCombos, 3);
    urlIndicador1 = urlAjax;
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

    obtenerCombo('selectDistritoSCEst', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 5);

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
    $('#selectMunicipioEst .checkbox label input').prop('checked', false);
    $('#selectDistritoEst .checkbox label input').prop('checked', false);
    $('#selectBarrioEst .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalEst .checkbox label input').prop('checked', false);
    $('#selectNivelEstudioEst .checkbox label input').prop('checked', false);
    $('#selectEdadSimpleEst .checkbox label input').prop('checked', false);
    $('#selectSexoEst .checkbox label input').prop('checked', false);
    $('#selectPeriodoEst .checkbox label input').prop('checked', false);

    $('#radioMunicipio label input').prop('checked', true);
    aplicaFiltro('municipio');
    $('#selectMunicipioEst .checkbox label input').last().prop('checked', true);
    $('#selectPeriodoEst .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
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
        $('#selectDistritoSCEst').hide();
        quitarSeleccion('selectSeccionCensalEst')
    }else if(territorio=='distrito') {
        $('#selectMunicipioEst').hide();
        quitarSeleccion('selectMunicipioEst')
        $('#selectDistritoEst').show();
        $('#selectDistritoEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioEst').hide();
        quitarSeleccion('selectBarrioEst')
        $('#selectSeccionCensalEst').hide();
        $('#selectDistritoSCEst').hide();
        quitarSeleccion('selectSeccionCensalEst')
    }else if(territorio=='barrio') {
        $('#selectMunicipioEst').hide();
        quitarSeleccion('selectMunicipioEst')
        $('#selectDistritoEst').hide();
        quitarSeleccion('selectDistritoEst')
        $('#selectBarrioEst').show();
        $('#selectBarrioEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalEst').hide();
        $('#selectDistritoSCEst').hide();
        quitarSeleccion('selectSeccionCensalEst')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioEst').hide();
        quitarSeleccion('selectMunicipioEst')
        $('#selectDistritoEst').hide();
        quitarSeleccion('selectDistritoEst')
        $('#selectBarrioEst').hide();
        quitarSeleccion('selectBarrioEst')
        $('#selectSeccionCensalEst').show();
        $('#selectDistritoSCEst').hide();
        // $('#selectSeccionCensalEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
    }

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

function filtraTerritorio(territorio) {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('filtraTerritorio');
    }

    filtroAux = aplicaFiltroElement('selectDistritoSCEst', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalEst').html('<div class="text-right"><button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalEdad\')"><i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button><button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalEdad\')"><i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem("selectSeccionCensalEst");
        obtenerCombo('selectSeccionCensalEst', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}