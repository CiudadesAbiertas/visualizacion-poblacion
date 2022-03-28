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
let paramEjeX1;
let paramEjeX2;
let paramEjeY;
let paramMedidaInd;
let paramMedidapor;

let paramCubo;
let paramTituloKey;
let paramIframe;

let paramOperacion;

let paramMunicipio;
let paramDistrito;
let paramBarrio;
let paramSeccionCensal;
let paramPeriodo;
let paramTipoGrafico;
let paramIndicadores;
let paramPaisProcedencia;
let paramProvinciaProcedencia;
let paramMunicipioProcedencia;

let valor1Dim1;
let valor2Dim1;
let valor3Dim1;
let valor4Dim1;
let valor5Dim1;
let valor6Dim1;
let valor7Dim1;
let valor8Dim1;

let valor1Dim2;
let valor2Dim2;
let valor3Dim2;
let valor4Dim2;
let valor5Dim2;
let valor6Dim2;
let valor7Dim2;
let valor8Dim2;

let filtro = '';

let dimensionEtiquetas = {};

let dimension1 = '';
let dimension1_1 = '';
let dimension1_2 = '';
let dimension2 = '';
let agrupador = '';

let chart;
let xAxis;
let medidas;

let medida1 = {};
let medida2 = {};
let medida3 = {};
let medida4 = {};
let medida5 = {};
let medida6 = {};
let medida7 = {};
let medida8 = {};
let medida9 = {};
let medida10 = {};
let medida11 = {};
let medida12 = {};
let medida13 = {};
let datos = [];
let series = [];
let periodos = [];

let linea1 = [];
let linea2 = [];
let linea3 = [];
let linea4 = [];
let linea5 = [];
let linea6 = [];
let linea7 = [];
let linea8 = [];
//Vble para controlar el tamaño
let tamanyFijobarras = $(document).height();

let valorMaximo = 0;

