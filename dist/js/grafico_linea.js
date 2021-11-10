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
var paramMedidaInd;
var paramMedidapor;

var paramCubo;
var paramTituloKey;
var paramIframe;

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

var filtro = '';
var cuboEdades = [];
var dimensionEtiquetas = {};

var dimension = '';
var agrupador = '';

/*
	Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('inicializa');
    }

    inicializaMultidioma();
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('inicializaMultidioma');
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
                inicializaDatos();
            });
    });

    $.i18n.debug = LOG_DEBUG_GRAFICO_BARRAS;
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('inicializaDatos');
    }

    capturaParam();
    insertaURLSAPI();
    modificaTaskMaster('iframeGraficoBarras');

    if (!paramEjeX) {
        dimension = 'refPeriod';
    } else {
        dimension = paramEjeX;
    }
    let medida = 'numeroPersonas';
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
    if (paramSexo) {
        addFiltro(paramSexo, 'sex');
    }
    if (paramPeriodo) {
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
    $('#descargaCSV').attr(
        'href',
        POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2_CSV+
            '?dimension=' +
            dimension +
            ' as ' +
            dimension +
            '&group=' +
            agrupador +
            '&measure=' +
            medida +
            '&page=1&pageSize=100' +
            filtro
    );

    let urlEtiquetas =
        URL_API +
        '/data-cube/data-structure-definition/dimension/' +
        dimension +
        '/value';
    $.getJSON(urlEtiquetas)
        .done(function (data) {
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    dimensionEtiquetas[data.records[i].id] = data.records[i].title;
                }
            }
        })
        .always(function () {
            obtieneDatosAPI(url);
        });
}

/* Método que obtiene los datos de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPI(url) {
    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                for (let i = 0; i < data.records.length; i++) {
                    let muestra;
                    if (dimensionEtiquetas[data.records[i][dimension]]) {
                        muestra = {
                            ejeX : dimensionEtiquetas[data.records[i][dimension]],
                            ejeY : data.records[i][agrupador]
                        };
                    } else {
                        muestra = {
                            ejeX : data.records[i][dimension],
                            ejeY : data.records[i][agrupador]
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
            cuboEdades.sort( compare );
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                $.i18n('dimension') +
                '</th><th>' +
                $.i18n('medida') +
                '</th></tr>';
            let j;
            for(j=0;j<cuboEdades.length;j++){
                muestra = cuboEdades[j];
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.ejeX.toString() +
                    '</td>' +
                    '<td>' +
                    numeral(muestra.ejeY).format(numFormatoSinDecimales) +
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
function insertaURLSAPI() {
    $('#urlAPIDoc').attr('href', DOC_API);
    $('#maximizar').attr('href', window.location.href);
    $('#maximizar').attr('target', '_blank');
}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('capturaParams');
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
    if (getUrlVars()['edad']) {
        paramEdad = getUrlVars()['edad'];
    }
    if (getUrlVars()['paisNacimiento']) {
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
}

/*
	Función para crear el gráfico 
*/
function pintaGrafico() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('pintaGraficoLineas');
    }

    am4core.useTheme(am4themes_frozen);
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.data = cuboEdades;
    chart.language.locale = am4lang_es_ES;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'ejeX';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;

    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 100;
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

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'ejeY';
    series.dataFields.categoryX = 'ejeX';
    series.name = 'Cubo';
    series.strokeWidth = 3;

    $('.modal').modal('hide');
}

//Vble para controlar el tamaño
let tamanyFijobarras = $(document).height();

/*
	Método que muestra u oculta la tabla con datos debajo de la visualización
*/
function mostrarDatos() {
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
    filtro = filtro + ")";

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
