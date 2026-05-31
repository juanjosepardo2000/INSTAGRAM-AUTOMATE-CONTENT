# Aura — Sistema de Diseño

> Un lenguaje visual para respiración, meditación y bienestar.
> Destilado de dos imágenes de referencia: una figura en loto envuelta en un aura de espectro completo, y una silueta sosteniendo un orbe de luz. La esencia: **campos de gradiente suaves, grano de película, formas que brillan en lugar de proyectar sombras, y un ritmo calmado y respirado.**

---

## 1. Principios

1. **La luz, no el borde.** Los elementos emiten resplandor (glow) en vez de proyectar sombras duras. La profundidad nace de halos luminosos y desenfoques de color.
2. **Gradientes como atmósfera.** Ningún fondo es un color plano: siempre es un campo difuminado. El color fluye, nunca se corta.
3. **Grano vivo.** Una textura sutil de ruido (film grain) cubre todo, dándole un acabado analógico y cálido.
4. **Formas blandas.** Radios generosos, siluetas redondeadas, nada anguloso. La geometría imita el cuerpo y el aliento.
5. **Ritmo de respiración.** El movimiento es lento, en bucle, con curvas seno (inhalar/exhalar). Nada brusco.
6. **Espectro completo, baja saturación.** La paleta recorre todo el arcoíris pero siempre en versión pastel y desaturada. Calma, no estridencia.

---

## 2. Color

### 2.1 Espectro Aura
La banda de pastel de espectro completo extraída de la imagen del loto. Es la firma de la marca.

| Token | Hex | Uso |
|---|---|---|
| `--aura-sky` | `#8fcddf` | Cian celeste — frescura, aire |
| `--aura-mint` | `#a6ddd5` | Verde menta — calma, renovación |
| `--aura-sage` | `#bcc4a4` | Salvia — tierra, equilibrio |
| `--aura-gold` | `#f3d49a` | Oro suave — luz, centro |
| `--aura-peach` | `#fbc38c` | Durazno — calidez |
| `--aura-coral` | `#f59f93` | Coral — energía suave |
| `--aura-rose` | `#e7b2ac` | Rosa — ternura |
| `--aura-orchid` | `#c88cb6` | Orquídea — transición |
| `--aura-lavender` | `#beafc2` | Lavanda — quietud |
| `--aura-iris` | `#9d7cc4` | Iris — introspección |
| `--aura-indigo` | `#7477c3` | Índigo — profundidad |
| `--aura-steel` | `#6797bc` | Azul acero — claridad |

### 2.2 Base y semántica

| Token | Hex | Uso |
|---|---|---|
| `--mist` | `#faf6f1` | Fondo base, blanco cálido |
| `--dawn` | `#fed0bf` | Campo durazno de firma (fondo del orbe) |
| `--dusk-coral` | `#fb9095` | Acento coral cálido |
| `--ink` | `#2f2c49` | Texto principal (índigo profundo) |
| `--ink-soft` | `#6f6a89` | Texto secundario |
| `--ink-faint` | `#a8a4bd` | Texto terciario, deshabilitado |
| `--glow-mint` | `#c8f0d8` | Resplandor del orbe, estados de éxito |
| `--glow-warm` | `#fff4e2` | Núcleo de luz cálida |
| `--line` | `rgba(47,44,73,0.12)` | Bordes, divisores |

> **Nota de accesibilidad:** los pasteles son de bajo contraste por naturaleza. Para texto, usa siempre `--ink` (≈ AA sobre `--mist` y `--dawn`). Nunca pongas texto de cuerpo directamente sobre el espectro; usa una superficie con velo (`--surface-veil`) por debajo.

### 2.3 Superficies con velo (glass)

| Token | Valor |
|---|---|
| `--surface-veil` | `rgba(255, 252, 248, 0.55)` |
| `--surface-veil-strong` | `rgba(255, 252, 248, 0.78)` |
| `--surface-blur` | `blur(20px)` |

---

## 3. Gradientes

Los gradientes son el corazón del sistema. Cuatro mezclas firmadas:

```css
/* Aura — el espectro vertical completo (imagen del loto) */
--grad-aura: linear-gradient(
  180deg,
  #8fcddf 0%,
  #a6ddd5 16%,
  #f3d49a 36%,
  #c6d1c3 52%,
  #fcca8b 70%,
  #fdb881 86%,
  #b1cda5 100%
);

/* Dawn — el campo durazno cálido (fondo del orbe) */
--grad-dawn: radial-gradient(
  120% 90% at 50% 35%,
  #ffd9c6 0%,
  #fed0bf 45%,
  #fb9095 100%
);

/* Figure — la silueta azul/violeta */
--grad-figure: linear-gradient(180deg, #9d7cc4 0%, #7477c3 55%, #6797bc 100%);

/* Orb — el resplandor radial de menta */
--grad-orb: radial-gradient(
  circle at 50% 50%,
  #eafff1 0%,
  #c8f0d8 50%,
  rgba(200, 240, 216, 0) 75%
);
```

