# 🚧 Invitación de cumpleaños — Thiago cumple 3

Invitación web interactiva con temática de construcción (amarillo/negro estilo CAT).
Un solo archivo HTML, sin instalar nada, lista para GitHub Pages.

---

## 1. Pon tus datos

Abre `index.html` y busca el bloque `CONFIG` (casi al final, está marcado con ⚙️).
Cambia solo esos valores:

| Campo | Qué poner |
|---|---|
| `nombre`, `edad` | Nombre del cumpleañero y años que cumple |
| `fechaISO` | Fecha y hora reales, formato `'2026-09-12T15:00:00'` (reloj de 24 h). Esto alimenta la cuenta regresiva |
| `fechaTexto`, `horaTexto` | Cómo se lee en pantalla, escrito bonito |
| `lugar`, `direccion` | Nombre del lugar y zona |
| `wazeUrl` | Enlace de Waze (botón principal). Si lo dejas vacío, ese botón desaparece solo |
| `mapaUrl` | Enlace de Google Maps. Si lo dejas vacío, el botón busca la dirección automáticamente |
| `nota` | El aviso del recuadro naranja |
| `whatsapp` | Tu número **con código de país, sin `+` ni espacios**. Ej. Costa Rica `50663940021` |
| `anfitrion` | El nombre con el que arranca el mensaje: "Hola **Andre**, soy…" |
| `fotoPrincipal` | La del círculo de la portada. Debe ser **cuadrada** con la cara centrada |
| `fotoDestacada` | La grande de más abajo. Vertical se ve mejor |
| `scriptUrl` | La URL del paso 3. Déjala vacía por ahora |

## 2. Las fotos

Ya están listas en `fotos/`:

| Archivo | Dónde sale | Tamaño |
|---|---|---|
| `hero.jpg` | Círculo de la portada (800×800) | 180 KB |
| `thiago.jpg` | Foto grande de "El jefe de obra" (900×1350) | 300 KB |

Los PNG originales quedaron guardados en `fotos/originales/` por si algún día
los necesitas. **No se descargan** cuando alguien abre la invitación (solo se
baja lo que la página usa), así que puedes dejarlos o borrarlos sin problema.

### Si quieres cambiar una foto

Los PNG de cámara pesan 2-3 MB y tardan mucho en datos móviles. Comprímelos así
(ya viene incluido en cualquier Mac):

```bash
sips -c 941 941 nueva.png --out /tmp/a.png && sips -Z 800 /tmp/a.png --out /tmp/b.png && sips -s format jpeg -s formatOptions 78 /tmp/b.png --out fotos/hero.jpg
```

El `-c 941 941` recorta un cuadrado centrado (pon el ancho de tu foto en ambos
números), el `-Z 800` la reduce a 800 px y el último paso la pasa a JPEG.
Para la foto vertical sáltate el recorte y usa `-Z 1350`.

> Si falta una foto, la página muestra un cartel de 🚧 en su lugar; no se rompe.

## 3. Cómo funciona la confirmación

Hay **dos cosas que pasan a la vez** cuando alguien toca "Confirmar por WhatsApp":

1. **WhatsApp se abre** con el mensaje ya redactado. El invitado solo da enviar.
   Este es el canal principal: tú recibes cada confirmación en tu chat.
2. **En segundo plano**, la respuesta se guarda en tu Google Sheet, sin que el
   invitado tenga que hacer nada. Esa lista la ves solo tú.

El formulario pide **nombre y apellidos**, tanto de quien confirma como de
cada acompañante (uno por casilla), para que la lista quede ordenada.

Los mensajes quedan así:

> Hola Andre, soy Marcela Villalobos Rojas y te confirmo que voy a ir a la fiesta de Thiago!
> Voy solo/a.

> Hola Andre, soy Marcela Villalobos Rojas y te confirmo que voy a ir a la fiesta de Thiago!
> Vamos 3 personas. Me acompañan: Juan Pérez Mora y Ana Pérez Villalobos.

> Hola Andre, soy Marcela Villalobos Rojas y lamentablemente no voy a poder ir a la fiesta de Thiago.

**No pongas emoji en estos mensajes.** Viven fuera del plano básico de Unicode
(arriba de U+FFFF) y varios clientes de WhatsApp los muestran como `?` al
recibirlos por el parámetro `text=` de un enlace. Las tildes y la ñ sí van bien.

### Activar el guardado en Google Sheets

El paso 2 solo funciona si configuras esto. **Sin esto la invitación igual
sirve** —los WhatsApp te llegan— pero no tendrás la lista automática.