/*
	Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [inicializa]');
    }

    inicializaMultidioma();
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [inicializaMultidioma]');
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

    // $.i18n.debug = LOG_DEBUG_GRAFICO_RADAR;
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [inicializaDatos]');
    }

    insertaURLSAPI();
    modificaTaskMaster('iframeGraficoBarras');

    if (paramEjeX1) {
        dimension1 = paramEjeX1;
    } 
    /*if (paramEjeX2) {
        dimension2 = paramEjeX2;
    } */

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
            let paramTitulo = $.i18n(paramTituloKey);
            $('#tituloGrafico').html(decodeURI(paramTitulo));
        }
        addFiltro(paramPeriodo, 'refPeriod');
    }
    if (paramMunicipio) {
        addFiltro(paramMunicipio, 'municipioId'); 
        dimension2 = 'municipioTitle';
    }
    if (paramDistrito) {
        addFiltro(paramDistrito, 'distritoId');
        dimension2 = 'distritoTitle';
    }
    if (paramBarrio) {
        addFiltro(paramBarrio, 'barrioId');
        dimension2 = 'barrioTitle';
    }
    if (paramSeccionCensal) {
        addFiltro(paramSeccionCensal, 'seccionCensalId');
        dimension2 = 'seccionCensalTitle';
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
    
    if(paramMunicipio) {
        isFiltroMunicipio();
    }
    
    let numMedidas = 0;
    if(paramMedidas.indexOf(',') != -1) {
        medidas = paramMedidas.split(',');
        numMedidas = medidas.length;
    } else {
        numMedidas = 1;
    }

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
        if (LOG_DEBUG_GRAFICO_RADAR) {
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
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [obtieneDatosAPINueva] [url] '+url+' d '+d);
    }

    if(d==0) {
        medida1['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==1) {
        medida2['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==2) {
        medida3['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==3) {
        medida4['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==4) {
        medida5['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==5) {
        medida6['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==6) {
        medida7['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==7) {
        medida8['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==8) {
        medida9['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==9) {
        medida10['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==10) {
        medida11['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==11) {
        medida12['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }else if(d==12) {
        medida13['nombre'] = ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[d]);
    }
    
    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    if(d==0) {
                        if(data.records[i][agrupador]) {
                            medida1[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida1[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==1) {
                        if(data.records[i][agrupador]) {
                            medida2[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida2[data.records[i][dimension2]] = 0;
                        }
                        
                    }else if(d==2) {
                        if(data.records[i][agrupador]) {
                            medida3[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida3[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==3) {
                        if(data.records[i][agrupador]) {
                            medida4[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida4[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==4) {
                        if(data.records[i][agrupador]) {
                            medida5[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida5[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==5) {
                        if(data.records[i][agrupador]) {
                            medida6[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida6[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==6) {
                        if(data.records[i][agrupador]) {
                            medida7[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida7[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==7) {
                        if(data.records[i][agrupador]) {
                            medida8[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida8[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==8) {
                        if(data.records[i][agrupador]) {
                            medida9[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida9[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==9) {
                        if(data.records[i][agrupador]) {
                            medida10[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida10[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==10) {
                        if(data.records[i][agrupador]) {
                            medida11[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida11[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==11) {
                        if(data.records[i][agrupador]) {
                            medida12[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida12[data.records[i][dimension2]] = 0;
                        }
                    }else if(d==12) {
                        if(data.records[i][agrupador]) {
                            medida13[data.records[i][dimension2]] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            medida13[data.records[i][dimension2]] = 0;
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
                }else if(d==5) {
                    datos.push(medida6);
                }else if(d==6) {
                    datos.push(medida7);
                }else if(d==7) {
                    datos.push(medida8);
                }else if(d==8) {
                    datos.push(medida9);
                }else if(d==9) {
                    datos.push(medida10);
                }else if(d==10) {
                    datos.push(medida11);
                }else if(d==11) {
                    datos.push(medida12);
                }else if(d==12) {
                    datos.push(medida13);
                }
            }
            if (data.next) {
                obtieneDatosAPINueva(data.next,d);
            }
        })
        .always(function () {
            pintaGrafico();
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
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [obtieneDatosAPI] [url] '+url+' medida '+medida);
    }

    let jqxhr = $.getJSON(url)
        .done(function (data) {
            if (data.records) {
                for (let i = 0; i < data.records.length; i++) {                 
                    let muestra1;
                    let muestra2;
                    let muestra3;
                    let muestra4;
                    let muestra5;
                    let muestra6;
                    let muestra7;
                    let muestra8;
                    
                    if(data.records[i][dimension1_1]==valor1Dim1) {
                        muestra1 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra1[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea1.push(muestra1);
                    }else if(data.records[i][dimension1_1]==valor2Dim1) {
                        muestra2 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra2[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea2.push(muestra2);
                    }else if(data.records[i][dimension1_1]==valor3Dim1) {
                        muestra3 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra3[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea3.push(muestra3);
                    }else if(data.records[i][dimension1_1]==valor4Dim1) {
                        muestra4 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra4[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea4.push(muestra4);
                    }else if(data.records[i][dimension1_1]==valor5Dim1) {
                        muestra5 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra5[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea5.push(muestra5);
                    }else if(data.records[i][dimension1_1]==valor6Dim1) {
                        muestra6 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra6[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea6.push(muestra6);
                    }else if(data.records[i][dimension1_1]==valor7Dim1) {
                        muestra7 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra7[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea7.push(muestra7);
                    }else if(data.records[i][dimension1_1]==valor8Dim1) {
                        muestra8 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            ejeY : data.records[i][agrupador]
                        };
                        muestra8[medida] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                        linea8.push(muestra8);
                    }
                    
                }
            }
            if (data.next) {
                obtieneDatosAPI(data.next);
            } 
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

            pintaGrafico();
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
            if(linea6.length) {
                createSeries(linea6[0].valor + ' ' + medida,linea6,medida);
            }
            if(linea7.length) {
                createSeries(linea7[0].valor + ' ' + medida,linea7,medida);
            }
            if(linea8.length) {
                createSeries(linea8[0].valor + ' ' + medida,linea8,medida);
            }

            linea1 = [];
            linea2 = [];
            linea3 = [];
            linea4 = [];
            linea5 = [];
            linea6 = [];
            linea7 = [];
            linea8 = [];

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
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [insertaURLSAPI]');
    }

    $('#urlAPIDoc').attr('href', DOC_API);
    $('#maximizar').attr('href', window.location.href);
    $('#maximizar').attr('target', '_blank');
}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam() {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [capturaParam]');
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
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [pintaGrafico]');
    }

    am4core.useTheme(am4themes_frozen);
    am4core.options.autoDispose = true;
    
    chart = am4core.create('chartdiv', am4charts.RadarChart);
    chart.language.locale = am4lang_es_ES;
    chart.svgContainer.htmlElement.style.height = '800';

    chart.focusFilter.stroke = am4core.color("#0f0");
    chart.focusFilter.strokeWidth = 4;
    
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'nombre';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.max = (valorMaximo); 
    
    chart.legend = new am4charts.Legend();

}

function createSeries(name, data, valueY) {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [createSeries] [name] '+name+' [valueY] '+valueY);
    }

    chart.data = data;

    let series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = "nombre";
    series.name = name;
    series.strokeWidth = 3;
    series.zIndex = 2;

    return series;

}

/*
	Método que muestra u oculta la tabla con datos debajo de la visualización
*/
function mostrarDatos() {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [mostrarDatos]');
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
} //iframeRadar

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log('[radar] [addFiltro] [paramValor] '+paramValor+' [campo] '+campo);
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
            if(campo=='barrioId') { //municipioId distritoId barrioId seccionCensalId
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
                }else if(h==5) {
                    valor5Dim2 = params[h];
                }else if(h==6) {
                    valor5Dim2 = params[h];
                }else if(h==7) {
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
                }else if(h==5) {
                    valor5Dim1 = params[h];
                }else if(h==6) {
                    valor5Dim1 = params[h];
                }else if(h==7) {
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

    if (LOG_DEBUG_GRAFICO_RADAR) {
        console.log("[radar] [addFiltro] [filtro:" + filtro + "]");
    }
}