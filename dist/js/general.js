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

/* 
	Métodos para el arranque de la web
*/
function initComun() {
    if (LOG_DEBUG_COMUN) {
        console.log('initComun');
    }

    multidiomaComun();
    numeralInit();
}

/* 
	Función para el multiidioma 
*/
function multidiomaComun() {
    if (LOG_DEBUG_COMUN) {
        console.log('multidiomaComun');
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
    $.i18n.debug = LOG_DEBUG_COMUN;
}

/*
aplicaFiltroElement es la funcion por defecto que mas se usa
Parametros
elementoId : ej. selectEdad
campo : ej. edad
arrayIframes : iFrames sobre los que afecta
 */
function aplicaFiltroElement(elementoId, campo, arrayIframes, tipoCombo) {
    aplicaFiltroElementGlobal(elementoId, campo, arrayIframes, tipoCombo);
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
            '[aplicaFiltroElementGlobal] [elementoId:' +
                elementoId +
                '] [campo:' +
                campo +
                '] [arrayIframes:' +
                arrayIframes +
                ']'
        );
    }

    if (tipoCombo=='checkbox') {
        let url = '';
        let i;
        let criteriosEstablecido = false
        for (i = 0; i < arrayIframes.length; i++) {
            let iframe = arrayIframes[i];
            url = $('#' + iframe).attr('src');
            let arrayComponente = JSON.parse(sessionStorage.getItem(elementoId));
            let o;
            let value = '';
            if(arrayComponente) {
                for(o=0;o<arrayComponente.length;o++) {
                    let key = arrayComponente[o].id;
                    if($('#'+elementoId+key).prop('checked')) {
                        if(value) {
                            value = value + ',';
                        }
                        value = value + $('#'+elementoId + key).val();
                    }
                }
                if(value) {
                    url = addParamIntoUrl(
                        url,
                        campo,
                        value
                    );
                } else {
                    let indice = url.indexOf(campo+'=');
                    if(indice!=-1) {
                        let auxUrl = url.substring(0, indice);
                        let auxRestoUrl = url.substring(indice, url.length);
                        if (auxRestoUrl.includes('&')) {
                            let indice2 = auxRestoUrl.indexOf('&');
                            auxRestoUrl = auxRestoUrl.substring(indice2, auxRestoUrl.length);
                            url = auxUrl + auxRestoUrl;
                        }else{
                            url = auxUrl;
                        }
                    }
                }
               
                $('#' + iframe).attr('src', url);

                if(!criteriosEstablecido) { 
                    if(campo=='municipio'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' '+ etiqueta);
                                $('#criterioTerritorio2').append(' '+ etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                            $('#pcriterioTerritorio2').show();
                        }
                       
                        
                    }
                    if(campo=='distrito'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' '+ etiqueta);
                                $('#criterioTerritorio2').append(' '+ etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                            $('#pcriterioTerritorio2').show();
                        }
                        
                        
                    }
                    if(campo=='barrio'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' '+ etiqueta);
                                $('#criterioTerritorio2').append(' '+ etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                            $('#pcriterioTerritorio2').show();
                        }
                        
                        
                    }
                    if(campo=='seccionCensalId'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioTerritorio').append(' '+ etiqueta);
                                $('#criterioTerritorio2').append(' '+ etiqueta);
                            }
                            $('#pcriterioTerritorio').show();
                            $('#pcriterioTerritorio2').show();
                        }
                        
                        
                    }
                    if(campo=='periodo'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioPeriodo').append(' '+ etiqueta);
                                $('#criterioPeriodo2').append(' '+ etiqueta);
                            }
                            $('#pcriterioPeriodo').show();
                            $('#pcriterioPeriodo2').show();
                        }
                        
                        
                    }
                    if(campo=='edadQuinquenales'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioEdadQuinquenales').append(' '+ etiqueta);
                                $('#criterioEdadQuinquenales2').append(' '+ etiqueta);
                            }
                            $('#pcriterioEdadQuinquenales').show();
                            $('#pcriterioEdadQuinquenales2').show();
                        }
                    }
                    if(campo=='sexo'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioSexo').append(' '+ etiqueta);
                                $('#criterioSexo2').append(' '+ etiqueta);
                            }
                            $('#pcriterioSexo').show();
                            $('#pcriterioSexo2').show();
                        }
                    }
                    if(campo=='edad'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#pcriterioEdad').append(' '+ etiqueta);
                                $('#pcriterioEdad2').append(' '+ etiqueta);
                            }
                            $('#pcriterioEdad').show();
                            $('#pcriterioEdad2').show();
                        }
                    }
                    if(campo=='medidaInd'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioIndicadores').append(' '+ etiqueta);
                                $('#criterioIndicadores2').append(' '+ etiqueta);
                            }
                            $('#pcriterioIndicadores').show();
                            $('#pcriterioIndicadores2').show();
                        }
                    }
                    if(campo=='medidaPor'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioIndicadores').append(' '+ etiqueta);
                                $('#criterioIndicadores2').append(' '+ etiqueta);
                            }
                            $('#pcriterioIndicadores').show();
                            $('#pcriterioIndicadores2').show();
                        }
                    }
                    if(campo=='paisProcedencia'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioPaisPro').append(' '+ etiqueta);
                                $('#criterioPaisPro2').append(' '+ etiqueta);
                            }
                            $('#pcriterioPaisPro').show();
                            $('#pcriterioPaisPro2').show();
                        }
                    }
                    if(campo=='provinciaProcedencia'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioProvPro').append(' '+ etiqueta);
                                $('#criterioProvPro2').append(' '+ etiqueta);
                            }
                            $('#pcriterioProvPro').show();
                            $('#pcriterioProvPro2').show();
                        }
                    }
                    if(campo=='municipioProcedencia'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioMunPro').append(' '+ etiqueta);
                                $('#criterioMunPro2').append(' '+ etiqueta);
                            }
                            $('#pcriterioMunPro').show();
                            $('#pcriterioMunPro2').show();
                        }
                    }
                    if(campo=='municipioProcedencia'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioMunPro').append(' '+ etiqueta);
                                $('#criterioMunPro2').append(' '+ etiqueta);
                            }
                            $('#pcriterioMunPro').show();
                            $('#pcriterioMunPro2').show();
                        }
                    }
                    if(campo=='nivelEstudios'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioNivelEstudio').append(' '+ etiqueta);
                                $('#criterioNivelEstudio2').append(' '+ etiqueta);
                            }
                            $('#pcriterioNivelEstudio').show();
                            $('#pcriterioNivelEstudio2').show();
                        }
                    }
                    if(campo=='paisNacimiento'){
                        let etiqueta = '';
                        if(value) {
                            let etiquetas = [];
                            etiquetas = value.split(',');
                            let d;
                            for(d=0;d<etiquetas.length;d++) {
                                etiqueta = $('#etiqueta'+etiquetas[d]).html();
                                if(d<(etiquetas.length-1)) {
                                    etiqueta = etiqueta + ',';
                                }
                                $('#criterioPaisNac').append(' '+ etiqueta);
                                $('#criterioPaisNac2').append(' '+ etiqueta);
                            }
                            $('#pcriterioPaisNac').show();
                            $('#pcriterioPaisNac').show();
                        }
                    }
                }
               
            }
            criteriosEstablecido = true;
        }
    }else if(tipoCombo=='option'){
        if (
            $('#' + elementoId).val() &&
            $('#' + elementoId).val().length
        ) {
            let url = '';
            let i;
            for (i = 0; i < arrayIframes.length; i++) {
                let iframe = arrayIframes[i];
                url = $('#' + iframe).attr('src');
                url = addParamIntoUrl(
                    url,
                    campo,
                    $('#' + elementoId)
                        .selectpicker()
                        .val()
                );
                $('#' + iframe).attr('src', url);
            }
        }
    }
}

