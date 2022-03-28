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
let paramEjeX;
let paramEjeY;

let paramCubo;
let paramTituloKey;
let paramIframe;

let paramOperacion;

let paramMunicipio;
let paramDistrito;
let paramBarrio;
let paramSeccionCensal;
let paramPeriodo;
let paramSexo;
let paramEdad;
let paramEdadQuinquenales;
let paramNivelEstudio;
let paramProcedencia;
let paramPaisNacimiento;
let paramNacionalidad;
let paramMedidaInd;
let paramMedidapor;
let paramPaisProcedencia;
let paramProvinciaProcedencia;
let paramMunicipioProcedencia;

let filtro = '';
let cuboEdades = [];
let dimensionEtiquetas = {};

let dimension = '';
let agrupador = '';
let periodos = [];
let medida = '';

//Vble para controlar el tamaño
let tamanyFijobarras = $(document).height();

/*
    Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [inicializa]');
    }

    inicializaMultidioma();
}

/* 
    Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [inicializaMultidioma]');
    }

    let langUrl = sessionStorage.getItem('lang');
    if (!langUrl) {
        langUrl = 'es';
    }
    $.i18n().locale = langUrl;
    document.documentElement.lang = $.i18n().locale;
    $('html').i18n();

    let iframe1 = '<iframe class="embed-responsive-item" src="';
    let iframe2 = '" height=300 frameborder="0" width="100%"></iframe>';
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
                capturaParam();
                periodo = paramPeriodo;
                if (paramPeriodo == 'ultimo') {
                    dameUltimoPeriodo(paramCubo, periodos);
                } else {
                    inicializaDatos();
                }
            });
    });

    // $.i18n.debug = LOG_DEBUG_GRAFICO_BARRAS;
}

/*
    Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [inicializaDatos]');
    }

    insertaURLSAPI();
    modificaTaskMaster('iframeGraficoBarras');

    if (!paramEjeX) {
        dimension = 'refPeriod';
    } else {
        dimension = paramEjeX;
    }
    medida = 'numeroPersonas';
    if (paramEjeY) {
        medida = paramEjeY;
    }

    if (paramMedidaInd) {
        medida = paramMedidaInd;
    }

    if (paramMedidapor) {
        medida = paramMedidapor;
    }

    if (!paramOperacion) {
        agrupador = 'SUM';
    } else {
        agrupador = paramOperacion;
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
    if (paramPaisProcedencia) {
        addFiltro(paramPaisProcedencia, 'paisProcedencia');
    }
    if (paramProvinciaProcedencia) {
        addFiltro(paramProvinciaProcedencia, 'provinciaProcedencia');
    }
    if (paramMunicipioProcedencia) {
        addFiltro(paramMunicipioProcedencia, 'municipioProcedencia');
    }
    if (paramSexo) {
        addFiltro(paramSexo, 'sex');
    }
    if (paramPeriodo) {
        if (paramPeriodo == 'ultimo') {
            let paramTitulo = $.i18n(paramTituloKey);
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
    if (getUrlVars()['paisNacimiento']) {
        paramPaisNacimiento = getUrlVars()['paisNacimiento'];
    }

    if (paramMunicipio) {
        isFiltroMunicipio();
    }

    let url =
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=' +
        dimension +
        ' as ' +
        dimension +
        '&group=' +
        agrupador +
        '&measure=' +
        medida +
        '&page=1&pageSize=100' +
        filtro;
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[inicializaDatos] url:' + url);
    }
    $('#urlAPI').attr('href', url);
    $('#descargaJSON').attr('href', url);
    let urlcsv =
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2_CSV +
        "?dimension=" +
        dimension +
        " as " +
        dimension +
        "&group=" +
        agrupador +
        "&measure=" +
        medida +
        "&page=1&pageSize=100" +
        filtro;
    $("#descargaCSV").attr("href", urlcsv);

    if (DIMENSION_CON_ETIQUETA.indexOf(paramEjeX) != -1) {
        dimensionEtiquetas = dimensionEtiquetas;
        if (paramEjeX == 'sex') {
            VALORES_SEXO.forEach(obtenerEtiquetas, dimensionEtiquetas);
        } else if (paramEjeX == 'edadGruposQuinquenales') {
            VALORES_EDAD_QUINQUENAL.forEach(obtenerEtiquetas, dimensionEtiquetas);
        } else if (paramEjeX == 'nacionalidad') {
            VALORES_NACIONALIDAD.forEach(obtenerEtiquetas, dimensionEtiquetas);
        } else if (paramEjeX == 'tipoNivelEstudio') {
            VALORES_NIVEL_ESTUDIOS.forEach(obtenerEtiquetas, dimensionEtiquetas);
        }
    }

    obtieneDatosAPI(url);
    insertaURLSAPI(url,urlcsv);
}

/* Método que obtiene los datos de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPI(url) {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [obtieneDatosAPI] [URL] ' + url);
    }

    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    let muestra;
                    if (dimensionEtiquetas[data.records[i][dimension]]) {
                        muestra = {
                            ejeX: dimensionEtiquetas[data.records[i][dimension]],
                            ejeY: data.records[i][agrupador]
                        };
                    } else {
                        muestra = {
                            ejeX: data.records[i][dimension],
                            ejeY: data.records[i][agrupador]
                        };
                    }
                    cuboEdades.push(muestra);
                }
            }
            if (data.next) {
                obtieneDatosAPI(data.next);
            } else {
                pintaGrafico();
            }
        })
        .always(function () {
            cuboEdades.sort(compare);
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                ETIQUETAS_TABLA.get(dimension) +
                '</th><th>' +
                ETIQUETAS_TABLA.get(medida) +
                '</th></tr>';
            let j;
            for (j = 0; j < cuboEdades.length; j++) {
                muestra = cuboEdades[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.ejeX.toString() +
                    '</td>' +
                    '<td>' +
                    numeralEjeY.format(numFormatoSinDecimales) +
                    '</td>' +
                    '</tr>';
            }
            htmlContent = htmlContent + '</table></div></div>';
            $('#datos_tabla').html(htmlContent);

            pintaGrafico();
        });
}

function compare(a, b) {
    if (a.ejeX < b.ejeX) {
        return -1;
    }
    if (a.ejeX > b.ejeX) {
        return 1;
    }
    return 0;
}

/*
    Método que inserta URLs en el botón Acción
*/
function insertaURLSAPI(urljson, urlcsv) {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [insertaURLSAPI]');
    }

    $('#urlAPIDoc').attr('href', DOC_API);
    $('#descargaCSV').attr('href', urlcsv);
    $('#descargaJSON').attr('href', urljson);
    $('#maximizar').attr('href', window.location.href);
    $('#maximizar').attr('target', '_blank');
}