---

## 4. Tipografía

Pareja de display con carácter orgánico + cuerpo humanista y calmado.

| Rol | Familia | Pesos |
|---|---|---|
| Display | **Fraunces** (serif óptica, suave) | 300, 400, 500 |
| Cuerpo / UI | **Hanken Grotesk** (sans humanista) | 400, 500, 600 |

```css
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Hanken Grotesk', system-ui, sans-serif;
```

### Escala (ratio ≈ 1.25)

| Token | Tamaño | Línea | Uso |
|---|---|---|---|
| `--text-display-xl` | 4.5rem (72px) | 1.05 | Héroe |
| `--text-display` | 3rem (48px) | 1.1 | Títulos de sección |
| `--text-h1` | 2.25rem (36px) | 1.15 | |
| `--text-h2` | 1.625rem (26px) | 1.2 | |
| `--text-h3` | 1.25rem (20px) | 1.3 | |
| `--text-body-lg` | 1.125rem (18px) | 1.6 | Intros |
| `--text-body` | 1rem (16px) | 1.6 | Base |
| `--text-sm` | 0.875rem (14px) | 1.5 | |
| `--text-caption` | 0.75rem (12px) | 1.4 | Etiquetas |

**Detalles:** Display con `letter-spacing: -0.02em` y peso ligero (300–400) para sensación etérea. Eyebrows/etiquetas en mayúsculas con `letter-spacing: 0.18em`.

---

## 5. Espaciado

Escala de base 4px.

```
--space-1: 4px    --space-5: 24px   --space-9: 96px
--space-2: 8px    --space-6: 32px   --space-10: 128px
--space-3: 12px   --space-7: 48px
--space-4: 16px   --space-8: 64px
```

---

## 6. Radios

Formas blandas y redondeadas. Por defecto, generoso.

```
--radius-sm: 14px    --radius-lg: 34px
--radius-md: 22px    --radius-xl: 48px
--radius-pill: 999px
```

---

## 7. Resplandor y elevación

En lugar de sombras grises, **halos de color**. La elevación se mide en luz.

```css
--glow-1: 0 4px 24px rgba(116, 119, 195, 0.12);          /* sutil */
--glow-2: 0 12px 48px -8px rgba(247, 159, 147, 0.28);     /* tarjeta */
--glow-3: 0 24px 64px -16px rgba(47, 44, 73, 0.20);       /* flotante */
--glow-orb: 0 0 64px 8px rgba(200, 240, 216, 0.65);       /* luminoso */
--glow-focus: 0 0 0 4px rgba(157, 124, 196, 0.35);        /* foco */
```

---

## 8. Movimiento

Ritmo de respiración: lento, en bucle, curvas seno.

```css
--ease-breath: cubic-bezier(0.37, 0, 0.63, 1);  /* inhalar/exhalar */
--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
--dur-quick: 280ms;
--dur-base: 520ms;
--dur-slow: 900ms;
--breath-cycle: 7s;   /* ciclo de pulso respiratorio */
```

Animación firma — **respiración**: escala 1 → 1.06 y opacidad de glow oscilando en `--breath-cycle`, en bucle infinito con `--ease-breath`.

---

## 9. Grano / Textura

Capa de ruido SVG sobre todo el lienzo. Acabado analógico cálido.

```css
/* feTurbulence: baseFrequency 0.9, 4 octavas */
opacity: 0.06;
mix-blend-mode: overlay;
pointer-events: none;
position: fixed; inset: 0;
```

---

## 10. Componentes (lineamientos)

- **Botón primario:** relleno `--grad-figure` o `--ink`, texto claro, `--radius-pill`, `--glow-1`; al pasar el cursor, intensifica el glow y eleva 2px.
- **Botón fantasma:** borde `--line`, texto `--ink`, fondo `--surface-veil` con `--surface-blur`.
- **Tarjeta:** superficie con velo sobre un campo de gradiente, `--radius-lg`, `--glow-2`, borde de 1px en `--surface-veil-strong`.
- **Badge / etiqueta:** mayúsculas, `--text-caption`, `--radius-pill`, relleno tenue del espectro.
- **Input:** fondo `--surface-veil`, borde `--line`, foco con `--glow-focus`.
- **Orbe de respiración:** `--grad-orb` + `--glow-orb`, animación de respiración. El elemento emblema para CTAs y estados de carga/meditación.

---

*Sistema de diseño Aura · v1.0 · derivado de la dirección visual de las imágenes de referencia.*
