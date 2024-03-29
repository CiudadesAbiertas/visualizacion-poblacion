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

// variables para normalizar datos
var numFormatoSinDecimales = '0,0';
var numFormato = '0,0.[00]';
var importeFormato = '0,0.[00] $';
var importeFormatoSinDecimales = '0,0 $';
var ultimoPeriodo = '2016';

var dsdEdadQuinquenales = {};
var dsdSexo = {};

/* 
    Métodos para el arranque de la web
*/
function initComun() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [initComun]');
    }

    multidiomaComun();
    numeralInit();
}

/* 
    Función para el multiidioma 
*/
function multidiomaComun() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [multidiomaComun]');
    }

    let langUrl = sessionStorage.getItem('lang');
    if (!langUrl) {
        langUrl = 'es';
    }
    $.i18n().locale = langUrl;
    document.documentElement.lang = $.i18n().locale;
    $('html').i18n();

    jQuery(function ($) {
        //carga de los idiomas
        $.i18n()
            .load({
                en: 'dist/i18n/en.json',
                es: 'dist/i18n/es.json',
                gl: 'dist/i18n/gl.json',
            })
            .done(function () {
                $('html').i18n();
            });

        //configuración del botón que cambia de idioma
        $('.switch-locale').click(function () {
            let r = confirm(
                'Si se cambia de idioma se perderán las posibles busquedas realizadas'
            );
            if (r) {
                $('.modal').modal('show');
                $('#capaInicio').show();
                $('#capaEdadQuinquenales').show();
                $('#capaEdadSimple').show();
                $('#capaNacionalidad').show();
                $('#capaAyuda').show();
                $.i18n().locale = $(this).data('locale');
                $('html').i18n();
                document.documentElement.lang = $.i18n().locale;

                sessionStorage.setItem('lang', $(this).data('locale'));
                $('iframe').each(function () {
                    let src = $(this).attr('src');
                    $(this).attr('src', src);
                });

                taskMaster = {
                    iframeGraficoBarras: true,
                    iframeGraficoMapa: true,
                };

                checkTaskMaster();
            }
        });
    });

    // Enable debug
    // $.i18n.debug = LOG_DEBUG_COMUN;
}

/*
aplicaFiltroElement es la funcion por defecto que mas se usa
Parametros
elementoId : ej. selectEdad
campo : ej. edad
arrayIframes : iFrames sobre los que afecta
 */
function aplicaFiltroElement(elementoId, campo, arrayIframes, tipoCombo) {
    return aplicaFiltroElementGlobal(elementoId, campo, arrayIframes, tipoCombo);
}

/*
aplicaFiltroElementGlobal
Parametros
elementoId : ej. selectEdad
campo : ej. edad
arrayIframes : iFrames sobre los que afecta
 */
