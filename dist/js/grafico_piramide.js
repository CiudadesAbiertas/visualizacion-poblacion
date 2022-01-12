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
Algunas variables que se usan en este javascript se inicializan en ciudadesAbiertas.js
*/
var paramEjeX;
var paramEjeY;
var paramTerritorio;
var paramCubo;
var paramTituloKey;
var paramOperacion;
var paramMunicipio;
var paramDistrito;
var paramBarrio;
var paramSeccionCensal;
var paramPeriodo;
var paramSexo;
var paramEdad;
var paramEdadQuinquenales;
var paramNivelEstudio;
var paramProcedencia;
var paramPaisNacimiento;
var paramNacionalidad;
var paramGroupBy;

var datosPoblacion = new Array();
var datosEdad = new Array();
var datosPoblacionAux = {};
var dimensionEtiquetas = {};
var dimensionSex = 'sex';
var dimensionEdadGruposQuinquenales = '';
var dimension = '';
var agrupador = 'SUM';
let medida = 'numeroPersonas';

var filtro = '';
let periodos = [];

//Vble para controlar el tamaño
let tamanyFijo = $(document).height();

/*
	Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_PIRAMIDE) {
        console.log('inicializaGraficoPiramide');
    }

    inicializaMultidioma();
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_PIRAMIDE) {
        console.log('inicializaMultidiomaGraficoPiramide');
    }

    let langUrl = sessionStorage.getItem('lang');
    if (!langUrl) {
        langUrl = 'es';
    }
    $.i18n().locale = langUrl;
    document.documentElement.lang = $.i18n().locale;
    $('html').i18n();

    let iframe1 = "<iframe class='embed-responsive-item' src='";
    let iframe2 = "' height=300 frameborder='0' width='100%'></iframe>";
    $('#code').text(iframe1 + window.location.href + iframe2);

    jQuery(function ($) {
        $.i18n()
            .load({
                en: './dist/i18n/en.json',
                es: './dist/i18n/es.json',
                gl: './dist/i18n/gl.json',
            })
            .done(function () {
                $('html').i18n();
                capturaParametros();
                periodo = paramPeriodo;
                if(paramPeriodo=='ultimo') {
                    dameUltimoPeriodo(paramCubo,periodos);
                }else {
                    inicializaDatos();
                }
            });
    });

    $.i18n.debug = LOG_DEBUG_GRAFICO_PIRAMIDE;
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_PIRAMIDE) {
        console.log('inicializaTablaGraficoPiramide');
    }

    pintaGrafico();
     
    if (paramEjeY) {
        dimension = paramEjeY;
    }

    if (!paramEjeX) {
        medida = 'numeroPersonas';
    } else {
        medida = paramEjeX;
    }

    if (paramNacionalidad) {
        addFiltro(paramNacionalidad, 'nacionalidad');
    }
    if (paramEdad) {
        addFiltro(paramEdad, 'age');
    }
    if (paramEdadQuinquenales) {
        addFiltro(paramEdadQuinquenales, 'edadGruposQuinquenales');
    }
    if (paramNivelEstudio) {
        addFiltro(paramNivelEstudio, 'tipoNivelEstudio');
    }
    if (paramSexo) {
        addFiltro(paramSexo, 'sex');
    }
    if (paramPeriodo) {
        if(paramPeriodo=='ultimo') {
            paramPeriodo = periodos[0];
            let paramTitulo = $.i18n(paramTituloKey);
            if (paramPeriodo) {
                paramTitulo = paramTitulo + ' ' + paramPeriodo;
            }
            $('#tituloGrafico').html(decodeURI(paramTitulo));
        }
        addFiltro(paramPeriodo, 'refPeriod');
    }

    if (paramMunicipio) {
        addFiltro(paramMunicipio, 'municipioId');
    }
    if (paramDistrito) {
        addFiltro(paramDistrito, 'distritoId');
    }
    if (paramBarrio) {
        addFiltro(paramBarrio, 'barrioId');
    }
    if (paramSeccionCensal) {
        addFiltro(paramSeccionCensal, 'seccionCensalId');
    }

    if (paramProcedencia) {
        addFiltro(paramProcedencia, 'procedencia');
    }
    if (paramPaisNacimiento) {
        addFiltro(paramPaisNacimiento, 'paisNacimiento');
    }
    

    let urlPoblacionPiramideJson =
        DATACUBE_URL+'/'+paramCubo+'/query.json' +
        '?dimension=' +
        dimension +
        '&group=' +
        agrupador +
        '&measure=' +
        medida +
        '&page=1&pageSize=500' +
        filtro;

    let urlPoblacionPiramideCsv =
        DATACUBE_URL+'/'+paramCubo+'/query.csv' +
        '?dimension=' +
        dimension +
        '&group=' +
        agrupador +
        '&measure=' +
        medida +
        '&page=1&pageSize=500' +
        filtro;

    insertaURLSAPI(urlPoblacionPiramideJson,urlPoblacionPiramideCsv)

    let etiqueta;
    let etiquetas = [];
    etiquetas = paramGroupBy.split(',');
    let d;
    for(d=0;d<etiquetas.length;d++) {
        etiqueta = etiquetas[d];
        if(DIMENSION_CON_ETIQUETA.indexOf(etiqueta)!=-1){
            if(etiqueta=='sex') {
                VALORES_SEXO.forEach(obtenerEtiquetas,dimensionEtiquetas);
            }else if(etiqueta=='edadGruposQuinquenales') {
                VALORES_EDAD_QUINQUENAL.forEach(obtenerEtiquetas,dimensionEtiquetas);
            }else if(etiqueta=='nacionalidad') {
                VALORES_NACIONALIDAD.forEach(obtenerEtiquetas,dimensionEtiquetas);
            }else if(etiqueta=='tipoNivelEstudio') {
                VALORES_NIVEL_ESTUDIOS.forEach(obtenerEtiquetas,dimensionEtiquetas);
            }
        }
    }

    
    obtieneDatosAPIPobl(urlPoblacionPiramideJson);
}

/* Método que obtiene los datos de población de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPIPobl(url) {
    let jqxhr = $.getJSON(url).done(function (data) {
        if (data.records) {
           
            let i;
            for (i = 0; i < data.records.length; i++) {
                let muestra = new Object();

                if (
                  dimensionEtiquetas[
                    data.records[i][dimensionEdadGruposQuinquenales]
                  ]
                ) {
                    muestra.age =
                    dimensionEtiquetas[
                      data.records[i][dimensionEdadGruposQuinquenales]
                    ];
                    datosEdad.push(dimensionEtiquetas[
                        data.records[i][dimensionEdadGruposQuinquenales]
                      ]);
                } else {
                    let valor;
                    if(dimensionEdadGruposQuinquenales=='age') {
                        valor = Number(data.records[i][dimensionEdadGruposQuinquenales]);
                    }else {
                        valor = data.records[i][dimensionEdadGruposQuinquenales];
                    }
                    muestra.age = valor;

                    datosEdad.push(data.records[i][dimensionEdadGruposQuinquenales]);
                }

                if (datosPoblacionAux[muestra.age]) {
                    muestra = datosPoblacionAux[muestra.age];
                }
                if (data.records[i][dimensionSex] == 'sex-F') {
                    muestra.female = data.records[i][agrupador];
                } else if (data.records[i][dimensionSex] == 'sex-M') {
                    muestra.male = data.records[i][agrupador];
                }
                /*if (muestra.female && muestra.male) {
                   
                    datosPoblacion.push(muestra);
                }*/
                datosPoblacionAux[muestra.age] = muestra;
            }

        }
        if (data.next) {
            obtieneDatosAPIPobl(data.next);
        } else {

            let l;
            for(l=0;l<datosEdad.length;l++) {
                let muestra = datosPoblacionAux[datosEdad[l]];
                if(!muestra.male) {
                    muestra.male = 0;
                }
                if(!muestra.female) {
                    muestra.female = 0;
                }
                datosPoblacion.push(muestra);
            }

            datosPoblacion.sort( compare );

            let htmlContent =
            "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
            $.i18n('edad') +
            '</th><th>' +
            $.i18n('mujeres') +
            '</th><th>' +
            $.i18n('hombres') +
            '</th></tr>';
            let h;
            for(h=0;h<datosPoblacion.length;h++){
                let muestra = datosPoblacion[h];

                let numFemale = muestra.female;
                numFemale = numeral(numFemale);
                let numMale = muestra.male;
                numMale = numeral(numMale);
                htmlContent =
                    htmlContent +
                    "<tr>" +
                    "<td>" +
                    muestra.age +
                    "</td>" +
                    "<td>" +
                    numFemale.format(numFormatoSinDecimales) +
                    "</td>" +
                    "<td>" +
                    numMale.format(numFormatoSinDecimales) +
                    "</td>" +
                     "</tr>";
            }
            htmlContent =
                htmlContent +
                "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick='mostrarDatos()'>Mostar/Ocultar datos</button></div></div>";
            $("#datos_tabla").html(htmlContent);

            pintaGrafico();
        }
    });
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI(urlAPI,descargaCSV) {
    $('#urlAPI').attr('href', POBLACION_PIRAMIDE_URL);
    $('#descargaCSV').attr('href', POBLACION_PIRAMIDE_URL_CSV);
    $('#descargaJSON').attr('href', POBLACION_PIRAMIDE_URL);
    $('#urlAPIDoc').attr('href', DOC_API);
    $('#maximizar').attr('href', window.location.href);
    $('#maximizar').attr('target', '_blank');
}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParametros() {
    if (getUrlVars()['cubo']) {
        paramCubo = getUrlVars()['cubo'];
    } /*else {
        paramCubo = 'edad-grupo-quinquenal';
    }*/
    if (getUrlVars()['periodo']) {
        paramPeriodo = getUrlVars()['periodo'];
    }
    if (getUrlVars()['titulo']) {
        paramTituloKey = getUrlVars()['titulo'];
        let paramTitulo = $.i18n(paramTituloKey);
        if (paramPeriodo) {
            paramTitulo = paramTitulo + ' ' + paramPeriodo;
        }
        $('#tituloGrafico').html(decodeURI(paramTitulo));
    }

    if (getUrlVars()['municipio']) {
        paramMunicipio = getUrlVars()['municipio'];
    }

    if (getUrlVars()['distrito']) {
        paramDistrito = getUrlVars()['distrito'];
    }

    if (getUrlVars()['barrio']) {
        paramBarrio = getUrlVars()['barrio'];
    }
    if (getUrlVars()['seccionCensalId']) {
        paramSeccionCensal = getUrlVars()['seccionCensalId'];
    }
	
    if (getUrlVars()['territorio']) {
        paramTerritorio = getUrlVars()['territorio'];
    } else if (sessionStorage.getItem('territorio')) {
        paramTerritorio = sessionStorage.getItem('territorio');
    } else {
        paramTerritorio = 'municipio';
    }

    if (getUrlVars()['ejeX']) {
        paramEjeX = getUrlVars()['ejeX'];
    }

    if (getUrlVars()['ejeY']) {
        paramEjeY = getUrlVars()['ejeY'];
        dimensionEdadGruposQuinquenales = paramEjeY;
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.replaceAll('as','');
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.replaceAll('%20',' ');
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.replaceAll('%2C',' ');
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.replaceAll(dimensionSex,'');
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.replaceAll('  ',' ');
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.substr(dimensionEdadGruposQuinquenales.indexOf(' '),dimensionEdadGruposQuinquenales.length);
        dimensionEdadGruposQuinquenales = dimensionEdadGruposQuinquenales.trim();
    }

    if (getUrlVars()['operacion']) {
        paramOperacion = getUrlVars()['operacion'];
    }

    if (getUrlVars()['edadQuinquenales']) {
        paramEdadQuinquenales = getUrlVars()['edadQuinquenales'];
    }

    if (getUrlVars()['edadSimple']) {
        paramEdad = getUrlVars()['edadSimple'];
    }
    
    if (getUrlVars()['sexo']) {
        paramSexo = getUrlVars()['sexo'];
    }

    if (getUrlVars()['municipio']) {
        paramMunicipio = getUrlVars()['municipio'];
    }

    if (getUrlVars()['distrito']) {
        paramDistrito = getUrlVars()['distrito'];
    }

    if (getUrlVars()['barrio']) {
        paramBarrio = getUrlVars()['barrio'];
    }
    if (getUrlVars()['seccionCensal']) {
        paramSeccionCensal = getUrlVars()['seccionCensal'];
    }

    if (getUrlVars()['groupBy']) {
        paramGroupBy = getUrlVars()['groupBy'];
    }
}

