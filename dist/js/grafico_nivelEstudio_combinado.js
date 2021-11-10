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

var filtro = '';
var lineaNiveles00 = [];
var lineaNiveles10 = [];
var lineaNiveles20 = [];
var lineaNiveles21 = [];
var lineaNiveles22 = [];
var lineaNiveles30 = [];
var lineaNiveles31 = [];
var lineaNiveles32 = [];
var lineaNiveles40 = [];
var lineaNiveles41 = [];
var lineaNiveles42 = [];
var lineaNiveles43 = [];
var lineaNiveles44 = [];
var lineaNiveles45 = [];
var lineaNiveles46 = [];
var lineaNiveles47 = [];
var lineaNiveles48 = [];
var lineaNiveles99 = [];
var dimensionEtiquetas = {};

var dimension1 = '';
var dimension2 = '';
var agrupador = '';

var chart;
var xAxis;

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

    let urlEtiquetas =
        URL_API +
        '/data-cube/data-structure-definition/dimension/' +
        dimension1 +
        '/value';
    $.getJSON(urlEtiquetas)
        .done(function (data) {
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    dimensionEtiquetas[data.records[i].id] = data.records[i].title;
                    if(dimension1 == 'edadGruposQuinquenales'){
                        if(data.records[i].title == 'De 5 a 9 años') {
                            dimensionEtiquetas[data.records[i].id] = 'De 05 a 09 años';
                        }
                        if(data.records[i].title == 'De 0 a 4 años') {
                            dimensionEtiquetas[data.records[i].id] = 'De 00 a 04 años';
                        }
                    }
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
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                $.i18n('dimension') +
                '</th><th>' +
                $.i18n('medida') +
                '</th></tr>';
            if (data.records) {
                for (let i = 0; i < data.records.length; i++) {                 
                    let muestra00;
                    let muestra10;
                    let muestra20;
                    let muestra21;
                    let muestra22;
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
                        
                        if(data.records[i][dimension1]=='00') {
                            muestra00 = {
                                nivel : dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles00.push(muestra00);
                        }else if(data.records[i][dimension1]=='10') {
                            muestra10 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles10.push(muestra10);
                        }else if(data.records[i][dimension1]=='20') {
                            muestra20 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles20.push(muestra20);
                        }else if(data.records[i][dimension1]=='21') {
                            muestra21 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles21.push(muestra21);
                        }else if(data.records[i][dimension1]=='22') {
                            muestra22 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles22.push(muestra22);
                        }else if(data.records[i][dimension1]=='30') {
                            muestra30 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles30.push(muestra30);
                        }else if(data.records[i][dimension1]=='31') {
                            muestra31 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles31.push(muestra31);
                        }else if(data.records[i][dimension1]=='32') {
                            muestra32 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles32.push(muestra32);
                        }else if(data.records[i][dimension1]=='40') {
                            muestra40 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles40.push(muestra40);
                        }else if(data.records[i][dimension1]=='41') {
                            muestra41 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles41.push(muestra41);
                        }else if(data.records[i][dimension1]=='42') {
                            muestra42 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles42.push(muestra42);
                        }else if(data.records[i][dimension1]=='43') {
                            muestra43 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles43.push(muestra43);
                        }else if(data.records[i][dimension1]=='44') {
                            muestra44 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles44.push(muestra44);
                        }else if(data.records[i][dimension1]=='45') {
                            muestra45 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles45.push(muestra45);
                        }else if(data.records[i][dimension1]=='46') {
                            muestr46 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles46.push(muestr46);
                        }else if(data.records[i][dimension1]=='47') {
                            muestra47 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles47.push(muestra47);
                        }else if(data.records[i][dimension1]=='48') {
                            muestra48 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles48.push(muestra48);
                        }else if(data.records[i][dimension1]=='99') {
                            muestra99 = {
                                nivel :dimensionEtiquetas[data.records[i][dimension1]],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles99.push(muestra99);
                        }
                        
                    } else {
                        if(data.records[i][dimension1]=='00') {
                            muestra00 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles00.push(muestra00);
                        }else if(data.records[i][dimension1]=='10') {
                            muestra10 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles10.push(muestra10);
                        }else if(data.records[i][dimension1]=='20') {
                            muestra20 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles20.push(muestra20);
                        }else if(data.records[i][dimension1]=='21') {
                            muestra21 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles21.push(muestra21);
                        }else if(data.records[i][dimension1]=='22') {
                            muestra22 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles22.push(muestra22);
                        }else if(data.records[i][dimension1]=='30') {
                            muestra30 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles30.push(muestra30);
                        }else if(data.records[i][dimension1]=='31') {
                            muestra31 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles31.push(muestra31);
                        }else if(data.records[i][dimension1]=='32') {
                            muestra32 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles32.push(muestra32);
                        }else if(data.records[i][dimension1]=='40') {
                            muestra40 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles40.push(muestra40);
                        }else if(data.records[i][dimension1]=='41') {
                            muestra41 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles41.push(muestra41);
                        }else if(data.records[i][dimension1]=='42') {
                            muestra42 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles42.push(muestra42);
                        }else if(data.records[i][dimension1]=='43') {
                            muestra43 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles43.push(muestra43);
                        }else if(data.records[i][dimension1]=='44') {
                            muestra44 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles44.push(muestra44);
                        }else if(data.records[i][dimension1]=='45') {
                            muestra45 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles45.push(muestra45);
                        }else if(data.records[i][dimension1]=='46') {
                            muestr46 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles46.push(muestr46);
                        }else if(data.records[i][dimension1]=='47') {
                            muestra47 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles47.push(muestra47);
                        }else if(data.records[i][dimension1]=='48') {
                            muestra48 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles48.push(muestra48);
                        }else if(data.records[i][dimension1]=='99') {
                            muestra99 = {
                                nivel : data.records[i][dimension1],
                                ejeX : data.records[i][dimension2],
                                ejeY : data.records[i][agrupador]
                            };
                            lineaNiveles99.push(muestra99);
                        }
                       
                    }
                    
                    
                }
            }
            if (data.next) {
                obtieneDatosAPI(data.next);
            } /*else {
                pintaGrafico();
                createSeries(lineaNiveles0004[0].nivel,lineaNiveles0004);
                createSeries(lineaNiveles0509[0].nivel,lineaNiveles0509);
                
            }*/
        })
        .always(function () {
            lineaNiveles00.sort( compare );
            let htmlContent =
                "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>" +
                $.i18n('dimension') +
                '</th><th>' +
                $.i18n('dimension2') +
                '</th><th>' +
                $.i18n('medida') +
                '</th></tr>';
            let j;
            for(j=0;j<lineaNiveles00.length;j++){
                muestra = lineaNiveles00[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles10.sort( compare );
            for(j=0;j<lineaNiveles10.length;j++){
                muestra = lineaNiveles10[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles20.sort( compare );
            for(j=0;j<lineaNiveles20.length;j++){
                muestra = lineaNiveles20[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles21.sort( compare );
            for(j=0;j<lineaNiveles21.length;j++){
                muestra = lineaNiveles21[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles22.sort( compare );
            for(j=0;j<lineaNiveles22.length;j++){
                muestra = lineaNiveles22[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles30.sort( compare );
            for(j=0;j<lineaNiveles30.length;j++){
                muestra = lineaNiveles30[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles31.sort( compare );
            for(j=0;j<lineaNiveles31.length;j++){
                muestra = lineaNiveles31[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles32.sort( compare );
            for(j=0;j<lineaNiveles32.length;j++){
                muestra = lineaNiveles32[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles40.sort( compare );
            for(j=0;j<lineaNiveles40.length;j++){
                muestra = lineaNiveles40[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles41.sort( compare );
            for(j=0;j<lineaNiveles41.length;j++){
                muestra = lineaNiveles41[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles42.sort( compare );
            for(j=0;j<lineaNiveles42.length;j++){
                muestra = lineaNiveles42[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles43.sort( compare );
            for(j=0;j<lineaNiveles43.length;j++){
                muestra = lineaNiveles43[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles44.sort( compare );
            for(j=0;j<lineaNiveles44.length;j++){
                muestra = lineaNiveles44[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles45.sort( compare );
            for(j=0;j<lineaNiveles45.length;j++){
                muestra = lineaNiveles45[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles46.sort( compare );
            for(j=0;j<lineaNiveles46.length;j++){
                muestra = lineaNiveles46[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles47.sort( compare );
            for(j=0;j<lineaNiveles47.length;j++){
                muestra = lineaNiveles47[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles48.sort( compare );
            for(j=0;j<lineaNiveles48.length;j++){
                muestra = lineaNiveles48[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

            lineaNiveles99.sort( compare );
            for(j=0;j<lineaNiveles99.length;j++){
                muestra = lineaNiveles99[j];
                let numeralEjeY = numeral(muestra.ejeY);
                htmlContent =
                    htmlContent +
                    '<tr>' +
                    '<td>' +
                    muestra.nivel.toString() +
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

           
            htmlContent = htmlContent + '</table></div></div>';
            $('#datos_tabla').html(htmlContent);

            pintaGrafico();
            if(lineaNiveles00.length>0) {
                createSeries(lineaNiveles00[0].nivel,lineaNiveles00);
            }
            if(lineaNiveles10.length>0) {
                createSeries(lineaNiveles10[0].nivel,lineaNiveles10);
            }
            if(lineaNiveles20.length>0) {
                createSeries(lineaNiveles20[0].nivel,lineaNiveles20);
            }
            if(lineaNiveles21.length>0) {
                createSeries(lineaNiveles21[0].nivel,lineaNiveles21);
            }
            if(lineaNiveles22.length>0) {
                createSeries(lineaNiveles22[0].nivel,lineaNiveles22);
            }
            if(lineaNiveles30.length>0) {
                createSeries(lineaNiveles30[0].nivel,lineaNiveles30);
            }
            if(lineaNiveles31.length>0) {
                createSeries(lineaNiveles31[0].nivel,lineaNiveles31);
            }
            if(lineaNiveles32.length>0) {
                createSeries(lineaNiveles32[0].nivel,lineaNiveles32);
            }
            if(lineaNiveles40.length>0) {
                createSeries(lineaNiveles40[0].nivel,lineaNiveles40);
            }
            if(lineaNiveles41.length>0) {
                createSeries(lineaNiveles41[0].nivel,lineaNiveles41);
            }
            if(lineaNiveles42.length>0) {
                createSeries(lineaNiveles42[0].nivel,lineaNiveles42);
            }
            if(lineaNiveles43.length>0) {
                createSeries(lineaNiveles43[0].nivel,lineaNiveles43);
            }
            if(lineaNiveles44.length>0) {
                createSeries(lineaNiveles44[0].nivel,lineaNiveles44);
            }
            if(lineaNiveles45.length>0) {
                createSeries(lineaNiveles45[0].nivel,lineaNiveles45);
            }
            if(lineaNiveles46.length>0) {
                createSeries(lineaNiveles46[0].nivel,lineaNiveles46);
            }
            if(lineaNiveles47.length>0) {
                createSeries(lineaNiveles47[0].nivel,lineaNiveles47);
            }
            if(lineaNiveles48.length>0) {
                createSeries(lineaNiveles48[0].nivel,lineaNiveles48);
            }
            if(lineaNiveles99.length>0) {
                createSeries(lineaNiveles99[0].nivel,lineaNiveles99);
            }

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
    } else {
        paramCubo = 'estudios';
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

function pintaGrafico() {
    if (LOG_DEBUG_GRAFICO_BARRAS) {
        console.log('pintaGraficoBarras');
    }

    am4core.useTheme(am4themes_frozen);
    am4core.useTheme(am4themes_animated);

    chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.language.locale = am4lang_es_ES;
    chart.svgContainer.htmlElement.style.height = '800';

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

    chart.cursor = new am4charts.XYCursor();

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right';
    chart.legend.labels.template.maxWidth = 80;
	chart.legend.scrollable = true;
    chart.legend.labels.template.truncate = false;   
    chart.legend.itemContainers.template.tooltipText = '{category}';

}

function createSeries(name, data) {

    chart.data = data;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'ejeY';
    series.dataFields.categoryX = 'ejeX';
    series.name = name;
    series.data = data;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

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