1. Entra a [sheets.new](https://sheets.new) y crea una hoja. Ponle nombre, por ejemplo *Confirmaciones cumple Thiago*.
2. Menú **Extensiones ▸ Apps Script**.
3. Borra todo lo que aparezca y pega el contenido de [`apps-script/Codigo.gs`](apps-script/Codigo.gs). Guarda (💾).
4. Botón azul **Implementar ▸ Nueva implementación**.
   - Engrane ⚙️ junto a "Tipo" ▸ **Aplicación web**
   - **Ejecutar como:** Yo (tu correo)
   - **Quién tiene acceso:** **Cualquier usuario** ← importante, si no, nadie podrá confirmar
   - **Implementar**
5. Google te pedirá autorizar. Sale un aviso de "app no verificada": es tu propio script, entra en **Configuración avanzada ▸ Ir a (nombre del proyecto)** y acepta.
6. Copia la **URL de la aplicación web** (termina en `/exec`) y pégala en `CONFIG.scriptUrl` dentro de `index.html`.

**Comprobación rápida:** abre esa URL en el navegador. Debe responder
`{"ok":true,"mensaje":"El registro de confirmaciones está activo."}`.

¿Quieres además un correo por cada confirmación? En el editor de Apps Script
selecciona la función `activarAvisoPorCorreo` y dale ▶️ Ejecutar. Una sola vez.

> Si dejas `scriptUrl` vacío, la invitación **sigue funcionando** igual: los
> WhatsApp te llegan normal. Solo que llevas la lista a mano desde el chat.

## 4. Publicar los cambios

El repositorio ya está conectado a
[Je4nCa/thiago-invitacion-cumple](https://github.com/Je4nCa/thiago-invitacion-cumple)
y GitHub Pages ya está activo. El enlace para compartir es:

**https://je4nca.github.io/thiago-invitacion-cumple/**

Cada vez que edites algo, para que se vea en línea:

```bash
cd /Users/jeanvillamonte/Documents/thiago-invitacion && git add . && git commit -m "Actualizo la invitación" && git push
```

Tarda entre 30 segundos y 2 minutos en actualizarse. Si no ves el cambio,
recarga con la caché limpia (⌘+Shift+R).

### Sobre la privacidad

El repositorio es **público** (GitHub Pages gratis lo requiere), así que la
invitación —con las fotos, la dirección y la hora— es accesible para cualquiera
que tenga el enlace.

Ya le puse dos protecciones para que **no aparezca en Google**: la etiqueta
`noindex` en `index.html` y el archivo `robots.txt`. Eso evita que la encuentren
buscando, pero no la esconde de quien reciba el link.

Si prefieres que ni siquiera eso sea posible, las alternativas son borrar el
repositorio después de la fiesta, o pasar el repo a privado (GitHub Pages con
repositorio privado requiere cuenta de pago).

---

## Cómo revisar las confirmaciones

Abre tu hoja de Google. Cada confirmación es una fila:

| Columna | Contenido |
|---|---|
| A · Fecha | Cuándo confirmaron |
| B · Nombre | Nombre y apellidos de quien confirma |
| C · Asiste | Sí / No |
| D · Acompañantes | Cuántos trae |
| E · Nombres de acompañantes | Uno por línea, con apellidos |
| F · Total personas | Quien confirma + sus acompañantes |

Para el gran total de invitados, pon esto en una celda vacía:

```
=SUMAR.SI(C:C;"Sí";F:F)
```

Y si quieres la lista completa de nombres, de una sola persona por fila:

```
=DIVIDIR.TEXTO(TEXTOUNIR(CARÁCTER(10);VERDADERO;FILTRAR(B:B;C:C="Sí");FILTRAR(E:E;C:C="Sí"));CARÁCTER(10))
```

---

## Notas

- **Un solo archivo.** Todo el diseño y la lógica están en `index.html`. No hay compilación ni dependencias que instalar.
- **Pensada para todas las edades.** Texto de 18px, botones grandes, alto contraste, funciona con teclado y lector de pantalla, y respeta `prefers-reduced-motion` para quien no quiere animaciones.
- **Móvil primero.** La mayoría la va a abrir desde WhatsApp en el teléfono.
- **Repetir el envío.** Si alguien confirma dos veces, salen dos filas. Se limpia a mano en la hoja; para 40 invitados no vale la pena complicarlo.
- **Acompañantes.** Se pide el nombre completo de cada uno, en su propia casilla. Si alguien deja una casilla en blanco, el formulario avisa en vez de descartarla en silencio. Tope de 15; más que eso, la invitación pide que te escriban directo.

### Ver la invitación en tu computadora antes de publicar

```bash
cd /Users/jeanvillamonte/Documents/thiago-invitacion && python3 -m http.server 4173
```

Luego abre `http://localhost:4173` en el navegador. Ctrl+C para detenerlo.
