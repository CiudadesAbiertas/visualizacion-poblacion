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
const LOG_DEBUG_EDAD_QUINQUENALES = false;
const LOG_DEBUG_EDAD_SIMPLE = false;
const LOG_DEBUG_INDICADORES = false;
const LOG_DEBUG_NACIONALIDAD = false;
const LOG_DEBUG_NIVEL_ESTUDIO = false;
const LOG_DEBUG_PAIS_NACIMIENTO = false;
const LOG_DEBUG_PROCEDENCIA = false;
const LOG_DEBUG_GRAFICO_BARRAS = false;
const LOG_DEBUG_GRAFICO_COMBINADO_BARRAS = false;
const LOG_DEBUG_GRAFICO_COMBINADO_LINEAS = false;
const LOG_DEBUG_GRAFICO_COMPARADOR_TERRITORIOS = false;
const LOG_DEBUG_GRAFICO_LINEA = false;
const LOG_DEBUG_GRAFICO_MAPA = false;
const LOG_DEBUG_GRAFICO_NIVEL_ESTUDIO_COMBINADO = false;
const LOG_DEBUG_GRAFICO_PIRAMIDE = false;
const LOG_DEBUG_GRAFICO_RADAR = false;
const LOG_DEBUG_GRAFICO_TABLA_DATOS = false;
const LOG_DEBUG_GRAFICO_TARTAS = false;


/* Variables de visualizacion */
/* Número de registros para las tablas de búsqueda */
const REGISTROS_TABLA_BUSQUEDA = 10;
/* Número de registros para las tablas de los gráficos */
const REGISTRO_TABLA_GRAFICOS = 500;


/* Dominio de la API */
const URL_API = 'https://api.ciudades-abiertas.es/';
/* URL de la documentación de la API */
const DOC_API = URL_API + '/swagger/index.html';

/* Si la API tiene multiidioma con esta variable de podrá controlar */
const IDIOMA_API = '';

const DSD_URL = URL_API + IDIOMA_API + '/data-cube/data-structure-definition';
const DATACUBE_URL = URL_API + IDIOMA_API + '/padron/datacube/';

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
const DSD_VALORES_DIMENSIONES_URL_1 = DSD_URL + '/dimension/';
const DSD_VALORES_DIMENSIONES_URL_2 = '/value';

/* URL para realizar consultas a los cubos de padrón */
const POBLACION_URL_1 = DATACUBE_URL;
const POBLACION_URL_2 = '/query.json';
const POBLACION_URL_2_CSV = '/query.csv';

/* URL para pedir las coordenadas del territorio */
const TERRITORIO_URL_1 = URL_API + IDIOMA_API + '/territorio/';
const TERRITORIO_URL_2 = '.geojson?' + PARAM_PAGE_API + '=1&' + PARAM_SORT_API + '=id&srId=EPSG%3A4326';
//const TERRITORIO_URL_2 = '.geojson?'+PARAM_PAGE_API+'=1&'+PARAM_SORT_API+'=-id&srId=EPSG%3A4326';
/* Dominio del conjunto de datos de una petición    agrupada en formato CSV */
// const territorioSeccionCensalURLCSV =URL_API+IDIOMA_API+'/territorio/seccionCensal.csv?'+PARAM_PAGE_API+'=1&'+PARAM_SORT_API+'=id&srId=EPSG%3A4326';
/* Dominio de la documentación del conjunto de datos de subvención */
// const docTerritorioSeccionCensalAPI = URL_API+'/swagger/index.html#/Territorio - Sección Censal';

/* URL para obtener los datos de la pirámide de la población */
const POBLACION_PIRAMIDE_URL = DATACUBE_URL + '/edad-grupo-quinquenal/query.json';
const POBLACION_PIRAMIDE_TERR_URL = DATACUBE_URL + '/edad-grupo-quinquenal/query.json';
const POBLACION_PIRAMIDE_URL_CSV = DATACUBE_URL + '/edad-grupo-quinquenal/query.csv';
// const POBLACION_PIRAMIDE_URL = DATACUBE_URL+'/edad-grupo-quinquenal/query.json?dimension=edadGruposQuinquenales as edadGruposQuinquenales%2Csex as sex&group=SUM&measure=numeroPersonas&'+PARAM_PAGE_API+'=1&'+PARAM_PAGESIZE_API+'=100';
// const POBLACION_PIRAMIDE_URL_CSV = DATACUBE_URL+'/edad-grupo-quinquenal/query.csv?dimension=edadGruposQuinquenales as edadGruposQuinquenales%2Csex as sex&group=SUM&measure=numeroPersonas&'+PARAM_PAGE_API+'=1&'+PARAM_PAGESIZE_API+'=100';
// const POBLACION_PIRAMIDE_TERR_URL = DATACUBE_URL+'/edad-grupo-quinquenal/query.json?dimension=barrioId as barrioId%2CedadGruposQuinquenales as edadGruposQuinquenales%2Csex as sex&group=SUM&measure=numeroPersonas&'+PARAM_PAGE_API+'=1&'+PARAM_PAGESIZE_API+'=100';
const POBLACION_PIRAMIDE_ETIQUETAS_URL = DSD_URL + '/dimension/edadGruposQuinquenales/value?' + PARAM_PAGE_API + '=1&' + PARAM_PAGESIZE_API + '=100';

