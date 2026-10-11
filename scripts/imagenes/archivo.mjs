// Validación real del archivo (firma de bytes, no la extensión ni el Content-Type) y optimización a WebP.
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { ErrorImagen } from './politica.mjs';

// Firma de los primeros bytes. SVG queda fuera a propósito: puede llevar scripts.
export const detectarFormato = (b) => {
  if (!Buffer.isBuffer(b) || b.length < 16) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (b.toString('ascii', 4, 8) === 'ftyp' && /^avi[fs]$/.test(b.toString('ascii', 8, 12))) return 'avif';
  return null;
};

export const sha256 = (b) => createHash('sha256').update(b).digest('hex');

// Devuelve las variantes WebP listas para R2. Lanza ErrorImagen('archivo_invalido') si algo no cuadra.
export const procesarImagen = async (bytes, politica) => {
  if (bytes.length > politica.maxBytesImagen) {
    throw new ErrorImagen('archivo_muy_grande', `El archivo pesa ${bytes.length} bytes (máximo ${politica.maxBytesImagen})`);
  }
  const formato = detectarFormato(bytes);
  if (!formato || !politica.formatos.includes(formato)) {
    throw new ErrorImagen('archivo_invalido', `No es una imagen permitida (${politica.formatos.join(', ')})`);
  }

  let meta;
  try {
    meta = await sharp(bytes, { limitInputPixels: politica.maxPixeles, failOn: 'error' }).metadata();
  } catch (e) {
    throw new ErrorImagen('archivo_invalido', `La imagen está dañada o es demasiado grande: ${e.message}`);
  }
  const formatoSharp = meta.format === 'heif' ? 'avif' : meta.format === 'jpg' ? 'jpeg' : meta.format;
  if (formatoSharp !== formato) throw new ErrorImagen('archivo_invalido', `La firma dice ${formato} y el contenido ${meta.format}`);
  if ((meta.pages ?? 1) > 1) throw new ErrorImagen('archivo_invalido', 'Las imágenes animadas no se aceptan');

  // Con orientación EXIF aplicada
  const girada = (meta.orientation ?? 1) >= 5;
  const ancho = girada ? meta.height : meta.width;
  const alto = girada ? meta.width : meta.height;
  if (!ancho || !alto || ancho < politica.anchoMinimo || alto < politica.altoMinimo) {
    throw new ErrorImagen('imagen_muy_pequena', `La imagen mide ${ancho} × ${alto} px (mínimo ${politica.anchoMinimo} × ${politica.altoMinimo})`);
  }

  const hash = sha256(bytes);
  const anchos = politica.variantes.filter((w) => w <= ancho);
  if (!anchos.length) anchos.push(Math.min(...politica.variantes));

  const variantes = [];
  for (const w of anchos) {
    try {
      // rotate() aplica el EXIF; los metadatos (GPS, cámara…) no se copian porque sharp los quita por defecto
      const buffer = await sharp(bytes, { limitInputPixels: politica.maxPixeles })
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: politica.calidadWebp, effort: 4, smartSubsample: true })
        .toBuffer();
      variantes.push({ ancho: w, buffer, bytes: buffer.length });
    } catch (e) {
      throw new ErrorImagen('archivo_invalido', `No se pudo convertir a WebP: ${e.message}`);
    }
  }
  const mayor = Math.max(...anchos);
  return {
    sha256: hash,
    version: hash.slice(0, 16),
    formato,
    ancho: mayor,
    alto: Math.round((alto * mayor) / ancho),
    bytesOriginal: bytes.length,
    variantes,
  };
};