/*
	Se inicializa la librería para tratar los formatos de los números
*/
function numeralInit() {
    if (LOG_DEBUG_COMUN) {
        console.log('numeralInit');
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
        console.log('dameURL: ' + URL);
    }

    if (SEGURIDAD == false) {
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
    if (!taskMaster) {
        return false;
    }

    if (taskMaster.iframeGraficoBarras == false) {
        return false;
    }
    if (taskMaster.iframeGraficoMapa == false) {
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
    $('.modal').modal('hide');
}

/*
Funcion que modifica un attributo del objeto taskmaster del padre (si existe)
*/
function modificaTaskMaster(attr) {
    try {
        if (parent && parent.taskMaster) {
            eval('parent.taskMaster.' + attr + '=true');
            parent.checkTaskMaster();
        }
    } catch (errorTM) {}
}

/*
	Función que devuelve true si se ejecuta dentro de un iframe
*/
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

let dsdEdadQuinquenales = {};
let dsdSexo = {};
/*
	Método para inicializar los datos de la visualización
*/
function inicializaDatos() {
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

            var valorDefecto=periodo[periodo.length-1];
            let mySlider = $('#filtroAnyo').bootstrapSlider({
                ticks: periodo,
                ticks_labels: periodo,
                ticks_snap_bounds: indice_position,
                ticks_tooltip: true,
                value: valorDefecto
            });

            mySlider.on('change', function (sliderValue) {
                filtraGraficosInicio(sliderValue.value.newValue);
                ultimoPeriodo=sliderValue.value.newValue;
            });

            filtraGraficosInicio(valorDefecto);

        });
}

