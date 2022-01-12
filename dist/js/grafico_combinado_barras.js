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
var paramSexo;
var paramEdad;
var paramEdadQuinquenales;
var paramNivelEstudio;
var paramProcedencia;
var paramPaisNacimiento;
var paramNacionalidad;
var paramPaisProcedencia;
var paramProvinciaProcedencia;
var paramMunicipioProcedencia;

var filtro = '';
var lineaEdades0004 = [];
var lineaEdades0509 = [];
var lineaEdades1014 = [];
var lineaEdades1519 = [];
var lineaEdades2024 = [];
var lineaEdades2529 = [];
var lineaEdades3034 = [];
var lineaEdades3539 = [];
var lineaEdades4044 = [];
var lineaEdades4549 = [];
var lineaEdades5054 = [];
var lineaEdades5559 = [];
var lineaEdades6064 = [];
var lineaEdades6569 = [];
var lineaEdades7074 = [];
var lineaEdades7579 = [];
var lineaEdades8084 = [];
var lineaEdades8589 = [];
var lineaEdades9094 = [];
var lineaEdades95mas = [];
var dimensionEtiquetas = {};

var dimension1 = '';
var dimension2 = '';
var agrupador = '';

var chart;
var xAxis;

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
    if (!paramEjeX2) {
        dimension2 = 'refPeriod';
    } else {
        dimension2 = paramEjeX2;
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
    if (paramPaisProcedencia) {
        addFiltro(paramPaisProcedencia, 'paisProcedencia');
    }
    if (paramProvinciaProcedencia) {
        addFiltro(paramProvinciaProcedencia, 'provinciaProcedencia');
    }
    if (paramMunicipioProcedencia) {
        addFiltro(paramMunicipioProcedencia, 'municipioProcedencia');
    }
    
    let url =
        POBLACION_URL_1 +
        paramCubo +
        POBLACION_URL_2 +
        '?dimension=' +
        dimension1 +
        ' as ' +
        dimension1 +
        ',' +
        dimension2 +
        ' as ' +
        dimension2 +
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
            dimension1 +
            ' as ' +
            dimension1 +
            ',' +
            dimension2 +
            ' as ' +
            dimension2 +
            '&group=' +
            agrupador +
            '&measure=' +
            medida +
            '&page=1&pageSize=100' +
            filtro
    );

    if(DIMENSION_CON_ETIQUETA.indexOf(paramEjeX1)!=-1){
        dimensionEtiquetas = dimensionEtiquetas;
        if(paramEjeX1=='sex') {
            VALORES_SEXO.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }else if(paramEjeX1=='edadGruposQuinquenales') {
            VALORES_EDAD_QUINQUENAL.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }else if(paramEjeX1=='nacionalidad') {
            VALORES_NACIONALIDAD.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }else if(paramEjeX1=='tipoNivelEstudio') {
            VALORES_NIVEL_ESTUDIOS.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }
    }
    if(DIMENSION_CON_ETIQUETA.indexOf(paramEjeX2)!=-1){
        dimensionEtiquetas = dimensionEtiquetas;
        if(paramEjeX2=='sex') {
            VALORES_SEXO.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }else if(paramEjeX2=='edadGruposQuinquenales') {
            VALORES_EDAD_QUINQUENAL.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }else if(paramEjeX2=='nacionalidad') {
            VALORES_NACIONALIDAD.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }else if(paramEjeX2=='tipoNivelEstudio') {
            VALORES_NIVEL_ESTUDIOS.forEach(obtenerEtiquetas,dimensionEtiquetas);
        }
    }

    obtieneDatosAPI(url);
}

