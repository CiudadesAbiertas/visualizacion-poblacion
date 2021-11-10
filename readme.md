------------
Instalación
------------
Para que la instalación esté al 100% habrá que incluir a la visualización una cabecera, un pie de página, repasar el CSS, y repasar los textos para que tenga la forma corporativa de donde se va a alojar la visualización.
Para desplegar la visualización habrá que copiar los ficheros en un servidor web, como apache.

------------
Configuración
------------
La configuración de la visualización se encuentra en::
    dist/js/constantes.js
	dist/js/general.js

Variables para la la visualización en constantes.js:
* URLAPI, esta variable debe de tener la URL de la API. Ej. https://demoapi.localidata.com/OpenCitiesAPI

Variables para las querys de la API en general.js:

Variable para la seguridad:
* seguridad, poner true para que la visualización use seguridad en las llamadas a la API.

Variables de depuración:
* LOG_DEBUG_COMUN, variable para habilitar la depuración del módulo común

Otras variables
* REGISTROS_TABLA_BUSQUEDA, número de registros para las tablas de búsqueda
* logoBase64, logotipo de la exportación de los PDF de las tablas en case 64

------------
Multiidioma
------------
Para cambiar el idioma por defecto habrá que editar los archivos '.html' y cambiar el parámetro lang por el idioma deseado. Por ejemplo::
    <html lang="gl" dir="ltr">
    
La localización de los ficheros con los literales de cada idioma están en::
    dist\i18n\es.json
    dist\i18n\gl.json
    dist\i18n\en.json
    
Y los literales de las tablas están en::
    vendor\datatables\i18n\es.json
    vendor\datatables\i18n\gl.json
    vendor\datatables\i18n\en.json
    