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
var paramTerritorio;
var paramMedida;
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
var paramIndicadores;
var paramNivelEstudio;
var paramPaisProcedencia;
var paramProvinciaProcedencia;
var paramMunicipioProcedencia;

var datosPadron = [];
var dataGeoJson;

var filtro = '';
var filtroTerritorio = '';

var pocoCadena = $.i18n('poco');
var muchoCadena = $.i18n('mucho');

var dimension = '';
var dimension1 = '';
var dimension2 = '';
var agrupador = 'SUM';
var cuboId;
let periodos = [];

/*
	Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log('inicializa');
    }

    inicializaMultidioma();
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_MAPA) {
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
                pocoCadena = $.i18n('poco');
                muchoCadena = $.i18n('mucho');
                capturaParam();
                periodo = paramPeriodo;
                if(paramPeriodo=='ultimo') {
                    dameUltimoPeriodo(cuboId,periodos);
                }else {
                    inicializaDatos();
                }
                
            });
    });

    $.i18n.debug = LOG_DEBUG_GRAFICO_MAPA;
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log('inicializaDatos');
    }

    $('#urlAPIDoc').attr('href', DOC_API);
    insertaURLSAPI();
    modificaTaskMaster('iframeGraficoBarras');

    if (!paramTerritorio) {
        dimension = 'municipioId as municipioId,municipioTitle as municipioTitle';
        dimension1 = 'municipioId';
        dimension2 = 'municipioTitle';
    } else {
        if (paramTerritorio == 'seccion-censal') {
            dimension =
                'seccionCensalId as seccionCensalId,seccionCensalTitle as seccionCensalTitle';
            dimension1 = 'seccionCensalId';
            dimension2 = 'seccionCensalTitle';
        }
        if (paramTerritorio == 'barrio') {
            dimension = 'barrioId as barrioId,barrioTitle as barrioTitle';
            dimension1 = 'barrioId';
            dimension2 = 'barrioTitle';
        }
        if (paramTerritorio == 'distrito') {
            dimension = 'distritoId as distritoId,distritoTitle as distritoTitle';
            dimension1 = 'distritoId';
            dimension2 = 'distritoTitle';
        }
        if (paramTerritorio == 'municipio') {
            dimension = 'municipioId as municipioId,municipioTitle as municipioTitle';
            dimension1 = 'municipioId';
            dimension2 = 'municipioTitle';
        }
    }
    let medida = 'numeroPersonas';
    if (!paramMedida) {
        medida = 'numeroPersonas';
    } else {
        medida = paramMedida;
    }
    if (paramMedidaInd) {
        medida = paramMedidaInd;
    } 
    if (paramMedidapor) {
        medida = paramMedidapor; 
    }

    if (paramNacionalidad) {
        addFiltroMapa(paramNacionalidad, 'nacionalidad');
    }
    if (paramEdadQuinquenales) {
        addFiltroMapa(paramEdadQuinquenales, 'edadGruposQuinquenales');
    }
    if (paramSexo) {
        addFiltroMapa(paramSexo, 'sex');
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
        addFiltroMapa(paramPeriodo, 'refPeriod');
    }
    if (paramNivelEstudio) {
        addFiltroMapa(paramNivelEstudio, 'tipoNivelEstudio');
    }
    if (paramPaisProcedencia) {
        addFiltroMapa(paramPaisProcedencia, 'paisProcedencia');
    }
    if (paramProvinciaProcedencia) {
        addFiltroMapa(paramProvinciaProcedencia, 'provinciaProcedencia');
    }
    if (paramMunicipioProcedencia) {
        addFiltroMapa(paramMunicipioProcedencia, 'municipioProcedencia');
    }
    if (paramMunicipio) {
        addFiltroMapa(paramMunicipio, 'municipioId');

        /*if (!filtroTerritorio) {
            filtroTerritorio = filtroTerritorio + '&q=';
        } else {
            filtroTerritorio = filtroTerritorio + '&&';
        }
        if (dimension.includes('municipioId')) {
            filtroTerritorio = filtroTerritorio + "id=='" + paramMunicipio + "'";
        } else {
            filtroTerritorio =
                filtroTerritorio + "municipioId=='" + paramMunicipio + "'";
        }*/
    }
    if (paramDistrito ) {
        addFiltroMapa(paramDistrito, 'distritoId');

        /*if (!filtroTerritorio) {
            filtroTerritorio = filtroTerritorio + '&q=';
        } else {
            filtroTerritorio = filtroTerritorio + '&&';
        }
        let filterKey = '';
        if (dimension.includes('distritoId')) {
            filterKey = 'id';
        } else {
            filterKey = 'distritoId';
        }
        if (paramDistrito.includes(',')) {
            let params = paramDistrito.split(',');
            let h;
            for (h = 0; h < params.length; h++) {
                filtroTerritorio = filtroTerritorio + filterKey + "=='" + params[h];
                if (h < params.length - 1) {
                    filtroTerritorio = filtroTerritorio + "' or ";
                } else {
                    filtroTerritorio = filtroTerritorio + "'";
                }
            }
        } else {
            filtroTerritorio =
                filtroTerritorio + filterKey + "=='" + paramDistrito + "'";
        }*/
    }
    if (paramBarrio) {
        addFiltroMapa(paramBarrio, "barrioId");
    }

    if (paramSeccionCensal) {
        addFiltroMapa(paramSeccionCensal, "seccionCensalId");

        /*if (filtroTerritorio == "") {
            filtroTerritorio = filtroTerritorio + "&q=";
        } else {
            filtroTerritorio = filtroTerritorio + "&&";
        }
        let filterKey = "";
        if (dimension.includes("seccionCensalId")) {
            filterKey = "id";
        } else {
            filterKey = "seccionCensalId";
        }
        if (paramSeccionCensal.includes(",")) {
            let params = paramSeccionCensal.split(",");
            let h;
            for (h = 0; h < params.length; h++) {
                filtroTerritorio = filtroTerritorio + filterKey + "=='" + params[h];
                if (h < params.length - 1) {
                    filtroTerritorio = filtroTerritorio + "' or ";
                } else {
                    filtroTerritorio = filtroTerritorio + "'";
                }
            }
        } else {
            filtroTerritorio =
                filtroTerritorio + filterKey + "=='" + paramSeccionCensal + "'";
        }*/
    }
    
    if (paramEdad) {
        addFiltroMapa(paramEdad, 'age');
    }
    if (paramProcedencia) {
        addFiltroMapa(paramProcedencia, 'procedencia');
    }
    if (paramPaisNacimiento) {
        addFiltroMapa(paramPaisNacimiento, 'paisNacimiento');
    }

    let url =
        URL_CUBOS.get(cuboId) +
        POBLACION_URL_2 +
        '?dimension=' +
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
    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                let htmlContent =
                    "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                    $.i18n("dimension") +
                    "</th><th>" +
                    $.i18n("medida") +
                    "</th></tr>";
                let h;
                for (h = 0; h < data.records.length; h++) {
                    let datoPadron;
                    datoPadron = {
                        id : String(data.records[h][dimension1]),
                        name : data.records[h][dimension2],
                        value :  data.records[h][agrupador]
                    };
                    datosPadron.push(datoPadron);

                    htmlContent =
                        htmlContent +
                        '<tr>' +
                        '<td>' +
                        data.records[h][dimension2].toString() +
                        '</td>' +
                        '<td>' +
                        data.records[h][agrupador].toString() +
                        '</td>' +
                        '</tr>';
                }

                htmlContent = htmlContent + '</table></div></div>';
                $('#datos_tabla').html(htmlContent);
            }
        })
        .always(function () {
            obtenerGeojson();
        });
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
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log('capturaParam');
    }

    if (getUrlVars()['cubo']) {
        paramCubo = getUrlVars()['cubo'];
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

    if (getUrlVars()['iframe']) {
        paramIframe = getUrlVars()['iframe'];
    }

    if (getUrlVars()['territorio']) {
        paramTerritorio = getUrlVars()['territorio'];
    } else {
        paramTerritorio = sessionStorage.getItem('territorio');
    }

    if (getUrlVars()['medida']) {
        paramMedida = getUrlVars()['medida'];
    }

    if (getUrlVars()['medidaInd']) {
        paramMedidaInd = getUrlVars()['medidaInd'];
    }
    if (getUrlVars()['medidaPor']) {
        paramMedidapor = getUrlVars()['medidaPor'];
    }

    if (getUrlVars()['width']) {
        paramAncho = getUrlVars()['width'];
    } else {
        paramAncho = '450';
    }

    if (getUrlVars()['nacionalidad']) {
        paramNacionalidad = getUrlVars()['nacionalidad'];
    }

    if (getUrlVars()['edadQuinquenales']) {
        paramEdadQuinquenales = getUrlVars()['edadQuinquenales'];
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

    if (getUrlVars()['seccionCensalId']) {
        paramSeccionCensal = getUrlVars()['seccionCensalId'];
    }
    if (getUrlVars()['edadSimple']) {
        paramEdad = getUrlVars()['edadSimple'];
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
    if (getUrlVars()['cuboId']) {
        cuboId = getUrlVars()['cuboId'];
    }
    if (getUrlVars()['indicadores']) {
        paramIndicadores = getUrlVars()['indicadores'];
    }
    if (getUrlVars()['nivelEstudio']) {
        paramNivelEstudio = getUrlVars()['nivelEstudio'];
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
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log('pintaGraficoMapa');
    }

    let territorio = '';
    if (paramTerritorio) {
        territorio = 'seccion-censal';
    } else {
        territorio = paramTerritorio;
    }
    $('#urlAPI').attr(
        'href',
        TERRITORIO_URL_1 + territorio + TERRITORIO_URL_2 + filtroTerritorio
    );
    $('#descargaGeoJSON').attr(
        'href',
        TERRITORIO_URL_1 + territorio + TERRITORIO_URL_2 + filtroTerritorio
    );

    am4core.useTheme(am4themes_frozen);
  
    let chart = am4core.create('chartdiv', am4maps.MapChart);
    chart.geodata = dataGeoJson;
    chart.language.locale = am4lang_es_ES;

    chart.focusFilter.stroke = am4core.color("#0f0");
    chart.focusFilter.strokeWidth = 4;
    
    chart.projection = new am4maps.projections.Mercator();

    chart.zoomControl = new am4maps.ZoomControl();

    let homeButton = new am4core.Button();
    homeButton.events.on('hit', function () {
        chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path =
        'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    polygonSeries.heatRules.push({
        property: 'fill',
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(1),
        max: chart.colors.getIndex(1).brighten(-0.3),
		logarithmic: true,
        dataField: 'value',
    });

    polygonSeries.useGeodata = true;

    polygonSeries.data = datosPadron;

    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.width = am4core.percent(30);
    heatLegend.align = 'right';
    heatLegend.valign = 'top';
	heatLegend.orientation = "horizontal";
	heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
	heatLegend.valueAxis.renderer.minGridDistance = 40;

	polygonSeries.mapPolygons.template.events.on("over", function(ev) {
	  if (!isNaN(ev.target.dataItem.value)) {
		heatLegend.valueAxis.showTooltipAt(ev.target.dataItem.value)
	  }
	  else {
		heatLegend.valueAxis.hideTooltip();
	  }
	});

	polygonSeries.mapPolygons.template.events.on("out", function(ev) {
	  heatLegend.valueAxis.hideTooltip();
	});


   // heatLegend.marginRight = am4core.percent(4);
    //heatLegend.minValue = 0;
    //heatLegend.maxValue = 40000000;

    //let minRange = heatLegend.valueAxis.axisRanges.create();
    //minRange.value = heatLegend.minValue;
    //minRange.label.text = pocoCadena;
    //let maxRange = heatLegend.valueAxis.axisRanges.create();
    //maxRange.value = heatLegend.maxValue;
    //maxRange.label.text = muchoCadena;

    //heatLegend.valueAxis.renderer.labels.template.adapter.add(
    //    'text',
    //    function (labelText) {
    //        return '';
    //    }
    //);

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{title}: {value}';
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    //Evento para controlar el click del ratón en una zona del mapa
    //polygonTemplate.events.on('hit', function (ev) {
    //    aplicarFiltrosMapa(ev.target.dataItem.dataContext.id);
   // });

    let hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#40ff00');

    $('.modal').modal('hide');
}

//Vble para controlar el tamaño
let tamanyFijoMapa = $(document).height();

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
            $("#" + paramIframe, window.parent.document).height(tamanyFijoMapa);
        }
    }
}

