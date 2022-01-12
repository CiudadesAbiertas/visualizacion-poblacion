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
let paramCubo = 'edad';
var urlIndicador1 = '';
var filtro = '';
let taskCombos = [false, false, false, false, false, false, false];
let arraySexo = [];
let arrayPeriodo = [];
let arrayMunicipio = [];
let arrayDistrito = [];
let arrayDistrito2 = [];
let arrayBarrio = [];
let arraySeccionCensal = [];
let arrayEdadSimple = [];
let urlAjax = '';
let arrayIframesMapas = [
    'iframeGraficoMapa',
    'iframeGraficoMapa2'
];
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
/*
	Método para aplicar filtros en el cubo de datos de edad simple
*/
function aplicaFiltro(territorio) {
    if (LOG_DEBUG_COMUN) {
        console.log('[aplicaFiltro]');
    }
    
    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if(territorio) {
        aplicaFiltroTerritorio(territorio,arrayIframesMapas);
    }
    limpiaCirterios();

    if(territorio) {
        seleccionTerritorio(territorio);
    }

    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectEdadSimpleEdad','edadSimple',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'age');
    }
    filtroAux = aplicaFiltroElement('selectSexoEdad', 'sexo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoEdad', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioEdad', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoEdad', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    // filtraTerritorio();
    filtroAux = aplicaFiltroElement('selectBarrioEdad', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalEdad','seccionCensalId',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    indicadores(urlIndicador1,filtro);
}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosEdadSimple');
    }

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

    let combos = [
        'selectEdadSimpleEdad',
        'selectSexoEdad',
        'selectPeriodoEdad',
        'selectMunicipioEdad',
        'selectDistritoEdad',
        'selectDistritoSCEdad',
        'selectBarrioEdad',
        'selectSeccionCensalEdad',
    ];

    removeSessionStorage(combos);

    //selectEdadSimple
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=age&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectEdadSimpleEdad', arrayEdadSimple, urlAjax, valores, 'checkbox', false, taskCombos, 0);

    //selectSexo
    obtenerComboValoresConstantes('selectSexoEdad', arraySexo, 'VALORES_SEXO', false, taskCombos, 1);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoEdad', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 2);
    urlIndicador1 = urlAjax;
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
    
    obtenerCombo('selectDistritoSCEdad', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 4);

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

    $('#radioMunicipio label input').prop('checked', true);
    aplicaFiltro('municipio');
    $('#selectMunicipioEdad .checkbox label input').last().prop('checked', true);
    $('#selectPeriodoEdad .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
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
        $('#selectDistritoSCEdad').hide();
        quitarSeleccion('selectSeccionCensalEdad')
    }else if(territorio=='distrito') {
        $('#selectMunicipioEdad').hide();
        quitarSeleccion('selectMunicipioEdad')
        $('#selectDistritoEdad').show();
        $('#selectDistritoEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioEdad').hide();
        quitarSeleccion('selectBarrioEdad')
        $('#selectSeccionCensalEdad').hide();
        $('#selectDistritoSCEdad').hide();
        quitarSeleccion('selectSeccionCensalEdad')
    }else if(territorio=='barrio') {
        $('#selectMunicipioEdad').hide();
        quitarSeleccion('selectMunicipioEdad')
        $('#selectDistritoEdad').hide();
        quitarSeleccion('selectDistritoEdad')
        $('#selectBarrioEdad').show();
        $('#selectBarrioEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalEdad').hide();
        $('#selectDistritoSCEdad').hide();
        quitarSeleccion('selectSeccionCensalEdad')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioEdad').hide();
        quitarSeleccion('selectMunicipioEdad')
        $('#selectDistritoEdad').hide();
        quitarSeleccion('selectDistritoEdad')
        $('#selectBarrioEdad').hide();
        quitarSeleccion('selectBarrioEdad')
        $('#selectSeccionCensalEdad').show();
        $('#selectDistritoSCEdad').show();
        // $('#selectDistritoSCEdad .checkbox').find('*').filter(':input:visible:last').prop('checked', true);
        // $('#selectSeccionCensalEdad .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
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

    filtroAux = aplicaFiltroElement('selectDistritoSCEdad', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalEdad').html('<div class="text-right"><button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalEdad\')"><i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button><button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalEdad\')"><i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem("selectSeccionCensalEdad");
        obtenerCombo('selectSeccionCensalEdad', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}

function limpiaCirterios() {
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
}