function aplicaFiltroElementGlobal(elementoId, campo, arrayIframes, tipoCombo) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[general] [aplicaFiltroElementGlobal] [elementoId:' +
            elementoId +
            '] [campo:' +
            campo +
            '] [arrayIframes:' +
            arrayIframes +
            ']'
        );
    }

    if (tipoCombo == 'checkbox') {
        let url = '';
        let i;
        let criteriosEstablecido = false;
        let value = '';
        for (i = 0; i < arrayIframes.length; i++) {
            let iframe = arrayIframes[i];
            url = $('#' + iframe).attr('src');
            let arrayComponente = JSON.parse(sessionStorage.getItem(elementoId));
            let o;
            value = '';
            if (arrayComponente) {
                for (o = 0; o < arrayComponente.length; o++) {
                    let key = arrayComponente[o].id;
                    if ($('#' + elementoId + key).prop('checked')) {
                        if (value) {
                            value = value + ',';
                        }
                        value = value + $('#' + elementoId + key).val();
                    }
                }
                if (value) {
                    url = addParamIntoUrl(
                        url,
                        campo,
                        value
                    );

                } else {
                    let indice = url.indexOf(campo + '=');
                    if (indice != -1) {
                        let auxUrl = url.substring(0, indice);
                        let auxRestoUrl = url.substring(indice, url.length);
                        if (auxRestoUrl.includes('&')) {
                            let indice2 = auxRestoUrl.indexOf('&');
                            auxRestoUrl = auxRestoUrl.substring(indice2, auxRestoUrl.length);
                            url = auxUrl + auxRestoUrl;
                        } else {
                            url = auxUrl;
                        }
                    }
                }

                $('#' + iframe).attr('src', url);

                if (!criteriosEstablecido) {
                    if (campo == 'municipio') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' ' + etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                        }


                    }
                    if (campo == 'distrito') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                } // selectDistritoSCEdad
                                if (elementoId.indexOf('selectDistritoSC') == -1) {
                                    $('#criterioTerritorio').append(' ' + etiqueta);
                                }
                            }
                            if (elementoId.indexOf('selectDistritoSC') == -1) {
                                $('#pcriterioTerritorio').show();
                            }
                        }


                    }
                    if (campo == 'barrio') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' ' + etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                        }


                    }
                    if (campo == 'seccionCensalId') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' ' + etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                        }


                    }
                    if (campo == 'periodo') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioPeriodo').append(' ' + etiqueta);
                            }
                            $('#pcriterioPeriodo').show();
                        }


                    }
                    if (campo == 'edadQuinquenales') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioEdadQuinquenales').append(' ' + etiqueta);
                            }
                            $('#pcriterioEdadQuinquenales').show();
                        }
                    }
                    if (campo == 'sexo') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioSexo').append(' ' + etiqueta);
                            }
                            $('#pcriterioSexo').show();
                        }
                    }
                    if (campo == 'edad') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioEdad').append(' ' + etiqueta);
                            }
                            $('#pcriterioEdad').show();
                        }
                    }
                    if (campo == 'edadSimple') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioEdad').append(' ' + etiqueta);
                            }
                            $('#pcriterioEdad').show();
                        }
                    }
                    if (campo == 'medidaInd') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioIndicadores').append(' ' + etiqueta);
                            }
                            $('#pcriterioIndicadores').show();
                        }
                    }
                    if (campo == 'medidaPor') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioIndicadores').append(' ' + etiqueta);
                            }
                            $('#pcriterioIndicadores').show();
                        }
                    }
                    if (campo == 'paisProcedencia') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioPaisPro').append(' ' + etiqueta);
                            }
                            $('#pcriterioPaisPro').show();
                        }
                    }
                    if (campo == 'provinciaProcedencia') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioProvPro').append(' ' + etiqueta);
                            }
                            $('#pcriterioProvPro').show();
                        }
                    }
                    if (campo == 'municipioProcedencia') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioMunPro').append(' ' + etiqueta);
                            }
                            $('#pcriterioMunPro').show();
                        }
                    }
                    if (campo == 'nivelEstudio') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioNivelEstudio').append(' ' + etiqueta);
                            }
                            $('#pcriterioNivelEstudio').show();
                        }
                    }
                    if (campo == 'paisNacimiento') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioPaisNac').append(' ' + etiqueta);
                            }
                            $('#pcriterioPaisNac').show();
                        }
                    }

                    if (campo == 'nacionalidad') {
                        let etiqueta = '';
                        if (value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for (d = 0; d < etiquetas.length; d++) {
                                etiqueta = $('#etiqueta' + elementoId + etiquetas[d]).html();
                                if (d < (etiquetas.length - 1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioNacionalidad').append(' ' + etiqueta);
                            }
                            $('#pcriterioNacionalidad').show();
                        }
                    }
                }

            }
            criteriosEstablecido = true;
        }
        if (value) {
            // filtroIndicador1 = filtroIndicador1 + '&'+campo + '=' + value;
            return value;
        } else {
            return '';
        }
    } else if (tipoCombo == 'option') {
        if (
            $('#' + elementoId).val() &&
            $('#' + elementoId).val().length
        ) {
            let url = '';
            let i;
            let value = '';
            for (i = 0; i < arrayIframes.length; i++) {
                let iframe = arrayIframes[i];
                url = $('#' + iframe).attr('src');
                value = $('#' + elementoId)
                    .selectpicker()
                    .val()
                url = addParamIntoUrl(
                    url,
                    campo,
                    value
                );
                $('#' + iframe).attr('src', url);
            }
            if (value) {
                return value;
            } else {
                return '';
            }
        }
    }

}

/*
    Se inicializa la librería para tratar los formatos de los números
*/
function numeralInit() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [numeralInit]');
    }

    numeral.register('locale', 'es', {
        delimiters: {
            thousands: '.',
            decimal: ',',
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't',
        },
        ordinal: function (number) {
            return number === 1 ? 'er' : 'o';
        },
        currency: {
            symbol: '€',
        },
    });
    numeral.locale('es');
}

/*
    Función usa la seguridad de la API en caso de ser necesario
*/
function dameURL(URL) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [dameURL] [URL]' + URL);
    }

    if (!SEGURIDAD) {
        return encodeURI(URL);
    } else {
        return encodeURI(URL);
    }
}

/*
Funcion para obtener parametros de la URL
*/
function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

/*
Funcion que chequea el objecto taskMaster
*/
function checkTaskMaster() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [checkTaskMaster]');
    }

    if (!taskMaster) {
        return false;
    }

    if (!taskMaster.iframeGraficoBarras) {
        return false;
    }
    if (!taskMaster.iframeGraficoMapa) {
        return false;
    }

    setTimeout(function () {
        cargaTerminada();
    }, 500);
}

/*
Funcion que se invoca cuando se han terminado todas las llamadas ajax desde la funcion checkTaskMaster
*/
function cargaTerminada() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [cargaTerminada]');
    }

    $('.modal').modal('hide');
}