/* URL para obtener los datos de la pirámide de la población simple*/
const POBLACION_PIRAMIDE_S_URL = DATACUBE_URL + '/edad/query.json';
const POBLACION_PIRAMIDE_S_TERR_URL = DATACUBE_URL + '/edad/query.json';
const POBLACION_PIRAMIDE_S_URL_CSV = DATACUBE_URL + '/edad/query.csv';
const POBLACION_PIRAMIDE_S_ETIQUETAS_URL = DSD_URL + '/dimension/edad/value?' + PARAM_PAGE_API + '=1&' + PARAM_PAGESIZE_API + '=100';



/* Paginas definidas para los includes */
const MENU_INICIO = 'inicio';
const MENU_EDAD_SIMPLE = 'edad_simple';
const MENU_EDAD_GRUPOS_QUINQUENALES = 'edad_grupos_quinquenales';
const MENU_NIVEL_ESTUDIO = 'nivel_estudio';
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
    ['poblacionPorEdadSimple', DATACUBE_URL + 'edad/observation'],
    ['poblacionPorEdad', DATACUBE_URL + 'edad/observation'],
    ['poblacionPorEdadGruposQuinquenales', DATACUBE_URL + 'edad-grupo-quinquenal/observation'],
    ['poblacionPorIndicadores', DATACUBE_URL + 'indicadores/observation'],
    ['poblacionPorNacionalidad', DATACUBE_URL + 'nacionalidad/observation'],
    ['poblacionPorNivelEstudio', DATACUBE_URL + 'estudios/observation'],
    ['poblacionPorPaisNacimiento', DATACUBE_URL + 'pais-nacimiento/observation'],
    ['poblacionPorProcedencia', DATACUBE_URL + 'procedencia/observation']
]);

const URL_CUBOS = new Map([
    ['poblacionPorEdadSimple', DATACUBE_URL + 'edad'],
    ['poblacionPorEdad', DATACUBE_URL + 'edad'],
    ['poblacionPorEdadGruposQuinquenales', DATACUBE_URL + 'edad-grupo-quinquenal'],
    ['poblacionPorIndicadores', DATACUBE_URL + 'indicadores'],
    ['poblacionPorNacionalidad', DATACUBE_URL + 'nacionalidad'],
    ['poblacionPorNivelEstudio', DATACUBE_URL + 'estudios'],
    ['poblacionPorPaisNacimiento', DATACUBE_URL + 'pais-nacimiento'],
    ['poblacionPorProcedencia', DATACUBE_URL + 'procedencia']
]);

/* Constante para añadir las etiquetas de las dimensiones */
const ETIQUETAS_TABLA = new Map([
    ['age', 'Edad'],
    ['edadGruposQuinquenales', 'Edad grupos quinquenales'],
    ['municipioProcedencia', 'Municipio procedencia'],
    ['nacionalidad', 'Nacionalidad'],
    ['paisNacimiento', 'Pais nacimiento'],
    ['provinciaProcedencia', 'Provincia procedencia'],
    ['paisProcedencia', 'Pais procedencia'],
    ['refPeriod', 'Periodo'],
    ['sex', 'Sexo'],
    ['tipoNivelEstudio', 'Tipo nivel estudio'],
    ['paisId', 'Pais id'],
    ['paisTitle', 'Pais'],
    ['autonomiaId', 'Autonomia id'],
    ['autonomiaTitle', 'Autonomia'],
    ['provinciaId', 'Provincia id'],
    ['provinciaTitle', 'Provincia'],
    ['municipioId', 'Municipio id'],
    ['municipioTitle', 'Municipio'],
    ['distritoId', 'Distrito id'],
    ['distritoTitle', 'Distrito'],
    ['barrioId', 'Barrio id'],
    ['barrioTitle', 'Barrio'],
    ['seccionCensalId', 'Seccion censal id'],
    ['seccionCensalTitle', 'Seccion censal'],
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
    ['porcentajePoblacionJoven', 'Porcentaje de población joven'],
    ['porcentajePoblacionAdulta', 'Porcentaje de población adulta'],
    ['porcentajePoblacionEnvejecida', 'Porcentaje de población envejecida'],
    ['porcentajePoblacionExtranjera', 'Porcentaje de población extranjera'],
    ['porcentajePoblacionExtranjeraInfantil', 'Porcentaje de población extranjera infantil'],
    ['porcentajePoblacionNacidaExtranjero', 'Porcentaje de población nacida en el extranjero'],
    ['porcentajePoblacionAnalf', 'Porcentaje de población analfabeta']
]);

