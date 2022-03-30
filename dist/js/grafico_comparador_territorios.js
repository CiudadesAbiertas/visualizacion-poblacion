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
let paramSexo;
let paramEdad;
let paramEdadQuinquenales;
let paramNivelEstudio;
let paramProcedencia;
let paramPaisNacimiento;
let paramNacionalidad;

let valor1Dim1;
let valor2Dim1;
let valor3Dim1;
let valor4Dim1;
let valor5Dim1;
let valor6Dim1;
let valor7Dim1;
let valor8Dim1;
let valor9Dim1;
let valor10Dim1;
let valor11Dim1;

let valor1Dim2;
let valor2Dim2;
let valor3Dim2;
let valor4Dim2;
let valor5Dim2;

let valoresDim2 = [];
let valoresDim1 = [];

let filtro = '';
let lineas = new Map();
let linea1 = [];
let linea2 = [];
let linea3 = [];
let linea4 = [];
let linea5 = [];
let linea6 = [];
let linea7 = [];
let linea8 = [];
let linea9 = [];
let linea10 = [];
let linea11 = [];

let dimensionEtiquetas = {};

let dimension1 = '';
let dimension1_1 = '';
let dimension1_2 = '';
let dimension2 = '';
let agrupador = '';

let chart;
let xAxis;
let medidas;
let periodos = [];

let valorMaximo = 0;

//Vble para controlar el tamaño
let tamanyFijobarras = $(document).height();

