# Sistema de Gestión de Gimnasio

Aplicación web full-stack para la administración integral de un gimnasio (clientes, empleados, planes, suscripciones, pagos, asignación de entrenadores y reportes en PDF y Excel).

## Tecnologías

* **Backend:** Laravel 13, PHP 8.3+, Spatie Laravel-Permission, DomPDF, Laravel Excel
* **Frontend:** React, TypeScript, Inertia.js, Tailwind CSS
* **Base de datos:** MySQL

## Requisitos previos

* **PHP >= 8.3** (con `curl`, `fileinfo`, `gd`, `intl`, `mbstring`, `openssl`, `pdo_mysql`, `xsl` y `zip` habilitados en `php.ini`)
* **Composer**
* **Node.js y npm**
* **MySQL**
* **Cuenta gratuita en [Mailtrap](https://mailtrap.io/)** (para pruebas de envío de correos)

## Instalación y ejecución

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/fakundodelgado/gimnasio.git
cd gimnasio
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### 2. Configurar la base de datos y el correo en `.env`
Con MySQL en ejecución, abrir el archivo `.env` y configurar la conexión a la base de datos y las credenciales SMTP de tu bandeja (*Email Testing / Sandbox*) en **Mailtrap**:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gimnasio
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_usuario_mailtrap
MAIL_PASSWORD=tu_password_mailtrap
MAIL_FROM_ADDRESS="no-reply@gimnasio.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Crear las tablas y cargar los datos iniciales
```bash
php artisan migrate --seed
```
*(Si la base de datos `gimnasio` aún no existe, crear una previamente).*

### 4. Levantar el proyecto

```bash
composer run dev
```

### 5. Acceder al sistema
Abrir `http://localhost:8000` en el navegador.
