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

/* Generales */
/* Variable que activa a desactiva la autenticación de las llamadas a la API. true lo activa, false lo desactiva */
const SEGURIDAD = false;

/* Variables de depuración */
const LOG_DEBUG_COMUN = false;
const LOG_DEBUG_GRAFICO_BARRAS = false;
const LOG_DEBUG_GRAFICO_TARTAS = false;
const LOG_DEBUG_GRAFICO_MAPA = false;
const LOG_DEBUG_GRAFICO_PIRAMIDE = false;
const LOG_DEBUG_GRAFICO_TABLA_DATOS = false;

/* Variables de visualizacion */
/* Número de registros para las tablas de búsqueda */
const REGISTROS_TABLA_BUSQUEDA = 10;
/* Número de registros para las tablas de los gráficos */
const REGISTRO_TABLA_GRAFICOS = 500;

/* Dominio de la API */
const URL_API = "https://api.ciudades-abiertas.es/";
/* URL de la documentación de la API */
const DOC_API = URL_API+'/swagger/index.html';

/* Si la API tiene multiidioma con esta variable de podrá controlar */
const IDIOMA_API = '';

const DSD_URL = URL_API+IDIOMA_API+'/data-cube/data-structure-definition';
const DATACUBE_URL = URL_API+IDIOMA_API+'/padron/datacube/';

/* Dominio del conjunto de datos de una petición    de autenticación */
const TOKEN_URL = URL_API + '/oauth/token';

/* Parámetros de la API */
const PARAM_FIELDS_API = 'fields';
const PARAM_FIELD_API = 'field';
const PARAM_GROUP_API = 'group';
const PARAM_SORT_API = 'sort';
const PARAM_PAGESIZE_API = 'pageSize';
const PARAM_WHERE_API = 'where';
const PARAM_Q_API = 'q';
const PARAM_PAGE_API = 'page';
const PARAM_HAVING_API = 'having';


/* URL para obtener los valores de una dimensión */ 
const DSD_VALORES_DIMENSIONES_URL_1 = DSD_URL+'/dimension/';
const DSD_VALORES_DIMENSIONES_URL_2 = '/value';

/* URL para realizar consultas a los cubos de padrón */
const POBLACION_URL_1 = DATACUBE_URL;
const POBLACION_URL_2 = '/query.json';
const POBLACION_URL_2_CSV = '/query.csv';

/* URL para pedir las coordenadas del territorio */
const TERRITORIO_URL_1 = URL_API+IDIOMA_API+'/territorio/';
const TERRITORIO_URL_2 = '.geojson?'+PARAM_PAGE_API+'=1&'+PARAM_SORT_API+'=id&srId=EPSG%3A4326';

/* URL para obtener los datos de la pirámide de la población */
const POBLACION_PIRAMIDE_URL = DATACUBE_URL+'/edad-grupo-quinquenal/query.json';
const POBLACION_PIRAMIDE_TERR_URL = DATACUBE_URL+'/edad-grupo-quinquenal/query.json';
const POBLACION_PIRAMIDE_URL_CSV = DATACUBE_URL+'/edad-grupo-quinquenal/query.csv';
const POBLACION_PIRAMIDE_ETIQUETAS_URL = DSD_URL+'/dimension/edadGruposQuinquenales/value?'+PARAM_PAGE_API+'=1&'+PARAM_PAGESIZE_API+'=100';

/* URL para obtener los datos de la pirámide de la población simple*/
const POBLACION_PIRAMIDE_S_URL = DATACUBE_URL+'/edad/query.json';
const POBLACION_PIRAMIDE_S_TERR_URL = DATACUBE_URL+'/edad/query.json';
const POBLACION_PIRAMIDE_S_URL_CSV = DATACUBE_URL+'/edad/query.csv';
const POBLACION_PIRAMIDE_S_ETIQUETAS_URL = DSD_URL+'/dimension/edad/value?'+PARAM_PAGE_API+'=1&'+PARAM_PAGESIZE_API+'=100';

/* Paginas definidas para los includes */
const MENU_INICIO = 'inicio';
const MENU_EDAD_SIMPLE = 'edad_simple';
const MENU_EDAD_GRUPOS_QUINQUENALES = 'edad_grupos_quinquenales';
const MENU_NIVEL_ESTUDIO ='nivel_estudio';
const MENU_INDICADORES = 'indicadores';
const MENU_NACIONALIDAD = 'nacionalidad';
const MENU_PROCEDENCIA = 'procedencia';
const MENU_PAIS_NACIMIENTO = 'pais_nacimiento';

/* identificador de las dimensiónes que se necesitarán sacar sus valores */
const DIMENSION_EDAD_SIMPLE = 'edad';
const DIMENSION_EDAD_QUINQUENAL = 'edadGruposQuinquenales';
const DIMENSION_SEXO = 'sex';
const DIMENSION_NIVEL_ESTUDIOS = 'tipoNivelEstudio';
const DIMENSION_NACIONALIDAD = 'nacionalidad';
const DIMENSION_PROCEDENCIA = 'procedencia';
const DIMENSION_PAIS_NACIMIENTO = 'paisNacimiento';

