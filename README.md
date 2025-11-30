# 🥏 Simulador de Dinámica de Vuelo del Disco

## 📋 Descripción

Informe integral interactivo que modela matemáticamente, simula computacionalmente y optimiza la dinámica de vuelo de un disco utilizando métodos numéricos avanzados. Desarrollado como parte del curso de **Análisis Numérico 2025-2** en el Politécnico Colombiano Jaime Isaza Cadavid.

Este proyecto implementa una solución completa para visualizar y analizar las fuerzas aerodinámicas que actúan sobre un disco en vuelo, incluyendo sustentación, arrastre, gravedad y efectos del viento.

## ✨ Características Principales

- **Simulación en Tiempo Real**: Visualización animada de la trayectoria del disco con parámetros configurables
- **Método Runge-Kutta (RK4)**: Integración numérica de 4to orden para alta precisión
- **Modelo Aerodinámico Completo**: 
  - Fuerzas de sustentación (lift) y arrastre (drag)
  - Coeficientes aerodinámicos dependientes del ángulo de ataque
  - Modelado de viento y velocidad relativa
- **Optimización Automática**: Cálculo del ángulo óptimo de lanzamiento
- **Visualizaciones Interactivas**:
  - Diagrama de cuerpo libre (DCL)
  - Gráficas de coeficientes aerodinámicos
  - Curvas de optimización
- **Exportación de Datos**: Descarga de resultados en formato CSV
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- **Soporte de Impresión**: Maquetación optimizada para generar informes

## 🚀 Demo

Abre `index.html` directamente en tu navegador moderno (Chrome, Firefox, Edge, Safari).

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados con diseño responsivo
- **JavaScript ES6+**: Módulos y funciones modernas
- **TailwindCSS**: Framework CSS vía CDN
- **Chart.js**: Visualización de gráficas interactivas
- **MathJax**: Renderizado de ecuaciones matemáticas LaTeX
- **Canvas API**: Renderizado 2D de simulaciones

## 📂 Estructura del Proyecto

```
DiscoSimulacion/
│
├── index.html              # Documento HTML principal
├── styles.css              # Estilos personalizados
├── README.md               # Este archivo
├── .gitignore             # Archivos ignorados por Git
│
└── js/
    ├── main.js            # Punto de entrada principal
    ├── ui.js              # Gestión de interfaz de usuario
    ├── physics.js         # Motor de física (RK4, fuerzas)
    ├── draw.js            # Funciones de renderizado en canvas
    ├── optimization.js    # Algoritmo de optimización
    ├── explanation.js     # Diagramas educativos
    └── constants.js       # Constantes físicas y configuración
```

## 🎯 Uso

### Parámetros Configurables

1. **Condiciones Iniciales**:
   - Velocidad inicial (v₀)
   - Ángulo de lanzamiento (θ)
   - Altura de liberación (h₀)

2. **Variables Ambientales**:
   - Velocidad del viento (Wₓ)
   - Densidad del aire (ρ)
   - Gravedad (g)

3. **Propiedades del Disco**:
   - Masa (m)
   - Diámetro (D)
   - Coeficiente de arrastre (Cd)
   - Coeficiente de sustentación (Cl)

### Controles

- **Lanzar Disco**: Ejecuta la simulación con los parámetros actuales
- **Mantener trazos**: Superpone múltiples trayectorias para comparación
- **Limpiar**: Reinicia el canvas
- **Exportar CSV**: Descarga los datos de la simulación

## 📊 Fundamento Matemático

### Ecuaciones de Movimiento

El sistema está gobernado por ecuaciones diferenciales ordinarias (EDO) no lineales:

```
dvₓ/dt = -(ρAv²ᵣₑₗ)/(2m) (Cd cos γ + Cl sin γ)
dvᵧ/dt = -g + (ρAv²ᵣₑₗ)/(2m) (Cl cos γ - Cd sin γ)
```

### Método Numérico

Se utiliza el método de **Runge-Kutta de 4to orden (RK4)** con un error de truncamiento de O(h⁴):

```
y_{i+1} = yᵢ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)
```

### Coeficientes Aerodinámicos

```
Cd(α) = Cd_min + k·α²
Cl(α) = Cl_max·sin(2α)
```

Donde α es el ángulo de ataque: `α = θ_disco(t) - γ(t)`

## 🎓 Aplicaciones Educativas

Este simulador es ideal para:

- Cursos de **Análisis Numérico**
- Asignaturas de **Física Computacional**
- **Mecánica de Fluidos**
- **Biomecánica Deportiva**
- Talleres de **Métodos Numéricos** (EDO, RK4)

## 🔬 Resultados Clave

- El ángulo óptimo de lanzamiento **NO es 45°** debido a la sustentación
- Típicamente se encuentra entre **34° - 38°**
- El viento en contra puede aumentar la distancia total
- Alta sensibilidad a condiciones iniciales

## 📚 Referencias Bibliográficas

1. **Bartlett, R. M. (1992)**. *The biomechanics of the discus throw: A review*. Journal of Sports Sciences.
2. **Chapra, S. C., & Canale, R. P. (2015)**. *Métodos numéricos para ingenieros* (7a ed.). McGraw-Hill.
3. **Hubbard, M. (1989)**. *The throwing events in track and field*. Biomechanics of Sport.
4. **Burden, R. L., & Faires, J. D. (2011)**. *Análisis numérico* (9a ed.). Cengage Learning.
5. **Zill, D. G. (2018)**. *Ecuaciones diferenciales con aplicaciones de modelado*. Cengage Learning.

## 👨‍💻 Autor

**Juan Manuel Peña Usuga**  
Ingeniería Informática (6to Semestre)  
Politécnico Colombiano Jaime Isaza Cadavid  
Turbo, Antioquia

---

## 📄 Licencia

Este proyecto es de uso académico y educativo.

## 🤝 Contribuciones

Las sugerencias y mejoras son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un [issue](../../issues).

---

*Desarrollado con 💙 para el aprendizaje del Análisis Numérico*