/* Método que obtiene los datos de la URL que se pasa como parámetros insertandonos el una variable */
function obtieneDatosAPI(url) {
    let jqxhr = $.getJSON(url)
        .done(function (data) {
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                $.i18n('dimension') +
                '</th><th>' +
                $.i18n('medida') +
                '</th></tr>';
            if (data.records) {
                for (let i = 0; i < data.records.length; i++) {                 
                    let muestra0004;
                    let muestra0509;
                    let muestr1014;
                    let muestra1519;
                    let muestra2024;
                    let muestra2529;
                    let muestra3034;
                    let muestra3539;
                    let muestra4044;
                    let muestra4549;
                    let muestra5054;
                    let muestra5559;
                    let muestra6064;
                    let muestra6569;
                    let muestr7074;
                    let muestra7579;
                    let muestra8084;
                    let muestra8589;
                    let muestra9094;
                    let muestra95mas;
                    
                    if (dimensionEtiquetas[data.records[i][dimension1]]) {
                        
                        if(data.records[i][dimension1]=='00-a-04') {
                            muestra0004 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades0004.push(muestra0004);
                        }else if(data.records[i][dimension1]=='05-a-09') {
                            muestra0509 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades0509.push(muestra0509);
                        }else if(data.records[i][dimension1]=='10-a-14') {
                            muestr1014 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades1014.push(muestr1014);
                        }else if(data.records[i][dimension1]=='15-a-19') {
                            muestra1519 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades1519.push(muestra1519);
                        }else if(data.records[i][dimension1]=='20-a-24') {
                            muestra2024 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades2024.push(muestra2024);
                        }else if(data.records[i][dimension1]=='25-a-29') {
                            muestra2529 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades2529.push(muestra2529);
                        }else if(data.records[i][dimension1]=='30-a-34') {
                            muestra3034 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades3034.push(muestra3034);
                        }else if(data.records[i][dimension1]=='35-a-39') {
                            muestra3539 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades3539.push(muestra3539);
                        }else if(data.records[i][dimension1]=='40-a-44') {
                            muestra4044 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades4044.push(muestra4044);
                        }else if(data.records[i][dimension1]=='45-a-49') {
                            muestra4549 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades4549.push(muestra4549);
                        }else if(data.records[i][dimension1]=='50-a-54') {
                            muestra5054 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades5054.push(muestra5054);
                        }else if(data.records[i][dimension1]=='55-a-59') {
                            muestra5559 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades5559.push(muestra5559);
                        }else if(data.records[i][dimension1]=='60-a-64') {
                            muestra6064 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades6064.push(muestra6064);
                        }else if(data.records[i][dimension1]=='65-a-69') {
                            muestra6569 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades6569.push(muestra6569);
                        }else if(data.records[i][dimension1]=='70-a-74') {
                            muestr7074 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades7074.push(muestr7074);
                        }else if(data.records[i][dimension1]=='75-a-79') {
                            muestra7579 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades7579.push(muestra7579);
                        }else if(data.records[i][dimension1]=='80-a-84') {
                            muestra8084 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades8084.push(muestra8084);
                        }else if(data.records[i][dimension1]=='85-a-89') {
                            muestra8589 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades8589.push(muestra8589);
                        }else if(data.records[i][dimension1]=='90-a-94') {
                            muestra9094 = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades9094.push(muestra9094);
                        }else if(data.records[i][dimension1]=='95-y-mas') {
                            muestra95mas = {
                                edad : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades95mas.push(muestra95mas);
                        }
                        
                    } else {
                        if(data.records[i][dimension1]=='00-a-04') {
                            muestra0004 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades0004.push(muestra0004);
                        }else if(data.records[i][dimension1]=='05-a-09') {
                            muestra0509 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades0509.push(muestra0509);
                        }else if(data.records[i][dimension1]=='10-a-14') {
                            muestra1014 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades1014.push(muestra1014);
                        }else if(data.records[i][dimension1]=='15-a-19') {
                            muestra1519 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades1519.push(muestra1519);
                        }else if(data.records[i][dimension1]=='20-a-24') {
                            muestra2024 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades2024.push(muestra2024);
                        }else if(data.records[i][dimension1]=='25-a-29') {
                            muestra2529 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades2529.push(muestra2529);
                        }else if(data.records[i][dimension1]=='30-a-34') {
                            muestra3034 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades3034.push(muestra3034);
                        }else if(data.records[i][dimension1]=='35-a-39') {
                            muestra3539 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades3539.push(muestra3539);
                        }else if(data.records[i][dimension1]=='40-a-44') {
                            muestra4044 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades4044.push(muestra4044);
                        }else if(data.records[i][dimension1]=='45-a-49') {
                            muestra4549 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades4549.push(muestra4549);
                        }else if(data.records[i][dimension1]=='50-a-54') {
                            muestra5054 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades5054.push(muestra5054);
                        }else if(data.records[i][dimension1]=='55-a-59') {
                            muestra5559 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades5559.push(muestra5559);
                        }else if(data.records[i][dimension1]=='60-a-64') {
                            muestra6064 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades6064.push(muestra6064);
                        }else if(data.records[i][dimension1]=='65-a-69') {
                            muestra6569 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades6569.push(muestra6569);
                        }else if(data.records[i][dimension1]=='70-a-74') {
                            muestra7074 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades7074.push(muestra7074);
                        }else if(data.records[i][dimension1]=='75-a-79') {
                            muestra7579 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades7579.push(muestra7579);
                        }else if(data.records[i][dimension1]=='80-a-84') {
                            muestra8084 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades8084.push(muestra8084);
                        }else if(data.records[i][dimension1]=='85-a-89') {
                            muestra8589 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades8589.push(muestra8589);
                        }else if(data.records[i][dimension1]=='90-a-94') {
                            muestra9094 = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades9094.push(muestra9094);
                        }else if(data.records[i][dimension1]=='95-y-mas') {
                            muestra95mas = {
                                edad : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaEdades95mas.push(muestra95mas);
                        }
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
            lineaEdades0004.sort( compare );
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                $.i18n('dimension1') +
                '</th><th>' +
                $.i18n('dimension2') +
                '</th><th>' +
                $.i18n('medida') +
                '</th></tr>';
            let j;
            for(j=0;j<lineaEdades0004.length;j++){
                muestra = lineaEdades0004[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades0509.sort( compare );
            for(j=0;j<lineaEdades0509.length;j++){
                muestra = lineaEdades0509[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades1014.sort( compare );
            for(j=0;j<lineaEdades1014.length;j++){
                muestra = lineaEdades1014[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades1519.sort( compare );
            for(j=0;j<lineaEdades1519.length;j++){
                muestra = lineaEdades1519[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades2024.sort( compare );
            for(j=0;j<lineaEdades2024.length;j++){
                muestra = lineaEdades2024[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades2529.sort( compare );
            for(j=0;j<lineaEdades2529.length;j++){
                muestra = lineaEdades2529[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades3034.sort( compare );
            for(j=0;j<lineaEdades3034.length;j++){
                muestra = lineaEdades3034[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades3539.sort( compare );
            for(j=0;j<lineaEdades3539.length;j++){
                muestra = lineaEdades3539[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades4044.sort( compare );
            for(j=0;j<lineaEdades4044.length;j++){
                muestra = lineaEdades4044[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades5054.sort( compare );
            for(j=0;j<lineaEdades5054.length;j++){
                muestra = lineaEdades5054[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades5559.sort( compare );
            for(j=0;j<lineaEdades5559.length;j++){
                muestra = lineaEdades5559[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades6064.sort( compare );
            for(j=0;j<lineaEdades6064.length;j++){
                muestra = lineaEdades6064[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades6569.sort( compare );
            for(j=0;j<lineaEdades6569.length;j++){
                muestra = lineaEdades6569[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades7074.sort( compare );
            for(j=0;j<lineaEdades7074.length;j++){
                muestra = lineaEdades7074[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades7579.sort( compare );
            for(j=0;j<lineaEdades7579.length;j++){
                muestra = lineaEdades7579[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades8084.sort( compare );
            for(j=0;j<lineaEdades8084.length;j++){
                muestra = lineaEdades8084[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades8589.sort( compare );
            for(j=0;j<lineaEdades8589.length;j++){
                muestra = lineaEdades8589[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades9094.sort( compare );
            for(j=0;j<lineaEdades9094.length;j++){
                muestra = lineaEdades9094[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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

            lineaEdades95mas.sort( compare );
            for(j=0;j<lineaEdades95mas.length;j++){
                muestra = lineaEdades95mas[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.edad.toString() +
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
            createSeries(lineaEdades0004[0].edad,lineaEdades0004);
            createSeries(lineaEdades0509[0].edad,lineaEdades0509);
            createSeries(lineaEdades1014[0].edad,lineaEdades1014);
            createSeries(lineaEdades1519[0].edad,lineaEdades1519);
            createSeries(lineaEdades2024[0].edad,lineaEdades2024);
            createSeries(lineaEdades2529[0].edad,lineaEdades2529);
            createSeries(lineaEdades3034[0].edad,lineaEdades3034);
            createSeries(lineaEdades3539[0].edad,lineaEdades3539);
            createSeries(lineaEdades4044[0].edad,lineaEdades4044);
            createSeries(lineaEdades4549[0].edad,lineaEdades4549);
            createSeries(lineaEdades5054[0].edad,lineaEdades5054);
            createSeries(lineaEdades5559[0].edad,lineaEdades5559);
            createSeries(lineaEdades6064[0].edad,lineaEdades6064);
            createSeries(lineaEdades6569[0].edad,lineaEdades6569);
            createSeries(lineaEdades7074[0].edad,lineaEdades7074);
            createSeries(lineaEdades7579[0].edad,lineaEdades7579);
            createSeries(lineaEdades8084[0].edad,lineaEdades8084);
            createSeries(lineaEdades8589[0].edad,lineaEdades8589);
            createSeries(lineaEdades9094[0].edad,lineaEdades9094);
            createSeries(lineaEdades95mas[0].edad,lineaEdades95mas);
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
        console.log('primer paramPeriodo');
        console.log(paramPeriodo);
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

   // am4core.useTheme(am4themes_frozen);

    chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.language.locale = am4lang_es_ES;
    chart.svgContainer.htmlElement.style.height = '800';

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

    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    // chart.cursor = new am4charts.XYCursor();

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

}

function createSeries(name, data) {
    chart.data = data;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'ejeY';
    series.dataFields.categoryX = 'ejeX';
    series.name = name;
    series.data = data;
    series.columns.template.tooltipText = '{edad} - {categoryX} : [bold]{valueY}[/]';
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;

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