/*
Funcion que modifica un attributo del objeto taskmaster del padre (si existe)
*/
function modificaTaskMaster(attr) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [modificaTaskMaster] [attr] ' + attr);
    }

    try {
        if (parent && parent.taskMaster) {
            eval('parent.taskMaster.' + attr + '=true');
            parent.checkTaskMaster();
        }
    } catch (errorTM) { }
}

/*
    Función que devuelve true si se ejecuta dentro de un iframe
*/
function inIframe() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [inIframe]');
    }

    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

/*
    Método para inicializar los datos de la visualización
*/
function inicializaDatos() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [inicializaDatos]');
    }

    let combos = ['dsdEdadQuinquenales', 'dsdSexo'];

    if (isSessionTimeOut()) {
        removeSessionStorage(combos);
    }

    let jqxhr = $.getJSON(
        dameURL(
            DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_EDAD_QUINQUENAL +
            DSD_VALORES_DIMENSIONES_URL_2
        )
    )
        .done(function (data) {
            if (data && data.records && data.records.length) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    dsdEdadQuinquenales[data.records[i].id] = data.records[i].title;
                }
            }
        })
        .always(function () {
            sessionStorage.setItem('dsdEdadQuinquenales', dsdEdadQuinquenales);
        });

    jqxhr = $.getJSON(
        dameURL(
            DSD_VALORES_DIMENSIONES_URL_1 +
            DIMENSION_SEXO +
            DSD_VALORES_DIMENSIONES_URL_2
        )
    )
        .done(function (data) {
            if (data && data.records && data.records.length) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    dsdSexo[data.records[i].id] = data.records[i].title;
                }
            }
        })
        .always(function () {
            sessionStorage.setItem('dsdSexo', dsdSexo);
        });

    let paramCubo = ' ';
    let periodo = [];
    let position = [];
    let indice_position = 32;

    jqxhr = $.getJSON(
        dameURL(
            POBLACION_URL_1 +
            paramCubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&page=1&pageSize=100'
        )
    )
        .done(function (data) {
            if (data && data.records && data.records.length) {
                let position_aux = 0;
                let i;
                for (i = 0; i < data.records.length; i++) {
                    periodo.push(data.records[i][0]);
                    position.push(position_aux);
                    position_aux = position_aux + indice_position;
                }
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        }).always(function () {
            periodo.sort();

            var valorDefecto = periodo[periodo.length - 1];
            let mySlider = $('#filtroAnyo').bootstrapSlider({
                ticks: periodo,
                ticks_labels: periodo,
                ticks_snap_bounds: indice_position,
                ticks_tooltip: true,
                value: valorDefecto
            });

            mySlider.on('change', function (sliderValue) {
                filtraGraficosInicio(sliderValue.value.newValue);
                ultimoPeriodo = sliderValue.value.newValue;
            });

            filtraGraficosInicio(valorDefecto);

        });
}

/*
    Método para filtrar por periodo los gráficos de inicio
*/
function filtraGraficosInicio(filtroPeriodo) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [filtraGraficosInicio] [filtroPeriodo] ' + filtroPeriodo);
    }

    let territorio = sessionStorage.getItem('territorio');

    let url = 'grafico_piramide.html?titulo=piramide_poblacion';
    url = url + '&periodo=' + filtroPeriodo + '&lang=' + $.i18n().locale;
    url = url + '&territorio=' + territorio;
    $('#iframeGraficoPiramide').attr('src', url);

    url = 'grafico_mapa.html?titulo=numero_habitantes&cuboId=poblacionPorEdadGruposQuinquenales';
    url = url + '&periodo=' + filtroPeriodo + '&lang=' + $.i18n().locale;
    url = url + '&territorio=' + territorio;
    $('#iframeGraficoPoblacionTotal').attr('src', url);
}

/*
    Funcion auxiliar de Cadenas (Tratamiento de parametros en url. Ejemplo Edad)
*/
function addParamIntoUrl(url, param, value) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [addParamIntoUrl] url de entrada: ' + url);
    }

    let cadenaBusqueda = param + '=';
    //Esta formula solo sirve si se insertan en un orden determinado
    if (url && url.includes(cadenaBusqueda)) {
        //Ya se ha fijado el valor param= por lo que no hay que incluirlo
        let indice = url.indexOf(cadenaBusqueda);
        let auxUrl = url.substring(0, indice);
        let auxRestoUrl = url.substring(indice, url.length);
        if (auxRestoUrl.includes('&')) {
            let indice2 = auxRestoUrl.indexOf('&');
            auxRestoUrl = auxRestoUrl.substring(indice2, auxRestoUrl.length);
            url = auxUrl + param + '=' + value + auxRestoUrl;
        } else {
            url = auxUrl + param + '=' + value;
        }
    } else {
        url = url + '&' + param + '=' + value;
    }

    if (LOG_DEBUG_COMUN) {
        console.log('[addParamIntoUrl] url de salida: ' + url);
    }

    return url;
}

