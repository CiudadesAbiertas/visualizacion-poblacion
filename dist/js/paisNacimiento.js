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
let paramCubo = 'pais-nacimiento';
let arrayPaisNacimiento = [];
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
    'iframeGraficoBarras',		
    'iframeGraficoPiramide',		
    'iframeGraficoPiramide2',	
    'iframeGraficoLinea',		
    'iframeGraficoSexoCombinado',		
    'iframeGraficoTarta',
    'iframetablaDatosGenerica',
    'iframeComparadorTerritorio',
    'iframeComparadorTerritorio2'
];
/*
	Método para aplicar filtros en el cubo de datos pais de nacimiento
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
    $('#criterioPaisNac').html('');
    $('#criterioPeriodo').html('');
    $('#criterioEdadQuinquenales').html('');
    $('#criterioSexo').html('');   

    $('#criterioTerritorio2').html('');
    $('#criterioPaisNac2').html('');
    $('#criterioPeriodo2').html('');
    $('#criterioEdadQuinquenales2').html('');
    $('#criterioSexo2').html('');   

    $('#pcriterioTerritorio').hide();
    $('#pcriterioPaisNac').hide();
    $('#pcriterioPeriodo').hide();
    $('#pcriterioEdadQuinquenales').hide();
    $('#pcriterioSexo').hide();

    $('#pcriterioTerritorio2').hide();
    $('#pcriterioPaisNac2').hide();
    $('#pcriterioPeriodo2').hide();
    $('#pcriterioEdadQuinquenales2').hide();
    $('#pcriterioSexo2').hide();

    if(territorio) {
        seleccionTerritorio(territorio);
    }

    filtro = '';
    let filtroAux = '';
    filtroAux = aplicaFiltroElement('selectPaisNacimientoPais','paisNacimiento',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'paisNacimiento');
    }
	filtroAux = aplicaFiltroElement('selectEdadQuinquenalesPais','edadQuinquenales',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'edadGruposQuinquenales');
    }
    filtroAux = aplicaFiltroElement('selectSexoPais', 'sexo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'sex');
    }
    filtroAux = aplicaFiltroElement('selectPeriodoPais', 'periodo', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'refPeriod');
    }
    filtroAux = aplicaFiltroElement('selectMunicipioPais', 'municipio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'municipioId');
    }
    filtroAux = aplicaFiltroElement('selectDistritoPais', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'distritoId');
    }
    filtroAux = aplicaFiltroElement('selectBarrioPais', 'barrio', arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'barrioId');
    }
    filtroAux = aplicaFiltroElement('selectSeccionCensalPais','seccionCensalId',arrayIframes,'checkbox');
    if(filtroAux) {
        addFiltro(filtroAux, 'seccionCensalId');
    }

    indicadores(urlIndicador1,filtro);
}

/* 
Función que permite cambiar a la capa  del cubo
*/
function cambioCapaPaisNacimiento() {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapaPaisNacimiento');
    }

    location.replace('pais_nacimiento.html');
}

