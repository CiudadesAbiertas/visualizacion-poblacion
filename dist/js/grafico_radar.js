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
var paramEjeX1;
var paramEjeX2;
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
var paramTipoGrafico;
var paramIndicadores;
var paramPaisProcedencia;
var paramProvinciaProcedencia;
var paramMunicipioProcedencia;

var valor1Dim1;
var valor2Dim1;
var valor3Dim1;
var valor4Dim1;
var valor5Dim1;

var valor1Dim2;
var valor2Dim2;
var valor3Dim2;
var valor4Dim2;
var valor5Dim2;

var filtro = '';


var dimensionEtiquetas = {};

var dimension1 = '';
var dimension1_1 = '';
var dimension1_2 = '';
var dimension2 = '';
var agrupador = '';

var chart;
var xAxis;
let medidas;

var medida1 = {};
var medida2 = {};
var medida3 = {};
var medida4 = {};
var medida5 = {};
let datos = [];
let series = [];
let periodos = [];

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
                capturaParam();
                periodo = paramPeriodo;
                if(paramPeriodo=='ultimo') {
                    dameUltimoPeriodo(paramCubo,periodos);
                }else {
                    inicializaDatos();
                }
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

    insertaURLSAPI();
    modificaTaskMaster('iframeGraficoBarras');

    if (paramEjeX1) {
        dimension1 = paramEjeX1;
    } 
    if (paramEjeX2) {
        dimension2 = paramEjeX2;
    } 

    let paramMedidas = '';
    if (paramEjeY) {
        paramMedidas = paramEjeY;
    }

    if (paramMedidaInd) {
        paramMedidas = paramMedidaInd;
    } 

    if (paramMedidapor) {
        paramMedidas = paramMedidapor; 
    } 

    if (paramOperacion) {
        agrupador = paramOperacion;
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
    if (paramPaisProcedencia) {
        addFiltro(paramPaisProcedencia, 'paisProcedencia');
    }
    if (paramProvinciaProcedencia) {
        addFiltro(paramProvinciaProcedencia, 'provinciaProcedencia');
    }
    if (paramMunicipioProcedencia) {
        addFiltro(paramMunicipioProcedencia, 'municipioProcedencia');
    }
    
    
    let numMedidas = 0;
    if(paramMedidas.indexOf(',') != -1) {
        medidas = paramMedidas.split(',');
        numMedidas = medidas.length;
    } else {
        numMedidas = 1;
    }

    pintaGrafico();
    let medida;
    let d;
    for (d = 0; d < numMedidas; d++) {
        if(paramMedidas.indexOf(',') == -1) {
            medida = paramMedidas;
        }else {
            medida = medidas[d];
        }
        

        let url =
            POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            "?dimension=" +
            dimension1 +
            "," +
            dimension2 +
            " as " +
            dimension2 +
            "&group=" +
            agrupador +
            "&measure=" +
            medida +
            "&page=1&pageSize=100" +
            filtro;
        if (LOG_DEBUG_GRAFICO_BARRAS) {
            console.log("[inicializaDatos] url:" + url);
        }
        $("#urlAPI").attr("href", url);
        $("#descargaJSON").attr("href", url);
        $("#descargaCSV").attr(
            "href",
            POBLACION_URL_1 +
             paramCubo +
            POBLACION_URL_2_CSV +
            "?dimension=" +
            dimension1 +
            "," +
            dimension2 +
            " as " +
            dimension2 +
            "&group=" +
            agrupador +
            "&measure=" +
            medida +
            "&page=1&pageSize=100" +
            filtro
        );

        obtieneDatosAPINueva(url,d);
    }
    

}