/**
 * includeHTML
 */
function includeHTML(menu, seccion_nav) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[general] [includeHTML] [menu:' + menu + '] [seccion:' + seccion_nav + ']'
        );
    }

    let z, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName('*');
    let i;
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute('w3-include-html');
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = 'Page not found.';
                    }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute('w3-include-html');
                    includeHTML(menu, seccion_nav);
                }
            };
            xhttp.open('GET', file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }

    pageLoad = {
        include: true,
        css: true,
    };

    checkPageLoad();
    controlCSS(menu);
    fijarSeccion(seccion_nav);
    //Control para el slider
    $('.slider-tick-label-container').attr('style', 'margin-left: -35px;');
    $('.slider-tick-label').width('70px');
}

function checkPageLoad() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [checkPageLoad]');
    }

    if (pageLoad) {
        return false;
    }

    if (!pageLoad.include) {
        return false;
    }
    if (!pageLoad.css) {
        return false;
    }

    if (LOG_DEBUG_COMUN) {
        console.log('[checkPageLoad] [paginaCargada] ');
    }
    return true;
}

/**
 * Control CSS Activa
 * @param {nombre de la pagina cargada} pagina
 */
function controlCSS(menu) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [controlCSS] [menu:' + menu + '] ');
    }

    if (!menu) {
        console.error('[general] [controlCSS] [menu:' + menu + '] [NOT FOUND!!] ');
    } else {
        //Control de CSS
        if (MENU_INICIO == menu) {
            cambioCSSInicio();
        } else if (MENU_EDAD_SIMPLE == menu) {
            cambioCSSEdadSimple();
        } else if (MENU_EDAD_GRUPOS_QUINQUENALES == menu) {
            cambioCSSEdadQuinquenales();
        } else if (MENU_INDICADORES == menu) {
            cambioCSSIndicadores();
        } else if (MENU_NIVEL_ESTUDIO == menu) {
            cambioCSSNivelEstudio();
        } else if (MENU_NACIONALIDAD == menu) {
            cambioCSSNacionalidad();
        } else if (MENU_PROCEDENCIA == menu) {
            cambioCSSProcedencia();
        } else if (MENU_PAIS_NACIMIENTO == menu) {
            cambioCSSPaisNacimiento();
        }
    }
}

function cambioCSSPlantilla() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [cambioCSSPlantilla]');
    }

    $('#buttonInicio').css('font-weight', 'normal');
    $('#buttonEdadQuinquenales').css('font-weight', 'normal');
    $('#buttonEdad').css('font-weight', 'normal');
    $('#buttonIndicadores').css('font-weight', 'normal');
    $('#buttonNivelEstudio').css('font-weight', 'normal');
    $('#buttonNacionalidad').css('font-weight', 'normal');
    $('#buttonProcedencia').css('font-weight', 'normal');
    $('#buttonPaisNacimiento').css('font-weight', 'normal');
    $('#buttonAyuda').css('font-weight', 'normal');
}

/**
 * El dato se carga del array guardado en sesion
 * @param {*} selectorId
 * @param {*} arrayComponente
 */
function changeSeleccionMultiplebySession(selectorId, arrayComponente, tipoCombo, chequeaUtlimo) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[general] [changeSeleccionMultiplebySession] [selectorId:' +
            selectorId +
            ']    [arrayComponente:' +
            arrayComponente +
            '] '
        );
    }

    let i;
    for (i = 0; i < arrayComponente.length; i++) {
        let componente = {
            id: arrayComponente[i].id,
            title: arrayComponente[i].title
        };

        let onclick = '';
        let checked = '';
        if (chequeaUtlimo && i == (arrayComponente.length - 1)) {
            checked = 'checked';
            if (selectorId == 'selectMunicipio') {
                $('#criterioTerritorio').append(' ' + componente.title);
                $('#pcriterioTerritorio').show();
            }
            if (selectorId == 'selectDistrito') {
                $('#criterioTerritorio').append(' ' + componente.title);
                $('#pcriterioTerritorio').show();
            }
            if (selectorId == 'selectBarrio') {
                $('#criterioTerritorio').append(' ' + componente.title);
                $('#pcriterioTerritorio').show();
            }
            if (selectorId == 'selectSeccionCensal') {
                $('#criterioTerritorio').append(' ' + componente.title);
                $('#pcriterioTerritorio').show();
            }
            if (selectorId == 'selectPeriodo') {
                $('#criterioPeriodo').append(' ' + componente.title);
                $('#pcriterioPeriodo').show();
            }
            if (selectorId == 'selectEdadQuinquenales') {
                $('#criterioEdadQuinquenales').append(' ' + componente.title);
                $('#pcriterioEdadQuinquenales').show();
            }
            if (selectorId == 'selectSexo') {
                $('#criterioSexo').append(' ' + componente.title);
                $('#pcriterioSexo').show();
            }
            if (selectorId == 'selectEdad') {
                $('#criterioEdad').append(' ' + componente.title);
                $('#pcriterioEdad').show();
            }
            if (selectorId == 'nacionalidad') {
                $('#criterioNacionalidad').append(' ' + componente.title);
                $('#pcriterioNacionalidad').show();
            }
        }
        if (selectorId.indexOf('selectDistritoSC') != -1) {
            onclick = ' onclick="filtraTerritorio()"';
        }

        $('#' + selectorId).append(
            '<div class="checkbox"><label for="' + selectorId +
            componente.id + '"><input type="checkbox" id="' + selectorId +
            componente.id +
            '" value="' +
            componente.id +
            '"' + checked + onclick + '><span id=etiqueta' + selectorId + componente.id + '>' +
            componente.title +
            '</span></label></div>'
        );
    }

}