/*
	Función que iniciliza los datos
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('inicializaDatosPaisNacimiento');
    }



    let valores = [0, 0]; //Campos para recoger la información del objeto data del ajax
    let valores2 = ['id', 'title'];

    let combos = [
        'selectPaisNacimientoPais',
		'selectEdadQuinquenalesPais',
        'selectSexoPais',
        'selectPeriodoPais',
        'selectMunicipioPais',
        'selectDistritoPais',
        'selectBarrioPais',
        'selectSeccionCensalPais',
    ];

    removeSessionStorage(combos);

    let taskCombos = [false, false, false, false, false, false, false, false];

    //selectPaisNacimiento
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=paisNacimiento&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPaisNacimientoPais', arrayPaisNacimiento, urlAjax, valores, 'checkbox', false, taskCombos, 0);
	
    //selectEdadQuinquenales
    obtenerComboValoresConstantes('selectEdadQuinquenalesPais', arrayEdadesQuinquenales, 'VALORES_EDAD_QUINQUENAL', false, taskCombos, 1);

    //selectSexo
    obtenerComboValoresConstantes('selectSexoPais', arraySexo, 'VALORES_SEXO', false, taskCombos, 2);

    //selectPeriodo
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerComboValores('selectPeriodoPais', arrayPeriodo, urlAjax, valores, 'checkbox', true, taskCombos, 3);
    urlIndicador1 = urlAjax;
    indicadores(urlAjax);
    
    //selectMunicipio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=municipioId,municipioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectMunicipioPais', arrayMunicipio, urlAjax, 'checkbox', true, taskCombos, 4);

    //selectDistrito
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=distritoId,distritoTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectDistritoPais', arrayDistrito, urlAjax, 'checkbox', false, taskCombos, 5);

    obtenerCombo('selectDistritoSCPais', arrayDistrito2, urlAjax, 'checkbox', false, taskCombos, 5);

    //selectBarrio
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=barrioId,barrioTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
    );
    obtenerCombo('selectBarrioPais', arrayBarrio, urlAjax, 'checkbox', false, taskCombos, 6);

    //selectSeccionCensal
    urlAjax = dameURL(
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&where=seccionCensalId!=null&page=1&pageSize=100'
    );
    obtenerCombo('selectSeccionCensalPais', arraySeccionCensal, urlAjax, 'checkbox', false, taskCombos, 7);

    cargaTerminada();

}

function cambioCSSPaisNacimiento() {
    cambioCSSPlantilla();
    $('#buttonPaisNacimiento').css('font-weight', 'bold');
}

function quitaSeleccionTodos() {
    $('#selectMunicipioPais .checkbox label input').prop('checked', false);
    $('#selectDistritoPais .checkbox label input').prop('checked', false);
    $('#selectBarrioPais .checkbox label input').prop('checked', false);
    $('#selectSeccionCensalPais .checkbox label input').prop('checked', false);
    $('#selectPaisNacimientoPais .checkbox label input').prop('checked', false);
	$('#selectEdadQuinquenalesPais .checkbox label input').prop('checked', false);
    $('#selectSexoPais .checkbox label input').prop('checked', false);
    $('#selectPeriodoPais .checkbox label input').prop('checked', false);

    $('#radioMunicipio label input').prop('checked', true);
    aplicaFiltro('municipio');
    $('#selectMunicipioPais .checkbox label input').last().prop('checked', true);
    $('#selectPeriodoPais .checkbox label input').first().prop('checked', true);
    habilitaTerritorio();
}

function seleccionTerritorio(territorio) {
    if(territorio=='municipio') {
        $('#selectMunicipioPais').show();
        $('#selectMunicipioPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectDistritoPais').hide();
        quitarSeleccion('selectDistritoPais')
        $('#selectBarrioPais').hide();
        quitarSeleccion('selectBarrioPais')
        $('#selectSeccionCensalPais').hide();
        $('#selectDistritoSCPais').hide();
        quitarSeleccion('selectSeccionCensalPais')
    }else if(territorio=='distrito') {
        $('#selectMunicipioPais').hide();
        quitarSeleccion('selectMunicipioPais')
        $('#selectDistritoPais').show();
        $('#selectDistritoPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectBarrioPais').hide();
        quitarSeleccion('selectBarrioPais')
        $('#selectSeccionCensalPais').hide();
        $('#selectDistritoSCPais').hide();
        quitarSeleccion('selectSeccionCensalPais')
    }else if(territorio=='barrio') {
        $('#selectMunicipioPais').hide();
        quitarSeleccion('selectMunicipioPais')
        $('#selectDistritoPais').hide();
        quitarSeleccion('selectDistritoPais')
        $('#selectBarrioPais').show();
        $('#selectBarrioPais .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
        $('#selectSeccionCensalPais').hide();
        $('#selectDistritoSCPais').hide();
        quitarSeleccion('selectSeccionCensalPais')
    }else if(territorio=='seccion_censal') {
        $('#selectMunicipioPais').hide();
        quitarSeleccion('selectMunicipioPais')
        $('#selectDistritoPais').hide();
        quitarSeleccion('selectDistritoPais')
        $('#selectBarrioPais').hide();
        quitarSeleccion('selectBarrioPais')
        $('#selectSeccionCensalPais').show();
        $('#selectDistritoSCPais').show();
        $('#selectMselectSeccionCensalPaisunicipioEst .checkbox').find('*').filter(':input:visible:first').prop('checked', true);
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

    filtroAux = aplicaFiltroElement('selectDistritoSCPais', 'distrito', arrayIframes,'checkbox');
    if(filtroAux) {
        filtro = '';
        $('#selectSeccionCensalPais').html('<div class="text-right"><button type="button" class="btn btn-link bot_t_n" onclick="selececionarTodo(\'selectSeccionCensalEdad\')"><i class="fa fa-check"></i><span class="text_small txOscuro" data-i18n="todas"></span></button><button type="button" class="btn btn-link bot_t_n"  onclick="quitarSeleccion(\'selectSeccionCensalEdad\')"><i class="fa fa-times"></i><span class="text_small txOscuro" data-i18n="ninguna"></span></button></div>');
        if(filtroAux) {
            addFiltro(filtroAux, 'distritoId');
        }
        urlAjax = 
            POBLACION_URL_1 +
                paramCubo +
                POBLACION_URL_2 +
                '?dimension=seccionCensalId,seccionCensalTitle&group=SUM&measure=numeroPersonas&page=1&pageSize=100'+filtro;
        arraySeccionCensal = [];
        sessionStorage.removeItem("selectSeccionCensalPais");
        obtenerCombo('selectSeccionCensalPais', arraySeccionCensal, urlAjax, 'checkbox', false, null);    
    }
}