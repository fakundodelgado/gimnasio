# Sistema de Gestión de Gimnasio

Aplicación web full-stack para la administración integral de un gimnasio (socios, planes, suscripciones, pagos, entrenadores y reportes en PDF y Excel).

## Tecnologías

* **Backend:** Laravel 11, PHP 8.2+, Spatie Laravel-Permission, DomPDF, Laravel Excel
* **Frontend:** React, TypeScript, Inertia.js, Tailwind CSS
* **Base de datos:** MySQL

## Requisitos previos

* **PHP >= 8.4** (con `curl`, `fileinfo`, `gd`, `intl`, `mbstring`, `openssl`, `pdo_mysql`, `xsl` y `zip` habilitados en `php.ini`)
* **Composer**
* **Node.js y npm**
* **MySQL**

## Instalación y ejecución

1. **Clonar el repositorio, instalar dependencias y preparar el entorno:**
   ```bash
   git clone [https://github.com/fakundodelgado/gimnasio.git](https://github.com/fakundodelgado/gimnasio.git) && cd gimnasio && composer install && npm install && cp .env.example .env && php artisan key:generate
   ```

2. **Configurar la base de datos en `.env`:**
   Con MySQL en ejecución, ajustar estas variables:
   ```env
   APP_URL=http://localhost:8000

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=gimnasio
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Migrar la base de datos, cargar los datos iniciales e iniciar el servidor:**
   ```bash
   php artisan migrate --seed && composer run dev
   ```
   *(Si la base de datos `gimnasio` no existe, crearla previamente).*

4. **Acceder al sistema:**
   Abrir `http://localhost:8000` en el navegador.
