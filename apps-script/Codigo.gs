/**
 * Recibe las confirmaciones de la invitación y las guarda en la hoja de cálculo.
 *
 * Cómo se instala (5 minutos, ver README.md para el detalle):
 *   1. Crea una hoja nueva en Google Sheets.
 *   2. Extensiones ▸ Apps Script, borra todo y pega este archivo.
 *   3. Implementar ▸ Nueva implementación ▸ Aplicación web.
 *        Ejecutar como:      Yo
 *        Quién tiene acceso: Cualquier usuario
 *   4. Copia la URL que termina en /exec y pégala en CONFIG.scriptUrl
 *      dentro de index.html.
 *
 * Importante: cada vez que edites este archivo tienes que volver a
 * "Implementar ▸ Administrar implementaciones ▸ editar ▸ Nueva versión",
 * si no, la web seguirá usando la versión vieja.
 */

const ENCABEZADOS = ['Fecha', 'Nombre', 'Asiste', 'Acompañantes', 'Total personas', 'Mensaje'];

/**
 * Punto de entrada: la invitación manda aquí cada confirmación.
 */
function doPost(e) {
  // Un candado evita que dos personas confirmando al mismo tiempo
  // se pisen la fila y se pierda una respuesta.
  const candado = LockService.getScriptLock();
  candado.waitLock(30000);

  try {
    const hoja = obtenerHoja();
    const datos = (e && e.parameter) || {};

    hoja.appendRow([
      datos.fecha || new Date().toLocaleString('es-CR'),
      datos.nombre || '(sin nombre)',
      datos.asistencia || '',
      Number(datos.acompanantes) || 0,
      Number(datos.total) || 0,
      datos.mensaje || '',
    ]);

    return respuesta({ ok: true });

  } catch (error) {
    // Queda registrado en Apps Script ▸ Ejecuciones por si algo falla.
    console.error(error);
    return respuesta({ ok: false, error: String(error) });

  } finally {
    candado.releaseLock();
  }
}

/**
 * Abrir la URL en el navegador sirve para comprobar que quedó publicada.
 */
function doGet() {
  return respuesta({ ok: true, mensaje: 'El registro de confirmaciones está activo.' });
}

/**
 * Devuelve la hoja "Confirmaciones", creándola con encabezados la primera vez.
 */
function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName('Confirmaciones');

  if (!hoja) {
    hoja = libro.insertSheet('Confirmaciones');
    hoja.appendRow(ENCABEZADOS);
    hoja.getRange(1, 1, 1, ENCABEZADOS.length)
        .setFontWeight('bold')
        .setBackground('#FFCD11');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(1, 160); // Fecha
    hoja.setColumnWidth(2, 200); // Nombre
    hoja.setColumnWidth(6, 320); // Mensaje
  }

  return hoja;
}

function respuesta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Opcional: ejecuta esta función una vez desde el editor para recibir
 * un correo cada vez que alguien confirme. Requiere autorizar el permiso.
 */
function activarAvisoPorCorreo() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('avisarNuevaConfirmacion')
    .forSpreadsheet(libro)
    .onChange()
    .create();
}

function avisarNuevaConfirmacion() {
  const hoja = obtenerHoja();
  const ultima = hoja.getLastRow();
  if (ultima < 2) return;

  const fila = hoja.getRange(ultima, 1, 1, ENCABEZADOS.length).getValues()[0];

  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: '🎉 Nueva confirmación: ' + fila[1],
    body: [
      'Nombre:       ' + fila[1],
      'Asiste:       ' + fila[2],
      'Acompañantes: ' + fila[3],
      'Total:        ' + fila[4],
      'Mensaje:      ' + (fila[5] || '—'),
      '',
      'Ver todas: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    ].join('\n'),
  });
}