function addFiltroMapa(paramValor, campo) {
    if (filtro == "") {
        filtro = filtro + "&where=(";
    } else {
        filtro = filtro + " and (";
    }
    if (paramValor.includes(",")) {
        let params = paramValor.split(",");
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

    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log(
            '[addFiltroMapa] [paramValor:' +
                paramValor +
                '] [campo:' +
                campo +
                '] [filtro:' +
                filtro +
                ']'
        );
    }
}

function obtenerGeojson() {
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log('obtenerGeojson');
    }
    let territorio = '';
    if (!paramTerritorio) {
        territorio = 'seccion-censal';
    } else {
        territorio = paramTerritorio;
    }

    let urlAux =
        TERRITORIO_URL_1 + territorio + TERRITORIO_URL_2 + filtroTerritorio;
    let jqxhr = $.getJSON(urlAux)
        .done(function (data) {
            if (data && data.features && data.features.length ) {
                let i;
                for (i = 0; i < data.features.length; i++) {
                    data.features[i].id = data.features[i].properties.id;
                }
                dataGeoJson = data;
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        })
        .always(function () {
            pintaGrafico();
        });
}

function aplicarFiltrosMapa(idFiltro) {
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log(
            '[aplicarFiltrosMapa] [cuboId:' + cuboId + '] [idFiltro:' + idFiltro + ']'
        );
    }

    //Solo se activan los filtros si no esta maximizado
    if (inIframe()) {
        /* Se configura los iframes a los que les afecta los filtros */
        let arrayIframes = [
            'iframeGraficoMapa',
            'iframeGraficoBarras',
            'iframeGraficoTarta',
            'iframeGraficoLinea',
            'iframetablaDatosGenerica',
        ];

        let territorioFiltro = obtenerFiltroPorTerritorio();

        let url = '';
        let i;
        for (i = 0; i < arrayIframes.length; i++) {
            let iframe = arrayIframes[i];
            url = window.top.$('#' + iframe).attr('src');
            url = addParamIntoUrl(url, territorioFiltro, idFiltro);
            window.top.$('#' + iframe).attr('src', url);
            if (LOG_DEBUG_GRAFICO_MAPA) {
                console.log('[aplicaFiltroMapa] [url:' + url + ']');
            }
        }
    }
}

/**
 * obtenerTerritorio
 * Funcion para saber sobre que nivel de detalle se procesa el mapa
 */
function obtenerFiltroPorTerritorio() {
    if (LOG_DEBUG_GRAFICO_MAPA) {
        console.log('[obtenerTerritorio]');
    }

    let filtro = window.top.$('#filtroTerritorio').slider('getValue');

    if (filtro === 0) {
        //Municipio
        return 'municipio';
    } else if (filtro === 1) {
        //Distrito
        return 'disrito';
    } else if (filtro === 2) {
        //Barrio
        return 'barrio';
    } else if (filtro === 3) {
        //Seccion
        return 'seccionCensalId';
    } else {
        console.error(
            '[aplicaFiltroTerritorio] [filtro:' + filtro + '] Not found!!'
        );
    }
}