/*
	Método para filtrar por periodo los gráficos de inicio
*/
function filtraGraficosInicio(filtroPeriodo) {
    if (LOG_DEBUG_COMUN) {
        console.log('filtraGraficosInicio ' + filtroPeriodo);
    }
    let territorio = sessionStorage.getItem('territorio');

    let url = 'grafico_piramide.html?titulo=piramide_poblacion';
    url = url + '&periodo=' + filtroPeriodo + '&lang=' + $.i18n().locale;
    url = url + '&territorio='+territorio;
    $('#iframeGraficoPiramide').attr('src', url);

    url = 'grafico_mapa.html?titulo=numero_habitantes&cuboId=poblacionPorEdadGruposQuinquenales';
    url = url + '&periodo=' + filtroPeriodo + '&lang=' + $.i18n().locale;
    url = url + '&territorio='+territorio;
    $('#iframeGraficoPoblacionTotal').attr('src', url);
}

/*
	Funcion auxiliar de Cadenas (Tratamiento de parametros en url. Ejemplo Edad)
*/
function addParamIntoUrl(url, param, value) {
    let cadenaBusqueda = param + '=';
    if (LOG_DEBUG_COMUN) {
        console.log('[addParamIntoUrl] url de entrada: ' + url);
    }

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
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[includeHTML] [menu:' + menu + '] [seccion:' + seccion_nav + ']'
        );
    }
    checkPageLoad();
    controlCSS(menu);
    fijarSeccion(seccion_nav);
    //Control para el slider
    $('.slider-tick-label-container').attr('style', 'margin-left: -35px;');
    $('.slider-tick-label').width('70px');
    filtraMenuCubos();
}