/*
    Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [capturaParam]');
    }

    if (getUrlVars()['cubo']) {
        paramCubo = getUrlVars()['cubo'];
    }

    if (getUrlVars()['iframe']) {
        paramIframe = getUrlVars()['iframe'];
    }

    if (getUrlVars()['ejeX']) {
        paramEjeX = getUrlVars()['ejeX'];
    }

    if (getUrlVars()['ejeY']) {
        paramEjeY = getUrlVars()['ejeY'];
    }

    if (getUrlVars()['operacion']) {
        paramOperacion = getUrlVars()['operacion'];
    }

    if (getUrlVars()['nacionalidad']) {
        paramNacionalidad = getUrlVars()['nacionalidad'];
    }

    if (getUrlVars()['edadQuinquenales']) {
        paramEdadQuinquenales = getUrlVars()['edadQuinquenales'];
    }

    if (getUrlVars()['nivelEstudio']) {
        paramNivelEstudio = getUrlVars()['nivelEstudio'];
    }

    if (getUrlVars()['sexo']) {
        paramSexo = getUrlVars()['sexo'];
    }

    if (getUrlVars()['periodo']) {
        paramPeriodo = getUrlVars()['periodo'];
    }

    if (getUrlVars()['titulo']) {
        paramTituloKey = getUrlVars()['titulo'];
        let paramTitulo = $.i18n(paramTituloKey);
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
    if (getUrlVars()['edadSimple']) {
        paramEdad = getUrlVars()['edadSimple'];
    }
    if (getUrlVars()['edad']) {
        paramEdad = getUrlVars()['edad'];
    }
    if (getUrlVars()['Nacimiento']) {
        paramPaisNacimiento = getUrlVars()['paisNacimiento'];
    }
    if (getUrlVars()['procedencia']) {
        paramProcedencia = getUrlVars()['procedencia'];
    }
    if (getUrlVars()['medidaInd']) {
        paramMedidaInd = getUrlVars()['medidaInd'];
    }
    if (getUrlVars()['medidaPor']) {
        paramMedidapor = getUrlVars()['medidaPor'];
    }
    if (getUrlVars()['paisProcedencia']) {
        paramPaisProcedencia = getUrlVars()['paisProcedencia'];
    }
    if (getUrlVars()['provinciaProcedencia']) {
        paramProvinciaProcedencia = getUrlVars()['provinciaProcedencia'];
    }
    if (getUrlVars()['municipioProcedencia']) {
        paramMunicipioProcedencia = getUrlVars()['municipioProcedencia'];
    }

}

/*
    Función para crear el gráfico
*/
function pintaGrafico() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [pintaGrafico]');
    }

    am4core.useTheme(am4themes_frozen);
    am4core.options.autoDispose = true;

    let chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.data = cuboEdades;
    chart.language.locale = am4lang_es_ES;

    chart.focusFilter.stroke = am4core.color('#0f0');
    chart.focusFilter.strokeWidth = 4;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'ejeX';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 220;
    label.tooltipText = '{category}';

    categoryAxis.events.on('sizechanged', function (ev) {
        let axis = ev.target;
        let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
            axis.renderer.labels.template.rotation = -45;
            axis.renderer.labels.template.horizontalCenter = 'right';
            axis.renderer.labels.template.verticalCenter = 'middle';
        } else {
            axis.renderer.labels.template.rotation = 0;
            axis.renderer.labels.template.horizontalCenter = 'middle';
            axis.renderer.labels.template.verticalCenter = 'top';
        }
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'ejeY';
    series.dataFields.categoryX = 'ejeX';
    series.name = 'Cubo';
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;

    $('.modal').modal('hide');
}


/*
    Método que muestra u oculta la tabla con datos debajo de la visualización
*/
function mostrarDatos() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('[barras] [mostrarDatos]');
    }

    $('#datos_tabla').toggle();

    let isVisible = $('#datos_tabla').is(':visible');
    if (paramIframe) {
        if (isVisible) {
            let cachito = (5 / 100) * $(document).height();
            $('#' + paramIframe, window.parent.document).height(
                $(document).height() + cachito
            );
        } else {
            $('#' + paramIframe, window.parent.document).height(tamanyFijobarras);
        }
    }
}

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log(
            '[barras] [addFiltro] [paramValor:' +
            paramValor +
            '] [campo:' +
            campo +
            '] [filtro:' +
            filtro +
            ']'
        );
    }

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

}

