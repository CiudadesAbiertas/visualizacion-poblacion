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
var cuboId;
var paramPaisProcedencia;
var paramProvinciaProcedencia;
var paramMunicipioProcedencia;

var filtro = '';
var cuboEdades = [];
var dimensionEtiquetas = {};

var dimension = '';
var agrupador = '';

var datosCuboInfo=new Array();
let periodos = [];

//Vble para controlar el tamaño
var tamanyFijobarras = $(document).height();

/*
	Función de inicialización del script
*/
function inicializa() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [inicializa]');
    }

    inicializaMultidioma();
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidioma() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [inicializaMultidioma]');
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

    // $.i18n.debug = LOG_DEBUG_GRAFICO_TABLA_DATOS;
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaDatos() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [inicializaDatos]');
    }

    insertaURLSAPI();

    modificaTaskMaster('iframetablaDatosGenerica');

    if (!paramEjeX) {
        dimension = 'refPeriod';
    } else {
        dimension = paramEjeX;
    }
    let medida = 'numeroPersonas';
    if (!paramEjeY) {
        medida = 'numeroPersonas';
    } else {
        medida = paramEjeY;
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

    if(paramMunicipio) {
        isFiltroMunicipioQ();
    }

    if (isSessionTimeOut()) {
        removeSessionStorage(cuboId);
    }

    pintaTabla();

    let url = URL_CUBOS_OBSERVACION.get(cuboId) + filtro;

    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [inicializaDatos] [url]' + url);
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
}

/*
	Método que inserta URLs en el botón Acción
*/
function insertaURLSAPI() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [insertaURLSAPI]');
    }

    $('#urlAPIDoc').attr('href', DOC_API);
    $('#maximizar').attr('href', window.location.href);
    $('#maximizar').attr('target', '_blank');
}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [capturaParam]');
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
    if (getUrlVars()['paisProcedencia']) {
        paramPaisProcedencia = getUrlVars()['paisProcedencia'];
    }
    if (getUrlVars()['provinciaProcedencia']) {
        paramProvinciaProcedencia = getUrlVars()['provinciaProcedencia'];
    }
    if (getUrlVars()['municipioProcedencia']) {
        paramMunicipioProcedencia = getUrlVars()['municipioProcedencia'];
    }

    if (getUrlVars()['titulo']) {
        paramTituloKey = getUrlVars()['titulo'];
        let paramTitulo = $.i18n(paramTituloKey);
        if (paramTitulo) {
        } else {
            paramTitulo = ETIQUETAS_CUBOS_DSD.get(cuboId);
        }
        $('#tituloGrafico').html(decodeURI(paramTitulo));
    }
}

function addFiltro(paramValor, campo) {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [addFiltro] [paramValor] '+paramValor+' [campo] '+campo);
    }

    if (!filtro) {
        filtro = filtro + "?q=";
    } else {
        filtro = filtro + " and ";
    }
    if (paramValor.includes(",")) {
        let params = paramValor.split(",");
        filtro = filtro + "(";
        let h;
        for (h = 0; h < params.length; h++) {
            filtro = filtro + campo + "=='" + params[h];
            if (h < params.length - 1) {
                filtro = filtro + "' or ";
            } else {
                filtro = filtro + "'";
            }
        }
        filtro = filtro + ")";
    } else {
        filtro = filtro + campo + "=='" + paramValor + "'";
    }

    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log("[tabla] [addFiltro] [filtro:" + filtro + "]");
    }
}

/**
 * Funcion de carga de DataTable generica
 */
function loadDataTable() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [loadDataTable] [cuboId:' + cuboId + ']');
    }
    let urlDatos = URL_CUBOS_OBSERVACION.get(cuboId) + filtro ;
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [loadDataTable] [urlDatos:' + urlDatos + ']');
    }

    /*let jqxhr = $.getJSON(
        dameURL(
            urlDatos
        )
    )
        .done(function (data) {
            // if (data && data.records && data.records.length) {
            //     let i;
            //     for (i = 0; i < data.records.length; i++) {
            //         dsdEdadQuinquenales[data.records[i].id] = data.records[i].title;
            //     }
            // }
            let table = $('#tablaBuscador').DataTable();
            table.clear().draw();
            if(data.records) {
                var result = [];
                let count = 0;
                for(var i in data.records) {
                    let row = data.records [i];
                    result[count] = [];
                    for(var j in row) {
                        result[count].push(row [j]);
                    }
                    count=count+1;
                }

                table.rows.add(result).draw();
            }
            
        });*/

    let table = $('#tablaBuscador').DataTable();
    table.ajax.url(dameURL(urlDatos)).load(null, false);
}