/* Parametros para el control de sesiones */
//Valor en segundos
const TIME_SESSION_STORAGE = 300;
//Nombre de la vble a guardar en sesion
const PARAM_TIME_SESSION = 'TIME_OUT_SESSION';

/* CONFIGURACION DE LOS CUBOS PARA LA TABLA DE DATOS */
/* Cubos definidos en los dsd */
const ETIQUETAS_CUBOS_DSD = new Map([
     ['poblacionPorEdadSimple', 'poblacion-por-edad'],
     ['poblacionPorEdad', 'poblacion-por-edad'],
     ['poblacionPorEdadGruposQuinquenales', 'poblacion-por-edad-grupos-quinquenales'],
     ['poblacionPorIndicadores', 'poblacion-por-indicadores'],
     ['poblacionPorNacionalidad', 'poblacion-por-nacionalidad'],
     ['poblacionPorNivelEstudio', 'poblacion-por-nivel-estudio'],
     ['poblacionPorPaisNacimiento', 'poblacion-por-pais-nacimiento'],
     ['poblacionPorProcedencia', 'poblacion-por-procedencia']
]);

const URL_CUBOS_OBSERVACION = new Map([
     ['poblacionPorEdadSimple', DATACUBE_URL+'edad/observation'],
     ['poblacionPorEdad', DATACUBE_URL+'edad/observation'],
     ['poblacionPorEdadGruposQuinquenales', DATACUBE_URL+'edad-grupo-quinquenal/observation'],
     ['poblacionPorIndicadores', DATACUBE_URL+'indicadores/observation'],
     ['poblacionPorNacionalidad', DATACUBE_URL+'nacionalidad/observation'],
     ['poblacionPorNivelEstudio', DATACUBE_URL+'estudios/observation'],
     ['poblacionPorPaisNacimiento', DATACUBE_URL+'pais-nacimiento/observation'],
     ['poblacionPorProcedencia', DATACUBE_URL+'procedencia/observation']
]);

const URL_CUBOS = new Map([
     ['poblacionPorEdadSimple', DATACUBE_URL+'edad'],
     ['poblacionPorEdad', DATACUBE_URL+'edad'],
     ['poblacionPorEdadGruposQuinquenales', DATACUBE_URL+'edad-grupo-quinquenal'],
     ['poblacionPorIndicadores', DATACUBE_URL+'indicadores'],
     ['poblacionPorNacionalidad', DATACUBE_URL+'nacionalidad'],
     ['poblacionPorNivelEstudio', DATACUBE_URL+'estudios'],
     ['poblacionPorPaisNacimiento', DATACUBE_URL+'pais-nacimiento'],
     ['poblacionPorProcedencia', DATACUBE_URL+'procedencia']
]);

/* Constante para añadir las etiquetas de las dimensiones */
const ETIQUETAS_DIMENSION_DSD = new Map([
     ['age', 'Edad'],
     ['edadGruposQuinquenales', 'edad-grupos-quinquenales'],
     ['municipioProcedencia', 'municipio-procedencia'],
     ['nacionalidad', 'nacionalidad'],
     ['paisNacimiento', 'pais-nacimiento'],
     ['provinciaProcedencia', 'provincia-procedencia'],
     ['refPeriod', 'refPeriod'],
     ['sex', 'sex'],
     ['tipoNivelEstudio', 'tipo-nivel-estudio'],
     ['paisId', 'pais-id'],
     ['paisTitle', 'pais-title'],
     ['autonomiaId', 'autonomia-id'],
     ['autonomiaTitle', 'autonomia-title'],
     ['provinciaId', 'provincia-id'],
     ['provinciaTitle', 'provincia-title'],
     ['municipioId', 'municipio-id'],
     ['municipioTitle', 'municipio-title'],
     ['distritoId', 'distrito-id'],
     ['distritoTitle', 'distrito-title'],
     ['barrioId', 'barrio-id'],
     ['barrioTitle', 'barrio-title'],
     ['seccionCensalId', 'seccion-censal-id'],
     ['seccionCensalTitle', 'seccion-censal-title']
]);

/* Constante para añadir las etiquetas de las medidas */
const ETIQUETAS_INDICES_DSD = new Map([
     ['numeroPersonas', 'Número de personas'],
     ['indiceDependencia', 'Índice de dependencia'],
     ['indiceFeminidad', 'Índice de feminidad'],
	 ['indiceInfancia', 'Índice de infancia'],
     ['indiceJuventud', 'Índice de juventud'],
     ['indiceMaternidad', 'Índice de maternidad'],	
     ['indicePoblacionActiva', 'Índice de población activa'],	 
     ['indiceReemplazo', 'Índice de reemplazo'],	 
     ['indiceSobreenvejecimiento', 'Índice de sobreenvejecimiento'],
     ['indiceTendencia', 'Índice de tendencia'],	 
     ['tasaMortalidad', 'Tasa de mortalidad'],	 
     ['tasaNatalidad', 'Tasa de natalidad'],
     ['edadMediaPoblacion', 'Edad media de la población'],
]);

