# 📊 Visualizador de Actividad de GitHub

Una aplicación web interactiva diseñada para explorar perfiles de GitHub, analizar repositorios y visualizar tendencias de lenguajes de programación mediante el consumo eficiente de la API pública de GitHub.

## ✨ Características Principales

* **Búsqueda de Perfiles:** Exploración de usuarios de GitHub mostrando sus estadísticas principales (seguidores, repositorios públicos, avatar).
* **Procesamiento ETL (Extract, Transform, Load):** Extracción de grandes volúmenes de datos JSON, transformación de la información y filtrado lógico para extraer el "Top 5" de repositorios con más estrellas.
* **Visualización de Datos:** Representación gráfica de los lenguajes de programación más utilizados por el usuario mediante gráficos de barras interactivos.
* **Optimización y Caché:** Implementación de un sistema de almacenamiento temporal (`sessionStorage`) para minimizar las peticiones redundantes a la API de GitHub, mejorando los tiempos de carga y evitando agotar los límites de la API.

## 🛠️ Tecnologías y Herramientas

* **Frontend:** React, TypeScript, Vite
* **Visualización:** Recharts
* **Gestión de estado y peticiones:** React Hooks (`useState`, `useEffect`), Fetch API
* **Arquitectura:** Estructura preparada en subcarpetas para escalabilidad futura (ej. integración de un backend propio).

## 📂 Estructura del Proyecto

El proyecto está organizado en un formato monorepo para facilitar la separación de responsabilidades:

```text
github-visualizer/
├── frontend/          # Aplicación cliente construida con React y TypeScript
│   ├── src/
│   │   ├── services/  # Lógica de consumo de API y caché (githubService.ts)
│   │   ├── App.tsx    # Componente principal e interfaz de usuario
│   │   └── ...
│   └── package.json
└── README.md
