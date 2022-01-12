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
    'iframeGraficoMapa2'
];
let arrayIframes = [
    'iframeGraficoMapa',
    'iframeGraficoMapa2',
    'iframeGraficoPiramide',
    'iframeGraficoBarras',
    'iframeGraficoTarta',
    'iframeGraficoLinea',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2'
];
/*
	Método para aplicar filtros en el cubo de datos nacionalidad
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

    if(territorio) {
        seleccionTerritorio(territorio);
    }
    
    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectNacionalidadNac','nacionalidad',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'nacionalidad');
    }
	filtroAux = aplicaFiltroElement('selectEdadQuinquenalesNac','edadQuinquenales',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'edadGruposQuinquenales');
    }
    filtroAux = aplicaFiltroElement('selectSexoNac', 'sexo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoNac', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioNac', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoNac', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioNac', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalNac','seccionCensalId',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    indicadores(urlIndicador1,filtro);
}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaNacionalidad() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaNacionalidad');
    }

    location.replace('nacionalidad.html');
}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosNacionalidad');
    }



    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

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
	obtenerComboValoresConstantes('selectNacionalidadNac', arrayNacionalidad, 'VALORES_NACIONALIDAD', false, taskCombos, 0);

    //selectEdadQuinquenales
    obtenerComboValoresConstantes('selectEdadQuinquenalesNac', arrayEdadesQuinquenales, 'VALORES_EDAD_QUINQUENAL', false, taskCombos, 1);

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
    obtenerCombo('selectMunicipioNac', arrayMunicipio, urlAjax, 'checkbox', true, taskCombos, 4);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoNac', arrayDistrito, urlAjax, 'checkbox', false, taskCombos, 5);

    obtenerCombo('selectDistritoSCNac', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 5);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioNac', arrayBarrio, urlAjax, 'checkbox', false, taskCombos, 6);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalNac', arraySeccionCensal, urlAjax, 'checkbox', false, taskCombos, 7);

    cargaTerminada();

}

function cambioCSSNacionalidad() {
    cambioCSSPlantilla();
    $('#buttonNacionalidad').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    $('#selectMunicipioNac .checkbox label input').prop('checked', false);
    $('#selectDistritoNac .checkbox label input').prop('checked', false);
    $('#selectBarrioNac .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalNac .checkbox label input').prop('checked', false);
    $('#selectNacionalidadNac .checkbox label input').prop('checked', false);
	$('#selectEdadQuinquenalesNac .checkbox label input').prop('checked', false);
    $('#selectSexoNac .checkbox label input').prop('checked', false);
    $('#selectPeriodoNac .checkbox label input').prop('checked', false);

    $('#radioMunicipio label input').prop('checked', true);
    aplicaFiltro('municipio');
    $('#selectMunicipioNac .checkbox label input').last().prop('checked', true);
    $('#selectPeriodoNac .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioNac').show();
        $('#selectMunicipioNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoNac').hide();
        quitarSeleccion('selectDistritoNac')
        $('#selectBarrioNac').hide();
        quitarSeleccion('selectBarrioNac')
        $('#selectSeccionCensalNac').hide();
        $('#selectDistritoSCNac').hide();
        quitarSeleccion('selectSeccionCensalNac')
    }else if(territorio=='distrito') {
        $('#selectMunicipioNac').hide();
        quitarSeleccion('selectMunicipioNac')
        $('#selectDistritoNac').show();
        $('#selectDistritoNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioNac').hide();
        quitarSeleccion('selectBarrioNac')
        $('#selectSeccionCensalNac').hide();
        $('#selectDistritoSCNac').hide();
        quitarSeleccion('selectSeccionCensalNac')
    }else if(territorio=='barrio') {
        $('#selectMunicipioNac').hide();
        quitarSeleccion('selectMunicipioNac')
        $('#selectDistritoNac').hide();
        quitarSeleccion('selectDistritoNac')
        $('#selectBarrioNac').show();
        $('#selectBarrioNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalNac').hide();
        $('#selectDistritoSCNac').hide();
        quitarSeleccion('selectSeccionCensalNac')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioNac').hide();
        quitarSeleccion('selectMunicipioNac')
        $('#selectDistritoNac').hide();
        quitarSeleccion('selectDistritoNac')
        $('#selectBarrioNac').hide();
        quitarSeleccion('selectBarrioNac')
        $('#selectSeccionCensalNac').show();
        $('#selectDistritoSCNac').show();
        // $('#selectSeccionCensalNac .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
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

    filtroAux = aplicaFiltroElement('selectDistritoSCNac', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalNac').html('<div class="text-right"><button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalNac\')"><i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button><button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalNac\')"><i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem("selectSeccionCensalNac");
        obtenerCombo('selectSeccionCensalNac', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}