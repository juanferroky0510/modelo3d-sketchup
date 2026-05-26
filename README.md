# Visualización de Modelo 3D VR con Three.js

Proyecto web para visualizar modelos `.glb` en realidad virtual utilizando:

- Three.js
- WebVR móvil
- Gafas VR tipo Shinecon G10
- Control Xbox Series
- Bootstrap 5

El proyecto permite:

- Visualizar modelos 3D en formato GLB
- Movimiento inmersivo con control Xbox
- Seguimiento de movimiento con giroscopio del celular
- Vista VR dividida para gafas móviles
- Navegación dentro del escenario

---

# Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Three.js
- StereoEffect
- GLTFLoader

---

# Requisitos

## Navegador compatible

Se recomienda:

- Google Chrome Android
- Microsoft Edge Android

---

## Dispositivos compatibles

- Celulares Android con giroscopio
- Gafas VR móviles:
  - Shinecon G10
  - VR Box
  - similares
- Control Xbox Series Bluetooth

---

# Estructura del proyecto

```plaintext
proyecto-vr/
│
├── index.html
│
├── models/
│   └── aula_y8.glb
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   └── imagenes/
│       └── favicon.png
```

---

# Formato recomendado para modelos

El formato recomendado es:

```plaintext
.glb
```

Ventajas:

- Más ligero
- Compatible con Three.js
- Incluye:
  - materiales
  - texturas
  - geometría
  - iluminación

---

# Exportar desde SketchUp

Se recomienda exportar desde:

- SketchUp → `.fbx`
- Convertir a `.glb` usando:
  - Blender
  - FBX2glTF
  - glTF Transform

---

# Librerías utilizadas

El proyecto utiliza CDN oficiales:

```html
<script type="importmap">
{
    "imports": {
        "three":
        "https://unpkg.com/three@0.179.1/build/three.module.js",

        "three/addons/":
        "https://unpkg.com/three@0.179.1/examples/jsm/"
    }
}
</script>
```

---

# Características VR

## Movimiento de cabeza

Se utiliza:

```javascript
deviceorientation
```

para detectar:

- izquierda/derecha
- arriba/abajo

mediante el giroscopio del teléfono.

---

## Movimiento en el escenario

Compatible con:

- Xbox Series Controller
- Gamepads Bluetooth

### Controles

| Acción | Control |
|---|---|
| Avanzar | Joystick izquierdo arriba |
| Retroceder | Joystick izquierdo abajo |
| Izquierda | Joystick izquierdo izquierda |
| Derecha | Joystick izquierdo derecha |

---

# Problemas comunes

## El modelo no carga

Verificar:

- ruta correcta
- nombre exacto
- extensión `.glb`

---

## Sensores no funcionan

En iPhone:

- es necesario otorgar permisos al giroscopio.

---

# Autor

## Juan Fernando Ortega Olvera

Proyecto académico de visualización VR utilizando Three.js y WebXR móvil.

---

# Futuras mejoras

- Teletransportación
- Colisiones
- Minimap
- Menú VR
- Audio espacial
- Iluminación HDRI
- Multijugador
- Soporte Meta Quest

---

# Licencia

Proyecto educativo y de demostración.