/* Constante para añadir las etiquetas de las medidas */
const ETIQUETAS_INDICES_DSD = new Map([
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
    //['numeroPersonas', 'Número de personas'],
]);

/* Constante para añadir las etiquetas de las medidas */
const ETIQUETAS_PORCENTAJES_DSD = new Map([
    ['porcentajePoblacionJoven', 'Porcentaje de población joven'],
    ['porcentajePoblacionAdulta', 'Porcentaje de población adulta'],
    ['porcentajePoblacionEnvejecida', 'Porcentaje de población envejecida'],
    ['porcentajePoblacionExtranjera', 'Porcentaje de población extranjera'],
    ['porcentajePoblacionExtranjeraInfantil', 'Porcentaje de población extranjera infantil'],
    ['porcentajePoblacionNacidaExtranjero', 'Porcentaje de población nacida en el extranjero'],
    ['porcentajePoblacionAnalf', 'Porcentaje de población analfabeta']
]);

/* Constante para añadir las etiquetas de las medidas */
const ETIQUETAS_INDICES_PORCENTAJES_DSD = new Map([
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
    ['numeroPersonas', 'Número de personas'],
    ['porcentajePoblacionJoven', 'Porcentaje de población joven'],
    ['porcentajePoblacionAdulta', 'Porcentaje de población adulta'],
    ['porcentajePoblacionEnvejecida', 'Porcentaje de población envejecida'],
    ['porcentajePoblacionExtranjera', 'Porcentaje de población extranjera'],
    ['porcentajePoblacionExtranjeraInfantil', 'Porcentaje de población extranjera infantil'],
    ['porcentajePoblacionNacidaExtranjero', 'Porcentaje de población nacida en el extranjero'],
    ['porcentajePoblacionAnalf', 'Porcentaje de población analfabeta']
]);

/* Constantes para configurar la ordenación de las columnas de las tablas de datos genericas */
//no mostramos información de pais, provincia, autonomia


let ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_SIMPLE = ['age', 'sex', 'refPeriod', 'numeroPersonas', 'municipioId', 'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_EDAD_QUINQUENALES = ['edadGruposQuinquenales', 'sex', 'refPeriod', 'numeroPersonas', 'municipioId', 'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_NACIONALIDAD = ['nacionalidad', 'edadGruposQuinquenales', 'sex', 'refPeriod', 'numeroPersonas', 'municipioId', 'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId',  'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_NIVEL_ESTUDIO = ['tipoNivelEstudio', 'age', 'sex', 'refPeriod', 'numeroPersonas', 'municipioId', 'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId',  'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_PROCEDENCIA = ['paisProcedencia',  'provinciaProcedencia','municipioProcedencia', 'edadGruposQuinquenales', 'tipoNivelEstudio', 'refPeriod', 'numeroPersonas', 'municipioId', 'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_PAIS_NACIMIENTO = ['paisNacimiento', 'edadGruposQuinquenales', 'sex', 'refPeriod', 'numeroPersonas',  'municipioId', 'municipioTitle', 'distritoId', 'distritoTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];

let ORDEN_COLUMNAS_TABLAS_DATOS_INDICADORES = ['refPeriod', 'indiceDependencia', 'indiceFeminidad', 'indiceInfancia', 'indiceJuventud', 'indiceMaternidad', 'indicePoblacionActiva', 'indiceReemplazo',  'indiceSobreenvejecimiento', 'indiceTendencia', 'tasaMortalidad', 'tasaNatalidad', 'porcentajePoblacionAnalf', 'porcentajePoblacionJoven',  'porcentajePoblacionAdulta', 'porcentajePoblacionEnvejecida', 'porcentajePoblacionExtranjera',
    'porcentajePoblacionExtranjeraInfantil', 'porcentajePoblacionNacidaExtranjero', 'numeroPersonas','municipioId', 'municipioTitle', 'barrioId', 'barrioTitle', 'seccionCensalId', 'seccionCensalTitle'];

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
const FILTRO_SLIDER_TERRITORIO_INDICADORES = ['Municipio', 'Barrio'];
const FILTRO_SLIDER_TERRITORIO_EDAD_SIMPLE = ['Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_EDAD_QUINQUENALES = ['Municipio', 'Barrio'];
const FILTRO_SLIDER_TERRITORIO_NACIONALIDAD = ['Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_NIVEL_ESTUDIO = ['Barrio'];
const FILTRO_SLIDER_TERRITORIO_PROCEDENCIA = ['Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_PAIS_NACIMIENTO = ['Sección Censal'];
const FILTRO_SLIDER_TERRITORIO_INICIO = ['Municipio', 'Distrito', 'Barrio'];

/* Disponibles: Indicadores, EdadSimple, EdadQuinquenales, Nacionalidad, NivelEstudio, Procedencia, PaisNacimiento */
const FILTRO_MENU_CUBOS = ['Indicadores', 'EdadSimple', 'EdadQuinquenales', 'Nacionalidad', 'NivelEstudio', 'Procedencia', 'PaisNacimiento'];

const VALORES_EDAD_QUINQUENAL = new Map([
    ['00-a-04', 'De 00 a 4 años'],
    ['05-a-09', 'De 05 a 9 años'],
    ['10-a-14', 'De 10 a 14 años'],
    ['15-a-19', 'De 15 a 19 años'],
    ['20-a-24', 'De 20 a 24 años'],
    ['25-a-29', 'De 25 a 29 años'],
    ['30-a-34', 'De 30 a 34 años'],
    ['35-a-39', 'De 35 a 39 años'],
    ['40-a-44', 'De 40 a 44 años'],
    ['45-a-49', 'De 45 a 49 años'],
    ['50-a-54', 'De 50 a 54 años'],
    ['55-a-59', 'De 55 a 59 años'],
    ['60-a-64', 'De 60 a 64 años'],
    ['65-a-69', 'De 65 a 69 años'],
    ['70-a-74', 'De 70 a 74 años'],
    ['75-a-79', 'De 75 a 79 años'],
    ['80-a-84', 'De 80 a 84 años'],
    ['85-a-89', 'De 85 a 89 años'],
    ['90-a-94', 'De 90 a 94 años'],
    ['95-y-mas', 'De 95 y más años'],
    ['sin-clasificar', 'Sin clasificar']
]);

const VALORES_SEXO = new Map([
    ['sex-F', 'Mujer'],
    ['sex-M', 'Hombre'],
    ['sex-N', 'No aplica'],
    ['sex-T', 'Total'],
    ['sex-U', 'Desconocido']
]);

const VALORES_NACIONALIDAD = new Map([
    ['espanoles', 'Españoles'],
    ['extranjeros-comunitarios-ue-27', 'Extranjeros comunitarios (UE-27)'],
    ['extranjeros-comunitarios-ue-28', 'Extranjeros comunitarios (UE-28)'],
    ['extranjeros-no-comunitarios', 'Extranjeros no comunitarios'],
    ['no-consta', 'No consta']
]);

const VALORES_NIVEL_ESTUDIOS = new Map([
    ['00', 'No aplicable por ser menor de 16 años'],
    ['10', 'No sabe leer ni escribir'],
    ['20', 'Inferior a grado escolar'],
    ['21', 'Sin estudios'],
    ['22', 'Enseñanza primaria incompleta'],
    ['30', 'Grado escolar o equivalente'],
    ['31', 'Bachiller elemental, graduado escolar, EGB completa, primaria completa, ESO, formación profesional básica'],
    ['32', 'Formación profesional primer grado/grado medio, oficialía industrial'],
    ['40', 'Bachiller, formación profesional de segundo grado o títulos equivalentes o superiores'],
    ['41', 'Formación profesional segundo grado/grado superior, maestría industrial'],
    ['42', 'Bachiller superior/LOGSE, BUP'],
    ['43', 'Otras titulaciones medias'],
    ['44', 'Diplomado en escuelas universitarias'],
    ['45', 'Arquitecto o Ingeniero técnico'],
    ['46', 'Grado/Licenciado universitario, arquitecto o ingeniero superior'],
    ['47', 'Estudios superiores no universitarios'],
    ['48', 'Doctorado, postgrado, especialización licenciado, máster universitario'],
    ['99', 'Sin especificar']
]);

const DIMENSION_CON_ETIQUETA = ['sex', 'edadGruposQuinquenales', 'nacionalidad', 'tipoNivelEstudio'];