function checkPageLoad() {
    if (pageLoad) {
        return false;
    }

    if (pageLoad.include == false) {
        return false;
    }
    if (pageLoad.css == false) {
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
        console.log('[controlCSS] [menu:' + menu + '] ');
    }

    if (!menu) {
        console.error('[controlCSS] [menu:' + menu + '] [NOT FOUND!!] ');
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
    $('#buttonInicio').css('font-weight', 'normal');
    $('#buttonEdadQuinquenales').css('font-weight', 'normal');
    $('#buttonEdad').css('font-weight', 'normal');
    $('#buttonIndicadores').css('font-weight', 'normal');
    $('#buttonNivelEstudio').css('font-weight', 'normal');
    $('#buttonNacionalidad').css('font-weight', 'normal');
    $('#buttonProcedencia').css('font-weight', 'normal');
    $('#buttonPaisNacimiento').css('font-weight', 'normal');
    $('#buttonGlosario').css('font-weight', 'normal');
}

/**
 * El dato se carga del array guardado en sesion
 * @param {*} selectorId
 * @param {*} arrayComponente
 */
function changeSeleccionMultiplebySession(selectorId, arrayComponente, tipoCombo, chequeaUtlimo) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[changeSeleccionMultiplebySession] [selectorId:' +
                selectorId +
                ']    [arrayComponente:' +
                arrayComponente +
                '] '
        );
    }

    let i;
    for (i = 0; i < arrayComponente.length; i++) {
        let componente = {
            id : arrayComponente[i].id,
            title : arrayComponente[i].title
        };

        let onclick = '';
        let checked = '';
        if(chequeaUtlimo && i==(arrayComponente.length-1)) {
            checked = 'checked';
            if(selectorId=='selectMunicipio') {
                $('#criterioTerritorio').append(' '+ componente.title);
                $('#criterioTerritorio2').append(' '+ componente.title);
                $('#pcriterioTerritorio').show();
                $('#pcriterioTerritorio2').show();
                onclick = ' onclick="chequeaMultiple"';
            }
            if(selectorId=='selectDistrito') {
                $('#criterioTerritorio').append(' '+ componente.title);
                $('#criterioTerritorio2').append(' '+ componente.title);
                $('#pcriterioTerritorio').show();
                $('#pcriterioTerritorio2').show();
                onclick = ' onclick="chequeaMultiple"';
            }
            if(selectorId=='selectBarrio') {
                $('#criterioTerritorio').append(' '+ componente.title);
                $('#criterioTerritorio2').append(' '+ componente.title);
                $('#pcriterioTerritorio').show();
                $('#pcriterioTerritorio2').show();
                onclick = ' onclick="chequeaMultiple"';
            }
            if(selectorId=='selectSeccionCensal') {
                $('#criterioTerritorio').append(' '+ componente.title);
                $('#criterioTerritorio2').append(' '+ componente.title);
                $('#pcriterioTerritorio').show();
                $('#pcriterioTerritorio2').show();
            }
            if(selectorId=='selectPeriodo') {
                $('#criterioPeriodo').append(' '+ componente.title);
                $('#criterioPeriodo2').append(' '+ componente.title);
                $('#pcriterioPeriodo').show();
                $('#pcriterioPeriodo2').show();
                onclick = ' onclick="chequeaMultiple"';
            }
            if(selectorId=='selectEdadQuinquenales') {
                $('#criterioEdadQuinquenales').append(' '+ componente.title);
                $('#criterioEdadQuinquenales2').append(' '+ componente.title);
                $('#pcriterioEdadQuinquenales').show();
                $('#pcriterioEdadQuinquenales').show();
            }
            if(selectorId=='selectSexo') {
                $('#criterioSexo').append(' '+ componente.title);
                $('#criterioSexo2').append(' '+ componente.title);
                $('#pcriterioSexo').show();
                $('#pcriterioSexo').show();
            }
            if(selectorId=='selectEdad') {
                $('#criterioEdad').append(' '+ componente.title);
                $('#criterioEdad2').append(' '+ componente.title);
                $('#pcriterioEdad').show();
                $('#pcriterioEdad2').show();
            }
        }
        $('#' + selectorId).append(
            '<div class="checkbox"><label><input type="checkbox" id="'+ selectorId +
            componente.id +
                '" value="' +
                componente.id +
                '"'+checked+onclick+'>' +
                componente.title +
                '</label></div>'
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
function obtenerComboValores(selectorId, arrayComponente, urlAjax, valores, tipoCombo, chequeaUtlimo, taskCombos, posTask) {
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[obtenerComboValores] [selectorId:' +
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
        taskCombos[posTask]=true;
        let ultimoAcabado=true;
        let d;
        for(d=0;d<taskCombos.length;d++) {
            ultimoAcabado = ultimoAcabado && taskCombos[d];
        }
        if(ultimoAcabado) {
            aplicaFiltro('municipio');
            cargaTerminada();
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
                taskCombos[posTask]=true;
                let ultimoAcabado=true;
                let d;
                for(d=0;d<taskCombos.length;d++) {
                    ultimoAcabado = ultimoAcabado && taskCombos[d];
                }
                if(ultimoAcabado) {
                    aplicaFiltro('municipio');
                    cargaTerminada();
                }
            });
    }
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
            '[changeSeleccionMultiple] [selectorId:' +
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

    if (data && data.records && data.records.length ) {
        let i;
        for (i = 0; i < data.records.length; i++) {
            if(selectorId=='selectMunicipioPais' && data.records[i][1]=='EEUU') {
                console.log('Se quita dato por ser erroneo');
            }else {
                let componente;
                //Si se han fijado de donde obtener los valores
                if (valores) {
                    componente = {
                        id : data.records[i][valores[0]],
                        title : data.records[i][valores[1]]
                    };
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
                    componente = {
                        id : data.records[i][0],
                        title : auxTitle
                    };
                }
                if (LOG_DEBUG_COMUN) {
                    console.log(
                        '[changeSeleccionMultiple] [componente.id:' +
                            componente.id +
                            ']    [componente.title:' +
                            componente.title +
                            '] '
                    );
                }
                arrayComponente.push(componente);
            }
        }

        arrayComponente.sort(compareId);
        let h;
        for(h=0;h<arrayComponente.length;h++) {
            let componente = arrayComponente[h];
            if(tipoCombo=='option') {
                $('#' + selectorId).append(
                    "<option value='" +
                        componente.id +
                        "'>" +
                        componente.title +
                        "</option>"
                );
            }else if(tipoCombo=='checkbox') {
                let onclick = '';
                let checked = '';
                if(chequeaUtlimo && h==(arrayComponente.length-1)) {
                    checked = 'checked';
                }
                if(selectorId.indexOf('selectMunicipio')!=-1) {
                    onclick = ' onclick="chequeaMultiple(\''+selectorId+'\')"';
                }
                if(selectorId.indexOf('selectDistrito')!=-1) {
                    onclick = ' onclick="chequeaMultiple(\''+selectorId+'\')"';
                }
                if(selectorId.indexOf('selectBarrio')!=-1) {
                    onclick = ' onclick="chequeaMultiple(\''+selectorId+'\')"';
                }
                if(selectorId.indexOf('selectSeccionCensal')!=-1) {
                    onclick = ' onclick="chequeaMultiple(\''+selectorId+'\')"';
                }
                if(selectorId.indexOf('selectPeriodo')!=-1) {
                    onclick = ' onclick="chequeaMultiple(\''+selectorId+'\')"';
                }

                $('#' + selectorId).append(
                    '<div class="checkbox"><label ><input type="checkbox" id="'+ selectorId +
                    componente.id +
                        '" value="' +
                        componente.id +
                        '"'+checked+onclick+'><span id=etiqueta'+componente.id+'>' +
                        componente.title +
                        '</span></label></div>'
                );
            }
            
        }
        
    }
}

function fijarSeccion(seccion) {
    let elementoId = '' + seccion + '_li';
    if (LOG_DEBUG_COMUN) {
        console.log(
            '[fijarSeccion] [seccion:' +
                seccion +
                '] [elementoId:' +
                elementoId +
                '] '
        );
    }
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
        console.log('[removeSessionStorage] [selectores:' + selectores + ']');
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
    if(!filtroSlider){
        filtroSlider = FILTRO_SLIDER_TERRITORIO;
    }

    if(filtroSlider.indexOf('Distrito')==-1){
        $('#radioDistrito').hide();
    }
    if(filtroSlider.indexOf('Barrio')==-1){
        $('#radioBarrio').hide();
    }
    if(filtroSlider.indexOf('Sección Censal')==-1){
        $('#radioSeccionCensal').hide();
    }
}

/**
 * aplicaFiltroTerritorio
 * Funcion para aplicar lógica al slider de territorio
 */
function aplicaFiltroTerritorio(territorio, arrayIframes) {
    if (LOG_DEBUG_COMUN) {
        console.log('[aplicaFiltroTerritorio]');
    }

    let d;
    for(d=0;d<arrayIframes.length;d++) {
        let iframe = arrayIframes [d];
        let url = $('#' + iframe).attr('src');
        //Fijamos el prametros cuboId para pasarlo a los graficos del Mapa
        let indice = url.indexOf('cuboId');
        let paramCuboId = url.substring(indice, url.length);
        if (LOG_DEBUG_COMUN) {
            console.log('[aplicaFiltroTerritorio] [paramCuboId:' + paramCuboId + ']');
        }

        if (territorio == 'municipio') {
            url =
                'grafico_mapa.html?territorio=municipio&titulo=personas_municipio&iframe=iframeGraficoMapa&' +
                paramCuboId;
            $('#' + iframe).attr('src', url);
        } else if (territorio == 'distrito') {
            url =
                'grafico_mapa.html?territorio=distrito&titulo=personas_distrito&iframe=iframeGraficoMapa&' +
                paramCuboId;
            $('#' + iframe).attr('src', url);
        } else if (territorio == 'barrio') {
            url =
                'grafico_mapa.html?territorio=barrio&titulo=personas_barrio&iframe=iframeGraficoMapa&' +
                paramCuboId;
            $('#' + iframe).attr('src', url);
        } else if (territorio == 'seccion_censal') {
            url =
                'grafico_mapa.html?territorio=seccion-censal&titulo=personas_seccion_censal&iframe=iframeGraficoMapa&' +
                paramCuboId;
            $('#' + iframe).attr('src', url);
        } else {
            console.error(
                '[aplicaFiltroTerritorio] [filtro:' + territorio + '] Not found!!'
            );
        }
    }
    
}

function selececionarTodo(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('selececionarTodo');
    }
    $('#' + capa + ' .checkbox label input').prop('checked', true);
}