/*
	Función para crear el gráfico
*/
function pintaGrafico() {
    if (LOG_DEBUG_GRAFICO_PIRAMIDE) {
        console.log('pintaGraficoPiramide');
    }

    am4core.useTheme(am4themes_frozen);
  
    let mainContainer = am4core.create('chartdiv', am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = 'horizontal';

    // chart.focusFilter.stroke = am4core.color("#0f0");
    // chart.focusFilter.strokeWidth = 4;
    
    let maleChart = mainContainer.createChild(am4charts.XYChart);
    maleChart.width = am4core.percent(50);
    maleChart.paddingRight = 0;
    maleChart.data = datosPoblacion;

    let maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
    maleCategoryAxis.dataFields.category = 'age';
    maleCategoryAxis.renderer.grid.template.location = 0;
    maleCategoryAxis.renderer.minGridDistance = 1;

    let maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
    maleValueAxis.renderer.inversed = true;
    maleValueAxis.min = 0;
    maleValueAxis.strictMinMax = true;

    maleValueAxis.numberFormatter = new am4core.NumberFormatter();
    maleValueAxis.numberFormatter.numberFormat = "#.#'%'";

    let maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
    maleSeries.dataFields.valueX = 'male';
    maleSeries.dataFields.valueXShow = 'percent';
    maleSeries.calculatePercent = true;
    maleSeries.dataFields.categoryY = 'age';
    maleSeries.interpolationDuration = 1000;
    maleSeries.columns.template.tooltipText =
        "Males, age {categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";

    let femaleChart = mainContainer.createChild(am4charts.XYChart);
    femaleChart.width = am4core.percent(50);
    femaleChart.paddingLeft = 0;
    femaleChart.data = datosPoblacion;

    let femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
    femaleCategoryAxis.renderer.opposite = true;
    femaleCategoryAxis.dataFields.category = 'age';
    femaleCategoryAxis.renderer.grid.template.location = 0;
    femaleCategoryAxis.renderer.minGridDistance = 1;

    let femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
    femaleValueAxis.min = 0;
    femaleValueAxis.strictMinMax = true;
    femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
	femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
	femaleValueAxis.renderer.minLabelPosition = 0.01;

    let femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
    femaleSeries.dataFields.valueX = 'female';
    femaleSeries.dataFields.valueXShow = 'percent';
    femaleSeries.calculatePercent = true;
    femaleSeries.fill = femaleChart.colors.getIndex(4);
    femaleSeries.stroke = femaleSeries.fill;
    femaleSeries.columns.template.tooltipText =
        "Females, age {categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    femaleSeries.dataFields.categoryY = 'age';
    femaleSeries.interpolationDuration = 1000;

    $('#iframeGraficoPiramide', window.parent.document).height(
        $(document).height()
    );
    $('.modal').modal('hide');
}

/*
	Método que muestra u oculta la tabla con datos debajo de la visualización
*/
function mostrarDatos() {
    $('#datos_tabla').toggle();
    let isVisible = $('#datos_tabla').is(':visible');
    if (isVisible) {
        let cachito = (5 / 100) * $(document).height();
        $('#iframeGraficoPiramide', window.parent.document).height(
            $(document).height() + cachito
        );
    } else {
        $('#iframeGraficoPiramide', window.parent.document).height(tamanyFijo);
    }
}

function compare(a, b) {
    if (a.age < b.age) {
        return -1;
    }
    if (a.age > b.age) {
        return 1;
    }
    return 0;
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