/* Método que obtiene los datos de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPINueva(url,d) {

    if(d==0) {
        medida1['nombre'] = medidas[d];
    }else if(d==1) {
        medida2['nombre'] = medidas[d];
    }else if(d==2) {
        medida3['nombre'] = medidas[d];
    }else if(d==3) {
        medida4['nombre'] = medidas[d];
    }else if(d==4) {
        medida5['nombre'] = medidas[d];
    }
    
    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    if(d==0) {
                        if(data.records[i][agrupador]) {
                            medida1[data.records[i][dimension2]] = data.records[i][agrupador];
                            
                        }else{
                            medida1[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==1) {
                        if(data.records[i][agrupador]) {
                            medida2[data.records[i][dimension2]] = data.records[i][agrupador];
                        }else{
                            medida2[data.records[i][dimension2]] = 0;
                        }
                        
                    }else if(d==2) {
                        if(data.records[i][agrupador]) {
                            medida3[data.records[i][dimension2]] = data.records[i][agrupador];
                        }else{
                            medida3[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==3) {
                        if(data.records[i][agrupador]) {
                            medida4[data.records[i][dimension2]] = data.records[i][agrupador];
                        }else{
                            medida4[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==4) {
                        if(data.records[i][agrupador]) {
                            medida5[data.records[i][dimension2]] = data.records[i][agrupador];
                        }else{
                            medida5[data.records[i][dimension2]] = 0;
                        }
                    }
                    if(series.indexOf(data.records[i][dimension2])==-1) {
                        series.push(data.records[i][dimension2]);
                    }
                }
                if(d==0) {
                    datos.push(medida1);
                }else if(d==1) {
                    datos.push(medida2);
                }else if(d==2) {
                    datos.push(medida3);
                }else if(d==3) {
                    datos.push(medida4);
                }else if(d==4) {
                    datos.push(medida5);
                }
            }
            if (data.next) {
                obtieneDatosAPINueva(data.next,d);
            }
        })
        .always(function () {
            if(medidas.length==d+1){
                let htmlContentCabecera =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                'Nombre' +
                '</th>';
                let htmlContent = '';
                let d;
                for(d=0;d<series.length;d++) {
                    createSeries(series[d],datos,series[d]);
                    htmlContentCabecera = htmlContentCabecera + '<th>' + series[d] + '</th>'                        
                }

                for(a=0;a<datos.length;a++) {
                    let t;
                    htmlContent = htmlContent + "<tr>" + "<td>" + datos[a].nombre + "</td>";
                    for(t=0;t<series.length;t++) {
                        htmlContent =
                            htmlContent + "<td>" + datos[a][series[t]] + "</td>";
                    }
                    htmlContent = htmlContent + "</tr>";
                }

                htmlContent = htmlContent + '</table></div></div>';
                $('#datos_tabla').html(htmlContentCabecera+'</tr>'+htmlContent);
                $('.modal').modal('hide');
            }   
        }
    );
}
/* Método que obtiene los datos de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPI(url,medida) {

    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                for (let i = 0; i < data.records.length; i++) {                 
                    let muestra1;
                    let muestra2;
                    let muestra3;
                    let muestra4;
                    let muestra5;
                    
                    if(data.records[i][dimension1_1]==valor1Dim1) {
                        muestra1 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra1[medida] = data.records[i][agrupador];
                        linea1.push(muestra1);
                    }else if(data.records[i][dimension1_1]==valor2Dim1) {
                        muestra2 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra2[medida] = data.records[i][agrupador];
                        linea2.push(muestra2);
                    }else if(data.records[i][dimension1_1]==valor3Dim1) {
                        muestra3 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra3[medida] = data.records[i][agrupador];
                        linea3.push(muestra3);
                    }else if(data.records[i][dimension1_1]==valor4Dim1) {
                        muestra4 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra4[medida] = data.records[i][agrupador];
                        linea4.push(muestra4);
                    }else if(data.records[i][dimension1_1]==valor3Dim1) {
                        muestra5 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra5[medida] = data.records[i][agrupador];
                        linea5.push(muestra5);
                    }
                    
                }
            }
            if (data.next) {
                obtieneDatosAPI(data.next);
            } /*else {
                pintaGrafico();
                createSeries(lineaEdades0004[0].edad,lineaEdades0004);
                createSeries(lineaEdades0509[0].edad,lineaEdades0509);
                
            }*/
        })
        .always(function () {
            linea1.sort( compare );
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                $.i18n('dimension1') +
                '</th><th>' +
                $.i18n('dimension2') +
                '</th><th>' +
                $.i18n('medida') +
                '</th></tr>';
            let j;
            for(j=0;j<linea1.length;j++){
                muestra = linea1[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.valor.toString() +
                    '</td>' +
                    '<td>' +
                    muestra.ejeX.toString() +
                    '</td>' +
                    '<td>' +
                    numeralEjeY.format(numFormatoSinDecimales) +
                    '</td>' +
                    '</tr>';
            }
            $('#datos_tabla').html(htmlContent);

            linea2.sort( compare );
            for(j=0;j<linea2.length;j++){
                muestra = linea2[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.valor.toString() +
                    '</td>' +
                    '<td>' +
                    muestra.ejeX.toString() +
                    '</td>' +
                    '<td>' +
                    numeralEjeY.format(numFormatoSinDecimales) +
                    '</td>' +
                    '</tr>';
            }
            $('#datos_tabla').html(htmlContent);

            linea3.sort( compare );
            for(j=0;j<linea3.length;j++){
                muestra = linea3[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.valor.toString() +
                    '</td>' +
                    '<td>' +
                    muestra.ejeX.toString() +
                    '</td>' +
                    '<td>' +
                    numeralEjeY.format(numFormatoSinDecimales) +
                    '</td>' +
                    '</tr>';
            }
            $('#datos_tabla').html(htmlContent);

            linea4.sort( compare );
            for(j=0;j<linea4.length;j++){
                muestra = linea4[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.valor.toString() +
                    '</td>' +
                    '<td>' +
                    muestra.ejeX.toString() +
                    '</td>' +
                    '<td>' +
                    numeralEjeY.format(numFormatoSinDecimales) +
                    '</td>' +
                    '</tr>';
            }
            $('#datos_tabla').html(htmlContent);

            linea5.sort( compare );
            for(j=0;j<linea5.length;j++){
                muestra = linea5[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.valor.toString() +
                    '</td>' +
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

            
            if(linea1.length) {
                createSeries(linea1[0].valor + ' ' + medida,linea1,medida);
            }
            if(linea2.length) {
                createSeries(linea2[0].valor + ' ' + medida,linea2,medida);
            }
            if(linea3.length) {
                createSeries(linea3[0].valor + ' ' + medida,linea3,medida);
            }
            if(linea4.length) {
                createSeries(linea4[0].valor + ' ' + medida,linea4,medida);
            }
            if(linea5.length) {
                createSeries(linea5[0].valor + ' ' + medida,linea5,medida);
            }

            linea1 = [];
            linea2 = [];
            linea3 = [];
            linea4 = [];
            linea5 = [];

            $('.modal').modal('hide');
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

    if (getUrlVars()['ejeX1']) {
        paramEjeX1 = getUrlVars()['ejeX1'];
    }
    if (getUrlVars()['ejeX2']) {
        paramEjeX2 = getUrlVars()['ejeX2'];
    }

    if (getUrlVars()['ejeY']) {
        paramEjeY = getUrlVars()['ejeY'];
    }

    if (getUrlVars()['operacion']) {
        paramOperacion = getUrlVars()['operacion'];
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
        paramEjeX1 = 'municipioId as municipioId, municipioTitle as municipioTitle';
        dimension1_1 = 'municipioId';
        dimension1_2 = 'municipioTitle';
    }

    if (getUrlVars()['distrito']) {
        paramDistrito = getUrlVars()['distrito'];
        paramEjeX1 = 'distritoId as distritoId, distritoTitle as distritoTitle';
        dimension1_1 = 'distritoId';
        dimension1_2 = 'distritoTitle';
    }

    if (getUrlVars()['barrio']) {
        paramBarrio = getUrlVars()['barrio'];
        paramEjeX1 = 'barrioId as barrioId, barrioTitle as barrioTitle';
        dimension1_1 = 'barrioId';
        dimension1_2 = 'barrioTitle';
    }

    if (getUrlVars()['seccionCensalId']) {
        paramSeccionCensal = getUrlVars()['seccionCensalId'];
        paramEjeX1 = 'seccionCensalId as seccionCensalId, seccionCensalTitle as seccionCensalTitle';
        dimension1_1 = 'seccionCensalId';
        dimension1_2 = 'seccionCensalTitle';
    }

    if (getUrlVars()['territorio']) {
        paramTerritorio = getUrlVars()['territorio'];
    }
    if (getUrlVars()['tipoGrafico']) {
        paramTipoGrafico = getUrlVars()['tipoGrafico'];
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

function pintaGrafico() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('pintaGraficoBarras');
    }

    am4core.useTheme(am4themes_frozen);
  
    chart = am4core.create('chartdiv', am4charts.RadarChart);
    chart.language.locale = am4lang_es_ES;
    chart.svgContainer.htmlElement.style.height = '800';

    chart.focusFilter.stroke = am4core.color("#0f0");
    chart.focusFilter.strokeWidth = 4;
    
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'nombre';
    // categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 1;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // let label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    // label.maxWidth = 100;
    // label.tooltipText = '{ejeX}';

    // var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // yAxis.min = 0;
    
    // chart.legend = new am4charts.Legend();

    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX.parent = chart.bottomAxesContainer;

}

function createSeries(name, data, valueY) {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('createSeries');
    }

    chart.data = data;

    var series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = "nombre";
    series.name = name;
    series.strokeWidth = 3;
    series.zIndex = 2;
    // series.columns.template.tooltipText = "{name}\nIndicador: {categoryX}\nValor: {valueY}";

    return series;

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
            if(campo=='refPeriod') {
                if(h==0) {
                    valor1Dim2 = params[h];
                }else if(h==1) {
                    valor2Dim2 = params[h];
                }else if(h==2) {
                    valor3Dim2 = params[h];
                }else if(h==3) {
                    valor4Dim2 = params[h];
                }else if(h==4) {
                    valor5Dim2 = params[h];
                }
            }else {
                if(h==0) {
                    valor1Dim1 = params[h];
                }else if(h==1) {
                    valor2Dim1 = params[h];
                }else if(h==2) {
                    valor3Dim1 = params[h];
                }else if(h==3) {
                    valor4Dim1 = params[h];
                }else if(h==4) {
                    valor5Dim1 = params[h];
                }
            }
            
        }
    } else {
        filtro = filtro + campo + "='" + paramValor + "'";
        if(campo=='refPeriod') {
            valor1Dim2 = paramValor;
        } else {
            valor1Dim1 = paramValor;
        }
        
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
