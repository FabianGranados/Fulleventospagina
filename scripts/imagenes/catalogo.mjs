// Busca el evento al que corresponde cada registro. Hoy los eventos están en src/data/eventos.ts (etapa A);
// cuando pasen a D1 (etapa B) solo cambia `cargarEventos`.
import { normalizar, slug } from '../../src/lib/formato.ts';
import { ErrorImagen } from './politica.mjs';

export const cargarEventos = async () => (await import('../../src/data/eventos.ts')).eventos;

export const crearCatalogo = (eventos) => {
  const porId = new Map(eventos.map((e) => [e.id, e]));
  return {
    porId,
    resolver(ref) {
      if (ref.id) {
        const e = porId.get(ref.id);
        if (!e) throw new ErrorImagen('evento_no_encontrado', `No existe el evento ${ref.id}`);
        return e;
      }
      let candidatos;
      if (ref.ciudad && ref.slug) {
        const s = slug(ref.slug);
        candidatos = eventos.filter((e) => e.ciudad === normalizar(ref.ciudad).replace(/\s+/g, '') && slug(e.titulo) === s);
      } else {
        const t = slug(ref.titulo ?? '');
        candidatos = eventos.filter(
          (e) => slug(e.titulo) === t && e.fecha === ref.fecha && (!ref.ciudad || e.ciudad === normalizar(ref.ciudad).replace(/\s+/g, '')),
        );
      }
      const texto = JSON.stringify(ref);
      if (!candidatos.length) throw new ErrorImagen('evento_no_encontrado', `Ningún evento coincide con ${texto}`);
      if (candidatos.length > 1) throw new ErrorImagen('evento_ambiguo', `Varios eventos coinciden con ${texto}; usa el id`);
      return candidatos[0];
    },
  };
};
