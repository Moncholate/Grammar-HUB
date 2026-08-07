# Generador de los dos dinosaurios de la analogía

`node final.mjs` (necesita `npm i @resvg/resvg-js`) → `out-grande.svg`, `out-chico.svg`
y `final.png` con la maqueta de las dos tarjetas. Copiar los SVG a `public/`.

- `render.mjs` — el renderizador de piezas, extraído del generador de los logos:
  grilla al stud, proyección 2.5D, studs cilíndricos. **Es el mismo** que hizo
  las letras, para que el lenguaje visual no sea solo "parecido".
- `piezas.mjs` — las dos figuras. El T-rex no se coloca pieza por pieza: se
  dibuja la silueta por tramos y un tejedor la parte en ladrillos de 1-4 studs
  con las juntas escalonadas.

## Lo que es fácil romper

- **Los dos van al MISMO `S`** (tamaño de stud). Si se generan a escalas
  distintas dejan de parecer del mismo juego de piezas.
- **`final.mjs` imprime el porcentaje** con que hay que mostrar al pequeño en la
  tarjeta (hoy 42,2 %). Está escrito a mano en `BrickAnalogy.jsx`: si se
  regeneran las figuras y cambia el alto del lienzo, **hay que actualizarlo**.
  Con `object-contain` en cajas iguales el T-rex se encoge y termina viéndose
  más chico que el pequeño — el mensaje al revés.
- **Profundidad de la pata lejana: va en la ALTURA**, no en el costado. Lo que
  está al fondo se apoya más arriba. De lado solo se ve más largo.
- Un SVG generado **no se puede juzgar sin mirarlo**: rasterizar y abrir el PNG.