/**
 *
 * @param {*} selectorId
 * @param {*} arrayComponente
 * @param {*} urlAjax
 */
function obtenerCombo(selectorId, arrayComponente, urlAjax, tipoCombo, chequeaUtlimo, taskCombos, posTask) {
    obtenerComboValores(selectorId, arrayComponente, urlAjax, null, tipoCombo, chequeaUtlimo, taskCombos, posTask);
}

/**
 *
 * @param {*} selectorId
 * @param {*} arrayComponente
 * @param {*} urlAjax
 * @param {*} valores indica los campos de donde obtener los valores del objeto data (id,title)
 */
function obtenerComboValores(selectorId, arrayComponente, urlAjax, valores, tipoCombo, chequeaUtlimo, taskCombos,
    posTask) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[general] [obtenerComboValores] [selectorId:' +
            selectorId +
            ']    [arrayComponente:' +
            arrayComponente +
            '] [urlAjax:' +
            urlAjax +
            '] [valores:' +
            valores +
            ']'
        );
    }

    if (
        sessionStorage.getItem(selectorId) &&
        sessionStorage.getItem(selectorId).length
    ) {
        arrayComponente = JSON.parse(sessionStorage.getItem(selectorId));
        changeSeleccionMultiplebySession(selectorId, arrayComponente, tipoCombo, chequeaUtlimo);
        if (taskCombos) {
            taskCombos[posTask] = true;
            let ultimoAcabado = true;
            let d;
            for (d = 0; d < taskCombos.length; d++) {
                ultimoAcabado = ultimoAcabado && taskCombos[d];
            }
            if (ultimoAcabado) {
                inicializaInicio();
            }
        }
    } else {
        let jqxhr = $.getJSON(urlAjax)
            .done(function (data) {
                changeSeleccionMultiple(selectorId, arrayComponente, data, valores, tipoCombo, chequeaUtlimo);
            })
            .fail(function (jqxhr, textStatus, error) {
                let err = textStatus + ', ' + error;
                console.log('Request Failed: ' + err);
            })
            .always(function () {
                sessionStorage.setItem(selectorId, JSON.stringify(arrayComponente));
                if (taskCombos) {
                    taskCombos[posTask] = true;
                    let ultimoAcabado = true;
                    let d;
                    for (d = 0; d < taskCombos.length; d++) {
                        ultimoAcabado = ultimoAcabado && taskCombos[d];
                    }
                    if (ultimoAcabado) {
                        inicializaInicio();
                    }
                }
            });
    }
}


function obtenerComboValoresConstantes(selectorId, arrayComponente, constante, chequeaUtlimo, taskCombos, posTask) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [obtenerComboValoresConstantes]');
    }

    if (constante == 'VALORES_EDAD_QUINQUENAL') {
        VALORES_EDAD_QUINQUENAL.forEach(obtenerDatosMapa, arrayComponente);
    } else if (constante == 'VALORES_SEXO') {
        VALORES_SEXO.forEach(obtenerDatosMapa, arrayComponente);
    } else if (constante == 'VALORES_NACIONALIDAD') {
        VALORES_NACIONALIDAD.forEach(obtenerDatosMapa, arrayComponente);
    } else if (constante == 'VALORES_NIVEL_ESTUDIOS') {
        VALORES_NIVEL_ESTUDIOS.forEach(obtenerDatosMapa, arrayComponente);
    }

    arrayComponente.sort(compareId);
    let h;
    for (h = 0; h < arrayComponente.length; h++) {
        let componente = arrayComponente[h];
        let onclick = '';
        let checked = '';
        if (chequeaUtlimo && h == (arrayComponente.length - 1)) {
            checked = 'checked';
        }
        if (selectorId.indexOf('selectDistritoSC') != -1) {
            onclick = ' onclick="filtraTerritorio()"';
        }

        $("#" + selectorId).append(
            '<div class="checkbox"><label for="' +
            selectorId +
            componente.id +
            '"><input type="checkbox" id="' +
            selectorId +
            componente.id +
            '" value="' +
            componente.id +
            '"' +
            checked + onclick +
            "><span id=etiqueta" +
            selectorId +
            componente.id +
            ">" +
            componente.title +
            "</span></label></div>"
        );
    }
    sessionStorage.setItem(selectorId, JSON.stringify(arrayComponente));
    if (taskCombos) {
        taskCombos[posTask] = true;
        let ultimoAcabado = true;
        let d;
        for (d = 0; d < taskCombos.length; d++) {
            ultimoAcabado = ultimoAcabado && taskCombos[d];
        }
        if (ultimoAcabado) {
            inicializaInicio();
        }
    }
}