function quitarSeleccion(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('quitarSeleccion');
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

function cambioCapa(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapa');
    }
    if(capa == 'inicio') {
        location.replace('index.html');
    } else if (capa == 'ayuda') {
        $('#buttonIndicadores').css('font-weight', 'normal');
        $('#buttonInicio').css('font-weight', 'normal');
        $('#buttonEdadSimple').css('font-weight', 'normal');
        $('#buttonEdadQuinquenales').css('font-weight', 'normal');
        $('#buttonNivelEstudio').css('font-weight', 'normal');
        $('#buttonGlosario').css('font-weight', 'bold');

        $('#capaInicio').hide();
        $('#capaEdadQuinquenales').hide();
        $('#capIndicadoress').hide();
        $('#capaAyuda').show();
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

function indicadores(url) {
    
    $.getJSON(url)
        .done(function (data) {
            let suma = 0;
            if (data.records) {
                let i;
                for (i = 0; i < data.records.length; i++) {
                    suma = suma + Number(data.records[i].SUM);

                }
                let numeralSuma = numeral(suma);
                $('#indicadores1').html(numeralSuma.format(numFormatoSinDecimales)+' personas');
            }
        })
        
}

function deshabilitaTerritorio() {
    $('#liTerritorio').addClass('disabled');
    $('#aTerritorio').addClass(' btn disabled');
    $('.nav-tabs a:last').tab('show');
}

function habilitaTerritorio() {
    $('#liTerritorio').removeClass('disabled');
    $('#aTerritorio').removeClass('btn disabled');
}

function chequeaMultiple(capa) {
    if (LOG_DEBUG_COMUN) {
        console.log('cambioCapa');
    }

    let numchecked = 0;
    $('#' + capa + '  .checkbox label input').each(function( index ) {
        if($( this ).is(':checked')) {
            numchecked = numchecked + 1;
        }
    });

    if(numchecked>1){
        deshabilitaTerritorio();
    } else {
        habilitaTerritorio();
    }
}