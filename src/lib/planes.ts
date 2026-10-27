// Conteos que repiten varias pantallas (Bienvenida, Mapa, Inicio) sobre la lista de eventos publicados
// (lib/datos-eventos.ts). Antes cada una contaba sobre src/data/eventos.ts completo.
import type { Evento } from '../data/eventos';
import { ciudades } from '../data/ciudades';
import { fechasAgenda } from '../data/agenda';
import { departamentoDeCiudad } from '../data/departamentos';

const finde = fechasAgenda.find((f) => f.id === 'finde')!;

// "Este finde" (el mismo rango de la Agenda y el Mapa)
export const delFinde = (lista: Evento[]) => lista.filter((e) => e.fecha >= finde.desde && e.fecha <= finde.hasta);

// Planes por ciudad (ids del sitio y, para los municipios de D1 que no son ciudad del sitio, su slug)
export const porCiudad = (lista: Evento[]) => {
  const conteo: Record<string, number> = {};
  for (const e of lista) conteo[e.ciudad] = (conteo[e.ciudad] ?? 0) + 1;
  return conteo;
};

// Departamento de un evento: el de D1 o, en los de ejemplo, el de su ciudad
export const departamentoDe = (e: Evento) => e.departamento ?? departamentoDeCiudad[e.ciudad];

// Planes por departamento (código DANE): colorea el mapa de tierra y mar con todos los municipios
export const porDepartamento = (lista: Evento[]) => {
  const conteo: Record<string, number> = {};
  for (const e of lista) {
    const cod = departamentoDe(e);
    if (cod) conteo[cod] = (conteo[cod] ?? 0) + 1;
  }
  return conteo;
};

// Ciudades del sitio con al menos un plan
export const ciudadesActivas = (lista: Evento[]) => {
  const conteo = porCiudad(lista);
  return ciudades.filter((c) => conteo[c.id]).length;
};