function obtenerDatosMapa(value, key, map) {

    let componente;
    componente = {
        id: key,
        title: value
    };
    this.push(componente);
}

/**
 * Metodo generico para Obtener el seleccionado de los combos
 * @param {*} selectorId
 * @param {*} arrayComponente
 * @param {*} data
 * @param {*} valores indica los campos de donde obtener los valores del objeto data (id,title)
 */
function changeSeleccionMultiple(selectorId, arrayComponente, data, valores, tipoCombo, chequeaUtlimo) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[general] [changeSeleccionMultiple] [selectorId:' +
            selectorId +
            ']    [arrayComponente:' +
            arrayComponente +
            '] [data:' +
            data +
            '] [valores:' +
            valores +
            ']'
        );
    }

    if (data && data.records && data.records.length) {
        let i;
        for (i = 0; i < data.records.length; i++) {
            if (selectorId == 'selectMunicipioPais' && data.records[i][1] == 'EEUU') {
                if (LOG_DEBUG_COMUN) {
                    console.log('Se quita dato por ser erroneo');
                }
            } else {
                let componente;
                //Si se han fijado de donde obtener los valores
                if (valores) {
                    componente = {
                        id: data.records[i][valores[0]],
                        title: data.records[i][valores[1]]
                    };
                    arrayComponente.push(componente);
                    if (LOG_DEBUG_COMUN) {
                        console.log(
                            '[changeSeleccionMultiple] [componente.id:' +
                            componente.id +
                            ']    [componente.title:' +
                            componente.title +
                            '] '
                        );
                    }
                } //en caso contrario revisamos el data para obtener los valores segun los datos.
                else {
                    let auxId = data.records[i].id;
                    if (!auxId || !auxId) {
                        auxId = data.records[i][0];
                    }
                    let auxTitle = data.records[i].title;
                    if (!auxTitle || !auxTitle) {
                        auxTitle = data.records[i][1];
                    }
                    if (!auxTitle || !auxTitle) {
                        auxTitle = data.records[i][0];
                    }
                    if (auxId || auxTitle) {
                        componente = {
                            id: auxId,
                            title: auxTitle
                        };
                        arrayComponente.push(componente);
                        if (LOG_DEBUG_COMUN) {
                            console.log(
                                '[changeSeleccionMultiple] [componente.id:' +
                                componente.id +
                                ']    [componente.title:' +
                                componente.title +
                                '] '
                            );
                        }
                    }

                }

            }
        }
        if (selectorId.indexOf('selectPeriodo') != -1) {
            arrayComponente.sort(compareIdDesc);
        } else {
            arrayComponente.sort(compareId);
        }

        let h;
        for (h = 0; h < arrayComponente.length; h++) {
            let componente = arrayComponente[h];
            if (tipoCombo == 'option') {
                $('#' + selectorId).append(
                    "<option value='" +
                    componente.id +
                    "'>" +
                    componente.title +
                    "</option>"
                );
            } else if (tipoCombo == 'checkbox') {
                let onclick = '';
                let checked = '';
                if (chequeaUtlimo && !h) {
                    checked = 'checked';
                }
                if (selectorId.indexOf('selectDistritoSC') != -1) {
                    onclick = ' onclick="filtraTerritorio()"';
                }

                $('#' + selectorId).append(
                    '<div class="checkbox"><label for="' + selectorId +
                    componente.id + '"><input type="checkbox" id="' + selectorId +
                    componente.id +
                    '" value="' +
                    componente.id +
                    '"' + checked + onclick + '><span id=etiqueta' + selectorId + componente.id + '>' +
                    componente.title +
                    '</span></label></div>'
                );
            }

        }

    }
}

function fijarSeccion(seccion) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[general] [fijarSeccion] [seccion:' +
            seccion +
            '] '
        );
    }

    let elementoId = '' + seccion + '_li';
    if (seccion) {
        $('#seccion_todos_li').removeClass('active');
        $('#seccion_municipio_li').removeClass('active');
        $('#seccion_distrito_li').removeClass('active');
        $('#seccion_barrio_li').removeClass('active');
        $('#seccion_censal_li').removeClass('active');
        //Fijamos la seleccionada
        $('#' + elementoId).removeClass('nav-item');
        $('#' + elementoId).addClass('nav-item active');
    }
}

/**
 * Metodo generico para realizar el borrado de los selectores
 * @param {*} selectores (Componentes a borrar)
 *    */
