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
let paramCubo = 'edad-grupo-quinquenal';
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
    'iframeGraficoPiramide',
    'iframeGraficoTarta',
    'iframetablaDatosGenerica',
    'iframeGraficoMapa2',
    'iframeGraficoBarras',
    'iframeGraficoLinea',
    'iframeGraficoSexoCombinado',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2',
    'iframeGraficoEdadCombinado'
];
/*
	Método para aplicar filtros en el cubo de datos de edad grupo quinquenales
*/
function aplicaFiltro(territorio) {
    if (LOG_DEBUG_COMUN) {
        console.log('[aplicaFiltro]');
    }
    /* Se configura los iframes a los que les afecta los filtros */
    
    //Cambiamos el parametro territorio par que los mapas se pinten correctamente
    if(territorio) {
        aplicaFiltroTerritorio(territorio,arrayIframesMapas);
    }

    $('#criterioTerritorio').html('');
    $('#criterioPeriodo').html('');
    $('#criterioEdad').html('');
    $('#criterioSexo').html('');
    $('#criterioEdadQuinquenales').html('');

    $('#criterioTerritorio2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioEdad2').html('');
    $('#criterioSexo2').html('');
    $('#criterioEdadQuinquenales2').html('');

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPeriodo').hide();
    $('#criterioEdadQuin').hide();
    $('#pcriterioSexoQuin').hide();
    $('#pcriterioEdadQuinquenales').hide();

    $('#pcriterioTerritorio2Quin').hide();
    $('#pcriterioPeriodo2Quin').hide();
    $('#criterioEdad2Quin').hide();
    $('#pcriterioSexo2Quin').hide();
    $('#pcriterioEdadQuinquenales2').hide();

    if(territorio) {
        seleccionTerritorio(territorio);
    }

    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectEdadQuinquenalesQuin','edadQuinquenales',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'edadGruposQuinquenales');
    }
    filtroAux = aplicaFiltroElement('selectSexoQuin', 'sexo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoQuin', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioQuin', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoQuin', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioQuin', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalQuin','seccionCensalId',arrayIframes,'checkbox');
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
        console.log('inicializaDatosEdadQuinquenales');
    }

    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

    let combos = [
        'selectEdadQuinquenalesQuin',
        'selectSexoQuin',
        'selectPeriodoQuin',
        'selectMunicipioQuin',
        'selectDistritoQuin',
        'selectBarrioQuin',
        'selectSeccionCensalQuin',
        'selectTerritorioQuin',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false];

    //selectEdadQuinquenales
    obtenerComboValoresConstantes('selectEdadQuinquenalesQuin', arrayEdadesQuinquenales, 'VALORES_EDAD_QUINQUENAL', false, taskCombos, 0);

    //selectSexo
    obtenerComboValoresConstantes('selectSexoQuin', arraySexo, 'VALORES_SEXO', false, taskCombos, 1);
    
    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoQuin', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 2);
    urlIndicador1 = urlAjax;
    indicadores(urlIndicador1,'');

    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectMunicipioQuin', arrayMunicipio, urlAjax, 'checkbox' , true, taskCombos, 3);
    

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoQuin', arrayDistrito, urlAjax, 'checkbox', false, taskCombos, 4);

    obtenerCombo('selectDistritoSCQuin', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 4);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioQuin', arrayBarrio, urlAjax, 'checkbox', false, taskCombos, 5);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalQuin', arraySeccionCensal, urlAjax, 'checkbox', false, taskCombos, 6);

}

function cambioCSSEdadQuinquenales() {
    cambioCSSPlantilla();
    $('#buttonEdadQuinquenales').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    
    $('#selectMunicipioQuin .checkbox label input').prop('checked', false);
    $('#selectDistritoQuin .checkbox label input').prop('checked', false);
    $('#selectBarrioQuin .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalQuin .checkbox label input').prop('checked', false);
    $('#selectEdadQuinquenalesQuin .checkbox label input').prop('checked', false);
    $('#selectEdadQuinquenalesQuin .checkbox label input').prop('checked', false);
    $('#selectSexoQuin .checkbox label input').prop('checked', false);
    $('#selectPeriodoQuin .checkbox label input').prop('checked', false);

    $('#radioMunicipio label input').prop('checked', true);
    aplicaFiltro('municipio');
    $('#selectMunicipioQuin .checkbox label input').last().prop('checked', true);
    $('#selectPeriodoQuin .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioQuin').show();
        $('#selectMunicipioQuin .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoQuin').hide();
        quitarSeleccion('selectDistritoQuin')
        $('#selectBarrioQuin').hide();
        quitarSeleccion('selectBarrioQuin')
        $('#selectSeccionCensalQuin').hide();
        $('#selectDistritoSCQuin').hide();
        quitarSeleccion('selectSeccionCensalQuin')
    }else if(territorio=='distrito') {
        $('#selectMunicipioQuin').hide();
        quitarSeleccion('selectMunicipioQuin')
        $('#selectDistritoQuin').show();
        $('#selectDistritoQuin .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioQuin').hide();
        quitarSeleccion('selectBarrioQuin')
        $('#selectSeccionCensalQuin').hide();
        $('#selectDistritoSCQuin').hide();
        quitarSeleccion('selectSeccionCensalQuin')
    }else if(territorio=='barrio') {
        $('#selectMunicipioQuin').hide();
        quitarSeleccion('selectMunicipioQuin')
        $('#selectDistritoQuin').hide();
        quitarSeleccion('selectDistritoQuin')
        $('#selectBarrioQuin').show();
        $('#selectBarrioQuin .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalQuin').hide();
        $('#selectDistritoSCQuin').hide();
        quitarSeleccion('selectSeccionCensalQuin')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioQuin').hide();
        quitarSeleccion('selectMunicipioQuin')
        $('#selectDistritoQuin').hide();
        quitarSeleccion('selectDistritoQuin')
        $('#selectBarrioQuin').hide();
        quitarSeleccion('selectBarrioQuin')
        $('#selectSeccionCensalQuin').show();
        $('#selectDistritoSCQuin').show();
        // $('#selectSeccionCensalQuin .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
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

    filtroAux = aplicaFiltroElement('selectDistritoSCQuin', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalQuin').html('<div class="text-right"><button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalQuin\')"><i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button><button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalQuin\')"><i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem("selectSeccionCensalQuin");
        obtenerCombo('selectSeccionCensalQuin', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}