/**
 *
 * @param {*} cuboId
 * @param {*} urlAjax
 */
function obtenerInfoCubosDSD() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log(
            '[tabla] [obtenerInfoCubosDSD] [cuboId:' +
                cuboId +
                ']'
        );
    }

    let urlEjecutar = DSD_URL + '/' + cuboId;

    if (
        sessionStorage.getItem(cuboId) &&
        sessionStorage.getItem(cuboId).length
    ) {
        datosCuboInfo = sessionStorage.getItem(cuboId);
    } else {
        let jqxhr = $.getJSON(urlEjecutar)
            .done(function (data) {
                loadAjaxInfoCubobyId(data);
			loadAjaxInfoCubobyId(data);	
                loadAjaxInfoCubobyId(data);
			loadAjaxInfoCubobyId(data);	
                loadAjaxInfoCubobyId(data);
                pintaTabla();
            })
            .fail(function (jqxhr, textStatus, error) {
                let err = textStatus + ', ' + error;
                console.log('Request Failed: ' + err);
            })
            .always(function () {
                sessionStorage.setItem(cuboId, datosCuboInfo);
            });
    }

    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [obtenerInfoCubosDSD] [datosCuboInfo:' + datosCuboInfo + '] ');
    }
}

/**
 * Metodo generico para Obtener la informacion de los cubos
 * @param {*} cuboId
 * @param {*} arrayInfoCubo
 * @param {*} data
 */
function loadAjaxInfoCubobyId(data) {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log(
            '[tabla] [loadAjaxInfoCubobyId] [cuboId:' +
                cuboId +
                ']    [datosCuboInfo:' +
                datosCuboInfo +
                '] [data:' +
                data +
                ']'
        );
    }

	if ( data && data.records && data.records.length )
	{
		 
		for (var i = 0; i < data.records.length; i++) 
		{
			datosCuboInfo.id= data.records[i].id;
			datosCuboInfo.dimension= data.records[i].dimension;
			datosCuboInfo.measure= data.records[i].measure;			 	
			if(LOG_DEBUG_GRAFICO_TABLA_DATOS)
			{
				console.log("[tabla] [loadAjaxInfoCubobyId] [datosCuboInfo.id:"+datosCuboInfo.id+"]  [datosCuboInfo.dimension:"+datosCuboInfo.dimension+"] [datosCuboInfo.measure:"+datosCuboInfo.measure+"] ");
            }
        }
    }
}

/**
 * Funcion para el control del DataTable
 */