function removeSessionStorage(selectores) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [removeSessionStorage] [selectores:' + selectores + ']');
    }

    if (selectores) {
        let i;
        for (i = 0; i < selectores.length; i++) {
            sessionStorage.removeItem(selectores[i]);
        }
    }
}

/**
 * Metodo generico para comprobar si se deben recargar o no los parametros de session (Combos)
 *    */
function isSessionTimeOut() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [isSessionTimeOut]');
    }

    let result = false;
    let fecha = new Date();
    if (
        sessionStorage &&
        sessionStorage.getItem(PARAM_TIME_SESSION)
    ) {
        let timeSession = sessionStorage.getItem(PARAM_TIME_SESSION);
        let time = fecha.getTime() - timeSession;
        let seconds = (time / 1000).toFixed(1);
        if (LOG_DEBUG_COMUN) {
            console.log(
                '[isSessionTimeOut] [seconds:' +
                seconds +
                '] > [TIME_SESSION_STORAGE:' +
                TIME_SESSION_STORAGE +
                ']'
            );
        }
        if (seconds > TIME_SESSION_STORAGE) {
            sessionStorage.setItem(PARAM_TIME_SESSION, fecha.getTime());
            result = true;
        }
    } else {
        sessionStorage.setItem(PARAM_TIME_SESSION, fecha.getTime());
        result = true;
    }

    return result;
}

function inicializaFiltros(filtroSlider) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [inicializaFiltros] [filtroSlider] ' + filtroSlider);
    }

    if (!filtroSlider) {
        filtroSlider = FILTRO_SLIDER_TERRITORIO;
    }

    if (filtroSlider.indexOf('Municipio') == -1) {
        $('#radioMunicipio').hide();
    }
    if (filtroSlider.indexOf('Distrito') == -1) {
        $('#radioDistrito').hide();
    }
    if (filtroSlider.indexOf('Barrio') == -1) {
        $('#radioBarrio').hide();
    }
    if (filtroSlider.indexOf('Sección Censal') == -1) {
        $('#radioSeccionCensal').hide();
    }
}

/**
 * aplicaFiltroTerritorio
 * Funcion para aplicar lógica al slider de territorio
 */
function aplicaFiltroTerritorio(territorio, arrayIframes, indicador) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [aplicaFiltroTerritorio] [territorio] ' + territorio);
    }

    let d;
    for (d = 0; d < arrayIframes.length; d++) {
        let iframe = arrayIframes[d];
        let url = $('#' + iframe).attr('src');
        //Fijamos el prametros cuboId para pasarlo a los graficos del Mapa
        let indice = url.indexOf('cuboId');
        let paramCuboId = url.substring(indice, url.length);
        if (LOG_DEBUG_COMUN) {
            console.log('[aplicaFiltroTerritorio] [paramCuboId:' + paramCuboId + ']');
        }
        let titulo;
        if(indicador) {
            titulo = 'indicador_';
        } else {
            titulo = 'personas_';
        }

        if (iframe == 'iframeGraficoMapa') {
            if (territorio == 'municipio') {
                url =
                    'grafico_mapa.html?territorio=municipio&titulo='+titulo+'municipio&iframe=iframeGraficoMapa&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else if (territorio == 'distrito') {
                url =
                    'grafico_mapa.html?territorio=distrito&titulo='+titulo+'distrito&iframe=iframeGraficoMapa&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else if (territorio == 'barrio') {
                url =
                    'grafico_mapa.html?territorio=barrio&titulo='+titulo+'barrio&iframe=iframeGraficoMapa&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else if (territorio == 'seccion_censal') {
                url =
                    'grafico_mapa.html?territorio=seccion-censal&titulo='+titulo+'seccion_censal' +
                    '&iframe=iframeGraficoMapa&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else {
                console.error(
                    '[aplicaFiltroTerritorio] [filtro:' + territorio + '] Not found!!'
                );
            }
        } else if (iframe == 'iframeGraficoMapaComp') {
            if (territorio == 'municipio') {
                url =
                    'grafico_mapa.html?territorio=municipio&titulo='+titulo+'municipio&iframe=iframeGraficoMapaComp&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else if (territorio == 'distrito') {
                url =
                    'grafico_mapa.html?territorio=distrito&titulo='+titulo+'distrito&iframe=iframeGraficoMapaComp&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else if (territorio == 'barrio') {
                url =
                    'grafico_mapa.html?territorio=barrio&titulo='+titulo+'barrio&iframe=iframeGraficoMapaComp&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else if (territorio == 'seccion_censal') {
                url =
                    'grafico_mapa.html?territorio=seccion-censal&titulo='+titulo+'seccion_censal' +
                    '&iframe=iframeGraficoMapaComp&' +
                    paramCuboId;
                $('#' + iframe).attr('src', url);
            } else {
                console.error(
                    '[aplicaFiltroTerritorio] [filtro:' + territorio + '] Not found!!'
                );
            }
        }
    }

}

