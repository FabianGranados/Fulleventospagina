# Licencias de datos de terceros

## src/data/divipola.json y migraciones/0003_divipola.sql

Fuente: Departamento Administrativo Nacional de Estadística (DANE), "DIVIPOLA - Códigos municipios", publicado en
datos.gov.co (conjunto `gdxc-w37w`). Datos actualizados por el DANE el 24 de enero de 2025; descargados el 19 de
octubre de 2026. Licencia: Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0),
https://creativecommons.org/licenses/by-sa/4.0/deed.es

Cambios hechos a los datos: los nombres pasan de mayúsculas a nombre propio ("SANTIAGO DE CALI" → "Santiago de
Cali"), los nombres de departamento salen de src/data/departamentos.ts (MGN del DANE) y las coordenadas se redondean
a 6 decimales. Por la licencia, `src/data/divipola.json` se comparte con la misma licencia CC BY-SA 4.0.

Para actualizar: `npm run divipola -- archivo.json --fuente "…"` con el JSON de
https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=5000 y luego `npm run divipola:sql`.