/*
	Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [inicializa]');
    }

    inicializaMultidioma();
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [inicializaMultidioma]');
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

    // $.i18n.debug = LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS;
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [inicializaDatos]');
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
    if (paramPaisProcedencia) {
        addFiltro(paramPaisProcedencia, 'paisProcedencia');
    }
    if (paramProvinciaProcedencia) {
        addFiltro(paramProvinciaProcedencia, 'provinciaProcedencia');
    }
    if (paramMunicipioProcedencia) {
        addFiltro(paramMunicipioProcedencia, 'municipioProcedencia');
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
    if (paramPaisNacimiento) {
        addFiltro(paramPaisNacimiento, 'paisNacimiento');
    }
    if (paramProcedencia) {
        addFiltro(paramProcedencia, 'procedencia');
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

        obtieneDatosAPI(url,medida,d,numMedidas);
    }
    
}

/* Método que obtiene los datos de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPI(url,medida,d,numMedidas) {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [obtieneDatosAPI] [url] '+ url +' [medida] '+ ' [d] '+d+ ' [numMedidas] '+numMedidas);
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
                    let muestra9;
                    let muestra10;
                    let muestra11;
                    
                    let muestra;
                    let linea;
                    if(!lineas.get(data.records[i][dimension1_1])) {
                        linea = [];
                    } else {
                        linea = lineas.get(data.records[i][dimension1_1]);
                    }

                    muestra = {
                        valor : data.records[i][dimension1_2],
                        ejeX : data.records[i][dimension2],
                        medida : medida
                    };
                    if(data.records[i][agrupador]) {
                        muestra[medida] = data.records[i][agrupador];
                        muestra['ejeY'] = data.records[i][agrupador];
                        if(valorMaximo < data.records[i][agrupador]) {
                            valorMaximo = data.records[i][agrupador];
                        }
                    }else{
                        muestra[medida] = 0;
                        muestra['ejeY'] = 0;
                    }
                    
                    linea.push(muestra);

                    lineas.set(data.records[i][dimension1_1], linea);

                    /*if(data.records[i][dimension1_1]==valor1Dim1) {
                        muestra1 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        if(data.records[i][agrupador]) {
                            muestra1[medida] = data.records[i][agrupador];
                            muestra1['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra1[medida] = 0;
                            muestra1['ejeY'] = 0;
                        }
                        
                        linea1.push(muestra1);
                    }else if(data.records[i][dimension1_1]==valor2Dim1) {
                        muestra2 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        if(data.records[i][agrupador]) {
                            muestra2[medida] = data.records[i][agrupador];
                            muestra2['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra2[medida] = 0;
                            muestra2['ejeY'] = 0;
                        }
                        linea2.push(muestra2);
                    }else if(data.records[i][dimension1_1]==valor3Dim1) {
                        muestra3 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        if(data.records[i][agrupador]) {
                            muestra3[medida] = data.records[i][agrupador];
                            muestra3['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra3[medida] = 0;
                            muestra3['ejeY'] = 0;
                        }
                        linea3.push(muestra3);
                    }else if(data.records[i][dimension1_1]==valor4Dim1) {
                        muestra4 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        if(data.records[i][agrupador]) {
                            muestra4[medida] = data.records[i][agrupador];
                            muestra4['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra4[medida] = 0;
                            muestra4['ejeY'] = 0;
                        }
                        linea4.push(muestra4);
                    }else if(data.records[i][dimension1_1]==valor5Dim1) {
                        muestra5 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra5[medida] = data.records[i][agrupador];
                            muestra5['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra5[medida] = 0;
                            muestra5['ejeY'] = 0;
                        }
                        linea5.push(muestra5);
                    }else if(data.records[i][dimension1_1]==valor6Dim1) {
                        muestra6 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra6[medida] = data.records[i][agrupador];
                            muestra6['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra6[medida] = 0;
                            muestra6['ejeY'] = 0;
                        }
                        linea6.push(muestra6);
                    }else if(data.records[i][dimension1_1]==valor7Dim1) {
                        muestra7 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra7[medida] = data.records[i][agrupador];
                            muestra7['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra7[medida] = 0;
                            muestra7['ejeY'] = 0;
                        }
                        linea7.push(muestra7);
                    }else if(data.records[i][dimension1_1]==valor8Dim1) {
                        muestra8 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra8[medida] = data.records[i][agrupador];
                            muestra8['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra8['ejeY'] = 0;
                            muestra8[medida] = 0;
                        }
                        linea8.push(muestra8);
                    }else if(data.records[i][dimension1_1]==valor9Dim1) {
                        muestra9 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra9[medida] = data.records[i][agrupador];
                            muestra9['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra9['ejeY'] = 0;
                            muestra9[medida] = 0;
                        }
                        linea9.push(muestra9);
                    }else if(data.records[i][dimension1_1]==valor10Dim1) {
                        muestra10 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra10[medida] = data.records[i][agrupador];
                            muestra10['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra10[medida] = 0;
                            muestra10['ejeY'] = 0;
                        }
                        linea10.push(muestra10);
                    }else if(data.records[i][dimension1_1]==valor11Dim1) {
                        muestra11 = {
                            valor : data.records[i][dimension1_2],
                            ejeX : data.records[i][dimension2],
                            medida : medida
                        };
                        
                        if(data.records[i][agrupador]) {
                            muestra11[medida] = data.records[i][agrupador];
                            muestra11['ejeY'] = data.records[i][agrupador];
                            if(valorMaximo < data.records[i][agrupador]) {
                                valorMaximo = data.records[i][agrupador];
                            }
                        }else{
                            muestra11[medida] = 0;
                            muestra11['ejeY'] = 0;
                        }
                        linea11.push(muestra11);
                    }*/
                    
                }
            }
            if (data.next) {
                obtieneDatosAPI(data.next);
            } else {
                pintaGrafico();
            }
        })
        .always(function () {

            let htmlContent =
                    "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                    ETIQUETAS_TABLA.get(dimension1_2) + 
                    '</th><th>' +
                    ETIQUETAS_TABLA.get(dimension2) +
                    '</th><th>' +
                    'Medida' +
                    '</th><th>' +
                    'Valor' +
                    '</th></tr>';
                let j;
            let l;
            for(l=0;l<valoresDim1.length;l++) {
                let valorDim1 = valoresDim1[l];
                let linea = lineas.get(valorDim1);

                linea.sort( compare );
                let j;
                for(j=0;j<linea.length;j++){
                    let muestra = linea[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }
                if(numMedidas!=1) {
                    let a;
                    for(a=0;a<medidas.length;a++) {
                        
                        if(linea.length) {
                            createSeries(linea[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea,medidas[a]);
                        }
                    }
                } else {
                    if(linea.length) {
                        createSeries(linea[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea,medida);
                    }
                }
                $('#datos_tabla').html(htmlContent);
            }
            htmlContent = htmlContent + '</table></div></div>';
            $('#datos_tabla').html(htmlContent);

            /*if(numMedidas==1 || medidas.length==d+1){
                linea1.sort( compare );
                let htmlContent =
                    "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                    ETIQUETAS_TABLA.get(dimension1_2) + 
                    '</th><th>' +
                    ETIQUETAS_TABLA.get(dimension2) +
                    '</th><th>' +
                    'Medida' +
                    '</th><th>' +
                    'Valor' +
                    '</th></tr>';
                let j;
                for(j=0;j<linea1.length;j++){
                    let muestra = linea1[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }
                $('#datos_tabla').html(htmlContent);

                linea2.sort( compare );
                for(j=0;j<linea2.length;j++){
                    let muestra = linea2[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }
                $('#datos_tabla').html(htmlContent);

                linea3.sort( compare );
                for(j=0;j<linea3.length;j++){
                    let muestra = linea3[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }
                $('#datos_tabla').html(htmlContent);

                linea4.sort( compare );
                for(j=0;j<linea4.length;j++){
                    let muestra = linea4[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }
                $('#datos_tabla').html(htmlContent);

                linea5.sort( compare );
                for(j=0;j<linea5.length;j++){
                    let muestra = linea5[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                linea6.sort( compare );
                for(j=0;j<linea6.length;j++){
                    let muestra = linea6[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                linea7.sort( compare );
                for(j=0;j<linea7.length;j++){
                    let muestra = linea7[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                linea8.sort( compare );
                for(j=0;j<linea8.length;j++){
                    let muestra = linea8[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                linea9.sort( compare );
                for(j=0;j<linea9.length;j++){
                    let muestra = linea9[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                linea10.sort( compare );
                for(j=0;j<linea10.length;j++){
                    let muestra = linea10[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                linea11.sort( compare );
                for(j=0;j<linea11.length;j++){
                    let muestra = linea11[j];
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
                        muestra.medida.toString() +
                        '</td>' +
                        '<td>' +
                        numeralEjeY.format(numFormato) +
                        '</td>' +
                        '</tr>';
                }

                htmlContent = htmlContent + '</table></div></div>';
                $('#datos_tabla').html(htmlContent);

                if(numMedidas!=1) {
                    let a;
                    for(a=0;a<medidas.length;a++) {
                        
                        if(linea1.length) {
                            createSeries(linea1[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea1,medidas[a]);
                        }
                        if(linea2.length) {
                            createSeries(linea2[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea2,medidas[a]);
                        }
                        if(linea3.length) {
                            createSeries(linea3[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea3,medidas[a]);
                        }
                        if(linea4.length) {
                            createSeries(linea4[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea4,medidas[a]);
                        }
                        if(linea5.length) {
                            createSeries(linea5[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea5,medidas[a]);
                        }
                        if(linea6.length) {
                            createSeries(linea6[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea6,medidas[a]);
                        }
                        if(linea7.length) {
                            createSeries(linea7[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea7,medidas[a]);
                        }
                        if(linea8.length) {
                            createSeries(linea8[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea8,medidas[a]);
                        }
                        if(linea9.length) {
                            createSeries(linea9[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea9,medidas[a]);
                        }
                        if(linea10.length) {
                            createSeries(linea10[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea10,medidas[a]);
                        }
                        if(linea11.length) {
                            createSeries(linea11[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medidas[a]),linea11,medidas[a]);
                        }
                    }
                } else {
                    if(linea1.length) {
                        createSeries(linea1[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea1,medida);
                    }
                    if(linea2.length) {
                        createSeries(linea2[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea2,medida);
                    }
                    if(linea3.length) {
                        createSeries(linea3[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea3,medida);
                    }
                    if(linea4.length) {
                        createSeries(linea4[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea4,medida);
                    }
                    if(linea5.length) {
                        createSeries(linea5[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea5,medida);
                    }
                    if(linea6.length) {
                        createSeries(linea6[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea6,medida);
                    }
                    if(linea7.length) {
                        createSeries(linea7[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea7,medida);
                    }
                    if(linea8.length) {
                        createSeries(linea8[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea8,medida);
                    }
                    if(linea9.length) {
                        createSeries(linea9[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea9,medida);
                    }
                    if(linea10.length) {
                        createSeries(linea10[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea10,medida);
                    }
                    if(linea11.length) {
                        createSeries(linea11[0].valor + ' ' + ETIQUETAS_INDICES_PORCENTAJES_DSD.get(medida),linea11,medida);
                    }
                }

                $('.modal').modal('hide');
            }*/
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
function insertaURLSAPI(urljson, urlcsv) {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [insertaURLSAPI]');
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
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [capturaParam]');
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
}

function pintaGrafico() {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [pintaGrafico]');
    }

    am4core.useTheme(am4themes_frozen);
    am4core.options.autoDispose = true;
    
    chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.language.locale = am4lang_es_ES;
    chart.svgContainer.htmlElement.style.height = '800'

    chart.focusFilter.stroke = am4core.color("#0f0");
    chart.focusFilter.strokeWidth = 4;
    
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'ejeX';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;

    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 100;
    label.tooltipText = '{ejeX}';

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.max = (valorMaximo); 

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right';
    chart.legend.labels.template.maxWidth = 80;
	chart.legend.scrollable = true;
    chart.legend.labels.template.truncate = false;   
    chart.legend.itemContainers.template.tooltipText = '{name}';

}

function createSeries(name, data, medida) {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [createSeries] [name] '+ name + ' [medida] '+medida);
    }

    chart.data = data;
    // chart.cursor = new am4charts.XYCursor();
    let series;
    if(!medida) {
        medida = 'ejeY';
    }
    if(paramTipoGrafico=='barras') {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = medida;
        series.dataFields.categoryX = 'ejeX';
        series.name = name;
        series.data = data;
        series.columns.template.tooltipText = name+' - {categoryX} : [bold]{valueY}[/]';
        let columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
    }else if(paramTipoGrafico=='lineas'){
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = medida;
        series.dataFields.categoryX = 'ejeX';
        series.name = name;
        series.data = data;
        series.tooltipText = name+' - {categoryX} : [bold]{valueY}[/]';
        series.strokeWidth = 3;
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.tooltipText =  '{categoryX}: [bold]{valueY}[/]';
    }
    return series;

}

/*
	Método que muestra u oculta la tabla con datos debajo de la visualización
*/
function mostrarDatos() {
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log('[comparador_territorios] [mostrarDatos]');
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
    if (LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS) {
        console.log(
            '[addFiltro] [paramValor:' +
                paramValor +
                '] [campo:' +
                campo
        );
    }
    if (!filtro) {
        filtro = filtro + '&where=(';
    } else {
        filtro = filtro + ' and (';
    }
    
        
    
    if (paramValor.includes(',')) {
        let params = paramValor.split(',');
        if(campo!='age') {
            if(campo=='refPeriod') {
                valoresDim2 = params;
            }else{
                valoresDim1 = params; 
            }
        }
        
        let h;
        for (h = 0; h < params.length; h++) {
            filtro = filtro + campo + "='" + params[h];
            if (h < params.length - 1) {
                filtro = filtro + "' or ";
            } else {
                filtro = filtro + "'";
            }
            /*if(campo!='age') {
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
            }*/
        }
    } else {
        filtro = filtro + campo + "='" + paramValor + "'";
        if(campo!='age') {
            if(campo=='refPeriod') {
                valoresDim2[0] = paramValor;
                // valor1Dim2 = paramValor;
            } else {
                valoresDim1[0] = paramValor;
                // valor1Dim1 = paramValor;
            }
        }
        
    }
    filtro = filtro + ')';

    
}