function selececionarTodo(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [selececionarTodo] [capa] ' + capa);
    }

    $('#' + capa + ' .checkbox label input').prop('checked', true);
}

function quitarSeleccion(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [quitarSeleccion] [capa] ' + capa);
    }

    $('#' + capa + ' .checkbox label input').prop('checked', false);
}

function compareId(a, b) {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

function compareIdDesc(a, b) {
    if (a.id > b.id) {
        return -1;
    }
    if (a.id < b.id) {
        return 1;
    }
    return 0;
}

function cambioCapa(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [cambioCapa]');
    }

    if (capa == 'inicio') {
        location.replace('index.html');
    } else if (capa == 'ayuda') {
        location.replace('ayuda.html');
    } else if (capa == 'edadQuinquenales') {
        location.replace('edad_grupos_quinquenales.html');
    } else if (capa == 'edadSimple') {
        location.replace('edad_simple.html');
    } else if (capa == 'indicadores') {
        location.replace('indicadores.html');
    } else if (capa == 'nacionalidad') {
        location.replace('nacionalidad.html');
    } else if (capa == 'nivelEstudio') {
        location.replace('nivel_estudio.html');
    } else if (capa == 'paisNacimiento') {
        location.replace('pais_nacimiento.html');
    } else if (capa == 'procedencia') {
        location.replace('procedencia.html');
    }

}

function indicadores(url1, filtro1, indicadores) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [indicadores] [url1] ' + url1 + ' [filtro1] ' + filtro1);
    }

    let url = url1;
    if (filtro1) {
        url = url + filtro1;
    }
    $.getJSON(url)
        .done(function (data) {
            let suma = 0;
            let i18nPersonas = $.i18n('personas');
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    suma = suma + Number(data.records[i].SUM);

                }
                let numeralSuma = numeral(suma);
                
                if (!indicadores) {
                    $('#indicadores1').html(numeralSuma.format(numFormatoSinDecimales) + ' '+i18nPersonas);
                } else {
                    $('#indicadores1').html(numeralSuma.format(numFormato));
                }

            } else {
                if (!indicadores) {
                    $('#indicadores1').html('0 '+i18nPersonas);
                } else {
                    $('#indicadores1').html('0');
                }
            }
        }
        )

}

function deshabilitaTerritorio() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [deshabilitaTerritorio]');
    }

    $('#liTerritorio').addClass('disabled');
    $('#aTerritorio').addClass(' btn disabled');
    $('.nav-tabs a:last').tab('show');
}

function habilitaTerritorio() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [habilitaTerritorio]');
    }

    $('#liTerritorio').removeClass('disabled');
    $('#aTerritorio').removeClass('btn disabled');
    $('.nav-tabs a:first').tab('show');
}

function chequeaMultiple(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [chequeaMultiple] [capa] ' + capa);
    }

    let esMultiple = false;
    if (capa.indexOf('selectDistritoSC') != -1) {
        filtraTerritorio();
    }

    let numchecked = 0;
    $('#' + capa + '  .checkbox label input').each(function (index) {
        if ($(this).is(':checked')) {
            numchecked = numchecked + 1;
        }
    });

    if (capa.indexOf('selectPeriodo') != -1 && numchecked <= 1) {
        $('#capaGraficoMapaComp').show();
    } else if (capa.indexOf('selectPeriodo') != -1 && numchecked > 1) {
        $('#capaGraficoMapaComp').hide();
    }

    if (numchecked > 1) {
        esMultiple = true;
    } else {
        esMultiple = false;
    }
    return esMultiple;
}

function obtenerEtiquetas(value, key, map) {
    this[key] = value;
}

function dameUltimoPeriodo(cubo, periodos) {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [dameUltimoPeriodo] [cubo] ' + cubo);
    }

    let url;
    if (URL_CUBOS.get(cubo)) {
        url =
            URL_CUBOS.get(cubo) +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&sort=refPeriod&page=1&pageSize=100';
    } else {
        url =
            POBLACION_URL_1 +
            cubo +
            POBLACION_URL_2 +
            '?dimension=refPeriod&group=SUM&measure=numeroPersonas&sort=refPeriod&page=1&pageSize=100';
    }

    $.getJSON(url)
        .done(function (data) {
            let suma = 0;
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    periodos.push(data.records[i][0]);
                }

            }
        }
        ).always(function () {
            inicializaDatos();
        });

}

function isFiltroMunicipio() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [isFiltroMunicipio]');
    }

    filtro = filtro + ' and (distritoId=null and barrioId=null and seccionCensalId=null)';
}

function isFiltroMunicipioQ() {
    if (LOG_DEBUG_COMUN) {
        console.log('[general] [isFiltroMunicipioQ]');
    }

    filtro = filtro + ' and (distritoId==null and barrioId==null and seccionCensalId==null)';
}