function preparaTablaCubo() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [preparaTablaCubo] [cuboId:' + cuboId + ']');
    }

    let copyCadena = $.i18n('copiar');
    let modificarTablaCadena = $.i18n('modificar_tabla');
    let descargarCadena = $.i18n('descargar');

    let cabecerasTablaBuscador = '';

    let columnsCubo = [];

    if (
        ORDEN_COLUMNAS_TABLA_DATOS &&
        ORDEN_COLUMNAS_TABLA_DATOS.get(cuboId)
    ) {
        let ordenColumnas = ORDEN_COLUMNAS_TABLA_DATOS.get(cuboId);
        let i;
        for (i = 0; i < ordenColumnas.length; i++) {
            let valor = ordenColumnas[i];
            let etiqueta = ETIQUETAS_TABLA.get(valor);
            if (!etiqueta || !etiqueta) {
                etiqueta = valor;
            }
            cabecerasTablaBuscador =
                cabecerasTablaBuscador + '<th>' + etiqueta + '</th>';
            let columnInfo = {
                data : valor,
                title : ETIQUETAS_TABLA.get(valor),
                name : valor
            };
            columnsCubo.push(columnInfo);
        }
    }

    let urlLanguaje = 'vendor/datatables/i18n/' + $.i18n().locale + '.json';

    $('#tablaBuscadorTHead').empty();
    $('#tablaBuscadorTHead').append(cabecerasTablaBuscador);

    let tablaBuscador = $('#tablaBuscador').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        pageLength: REGISTROS_TABLA_BUSQUEDA,
        language: {
            url: urlLanguaje,
        },
        ajax: {
            dataSrc: function (data) {
                let total = data.totalRecords;
                data.recordsTotal = total;
                data.recordsFiltered = total;

                let return_data;
				if (data.records) {
                    return_data = data.records;
                } else {
                    return_data = new Array();
                } 
                return return_data;
            },
            data: function (d) {
                let actualPage;
                let newD = new Object();
                newD.pageSize = d.length;
                if(d.length!=0)
				{
					actualPage=(d.start/d.length);
				}
				else
				{
					actualPage=1;
				}
				newD.page=(actualPage+1);

                if (d.order.length) {
                    let numColumnaSeleccionada = d.order[0].column;
                    let dirColumnaSeleccionada = d.order[0].dir;
                    let dataColumnaSeleccionada = d.columns[numColumnaSeleccionada].name;
                    if (dirColumnaSeleccionada == 'asc') {
                        newD.sort = dataColumnaSeleccionada;
                    } else {
                        newD.sort = '-'+dataColumnaSeleccionada;
                    }
                }
                return newD;
            },
        },
        order: [0, 'asc'],
        columns: columnsCubo,
        dom: '<"row panel-footer"<"col-sm-offset-1 col-sm-5"l><"col-sm-6"B>>rt<"row"<"col-sm-5"fi><"col-sm-7"p>>',
        buttons: [
            {
                extend: 'colvis',
                text: modificarTablaCadena+' <span class="fa fa-angle-down"></span>',
                title: 'modificar tabla',
                className: 'btn btn-light'
            },
            {
                extend: 'collection',
                text: descargarCadena+' <span class="fa fa-angle-down"></span>',
                title: 'descargar',
                className: 'btn btn-primary',
                buttons: [
                    {
                        extend: 'csv',
                        text: 'CSV <span class="fa fa-table"></span>',
                        title: 'poblacion',
                        className: 'btn btn-primary',
                        exportOptions: {
                            search: 'applied',
                            order: 'applied',
                        },
                        bom: true,
                    },
                    {
                        extend: 'excel',
                        text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
                        title: 'poblacion',
                        className: 'btn btn-primary',
                        exportOptions: {
                            search: 'applied',
                            order: 'applied',
                        },
                    },
                    {
                        text: 'JSON <span class="fa fa-list-alt "></span>',
                        title: 'poblacion',
                        className: 'btn btn-primary',
                        exportOptions: {
                            search: 'applied',
                            order: 'applied',
                        },
                        action: function (e, dt, button, config) {
                            let data = dt.buttons.exportData();

                            $.fn.dataTable.fileSave(
                                new Blob([JSON.stringify(data)]),
                                'poblacion.json'
                            );
                        },
                    },
                ],
            },
            {
                extend: 'collection',
                text: '...',
                title: 'otros',
                className: 'btn btn-primary',
                buttons: [
                    {
                        extend: 'copy',
                        text: copyCadena + ' <span class="fa fa-copy"></span>',
                        title: 'poblacion',
                        className: 'btn btn-primary',
                        exportOptions: {
                            search: 'applied',
                            order: 'applied',
                        },
                    },
                ]
            },
        ],
        initComplete: function (settings, json) {
            if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
                console.log('[tabla] fin de la carga de la tabla');
            }
            $('#iframetablaDatosGenerica', window.parent.document).height(
                $(document).height()
            );
        },
    });

    //Esta linea es para que no haya warnings en dataTables
    $.fn.dataTable.ext.errMode = 'none';
}

function pintaTabla() {
    if (LOG_DEBUG_GRAFICO_TABLA_DATOS) {
        console.log('[tabla] [pintaTabla]');
    }
    preparaTablaCubo();
    
    loadDataTable();
    $('.modal').modal('hide');
}