/* Constante para añadir las etiquetas de las medidas */
const ETIQUETAS_PORCENTAJES_DSD = new Map([
    ['porcentajePoblacionJoven', 'Porcentaje de población joven'],
    ['porcentajePoblacionAdulta', 'Porcentaje de población adulta'],
    ['porcentajePoblacionEnvejecida', 'Porcentaje de población envejecida'],
    ['porcentajePoblacionExtranjera', 'Porcentaje de población extranjera'],
    ['porcentajePoblacionExtranjeraInfantil', 'Porcentaje de población extranjera infantil'], 
    ['porcentajePoblacionNacidaExtranjero', 'Porcentaje de población nacida en el extranjero']
]);

/* Constantes para configurar la ordenación de las columnas de las tablas de datos genericas */
//no mostramos información de pais, provincia, autonomia

let ORDEN_COLUMNAS_TABLAS_DATOS_INDICADORES = ['refPeriod', 'numeroPersonas',
 'indiceDependencia', 'indiceFeminidad','indiceInfancia','indiceJuventud', 'indiceMaternidad', 'indicePoblacionActiva', 'indiceReemplazo','indiceSobreenvejecimiento','indiceTendencia','tasaMortalidad','tasaNatalidad','porcentajePoblacionJoven','porcentajePoblacionAdulta','porcentajePoblacionEnvejecida','porcentajePoblacionAnalfabeta','porcentajePoblacionExtranjera','porcentajePoblacionExtranjeraInfantil',
 'porcentajePoblacionNacidaExtranjero','municipioId','municipioTitle','distritoId', 'distritoTitle',
 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];
 
let ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_SIMPLE = ['age', 'sex','refPeriod',
'numeroPersonas','municipioId','municipioTitle','distritoId',
'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_QUINQUENALES = ['edadGruposQuinquenales','refPeriod',
'sex','numeroPersonas','municipioId','municipioTitle','distritoId',
'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle' ];

let ORDEN_COLUMNAS_TABLAS_DATOS_NACIONALIDAD = ['nacionalidad', 'edadGruposQuinquenales', 'refPeriod', 'sex', 'numeroPersonas', 'municipioId', 
'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 
'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_NIVEL_ESTUDIO = ['tipoNivelEstudio', 'refPeriod', 'numeroPersonas'];

let ORDEN_COLUMNAS_TABLAS_DATOS_PAIS_NACIMIENTO = ['paisNacimiento', 'edadGruposQuinquenales', 'refPeriod', 'sex', 'numeroPersonas','municipioId', 
'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 
'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_PROCEDENCIA = ['municipioProcedencia', 'provinciaProcedencia', 'paisProcedencia','edadGruposQuinquenales', 'tipoNivelEstudio', 'refPeriod', 'numeroPersonas', 'municipioId', 
'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 
'seccionCensalTitle'];

const ORDEN_COLUMNAS_TABLA_DATOS = new Map([
     ['poblacionPorIndicadores', ORDEN_COLUMNAS_TABLAS_DATOS_INDICADORES],
     ['poblacionPorEdadSimple', ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_SIMPLE],
     ['poblacionPorEdad', ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_SIMPLE],
     ['poblacionPorEdadGruposQuinquenales', ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_QUINQUENALES],
     ['poblacionPorNacionalidad', ORDEN_COLUMNAS_TABLAS_DATOS_NACIONALIDAD],
     ['poblacionPorNivelEstudio', ORDEN_COLUMNAS_TABLAS_DATOS_NIVEL_ESTUDIO],
     ['poblacionPorProcedencia', ORDEN_COLUMNAS_TABLAS_DATOS_PROCEDENCIA],
     ['poblacionPorPaisNacimiento', ORDEN_COLUMNAS_TABLAS_DATOS_PAIS_NACIMIENTO]
]);

const FILTRO_SLIDER_TERRITORIO = ['Municipio', 'Distrito', 'Barrio', 'Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_INDICADORES = ['Municipio', 'Distrito', 'Barrio'];
const FILTRO_SLIDER_TERRITORIO_EDAD_SIMPLE = ['Municipio', 'Distrito', 'Barrio', 'Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_EDAD_QUINQUENALES = ['Municipio', 'Distrito', 'Barrio'];
const FILTRO_SLIDER_TERRITORIO_NACIONALIDAD = ['Municipio', 'Distrito', 'Barrio', 'Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_NIVEL_ESTUDIO = ['Municipio', 'Distrito', 'Barrio'];
const FILTRO_SLIDER_TERRITORIO_PROCEDENCIA = ['Municipio', 'Distrito', 'Barrio', 'Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO = ['Municipio', 'Distrito', 'Barrio', 'Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_INICIO = ['Municipio', 'Distrito', 'Barrio'];

 /* Disponibles: Indicadores, EdadSimple, EdadQuinquenales, Nacionalidad, NivelEstudio, Procedencia, PaisNacimiento */ 
const FILTRO_MENU_CUBOS = [ 'Indicadores','EdadSimple','EdadQuinquenales','Nacionalidad','NivelEstudio', 'Procedencia', 'PaisNacimiento'];