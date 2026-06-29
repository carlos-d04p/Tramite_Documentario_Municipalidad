# Sistema de Gestión Documental y Control de Correspondencia - Municipalidad de La Victoria

Este sistema ha sido diseñado para la gestión y seguimiento del flujo de correspondencia interna y externa de la Municipalidad de La Victoria.

## Requisitos del Servidor (Producción con Docker)

* Servidor con Debian 11/12 (o máquina virtual equivalente)
* Docker Engine v20.10+
* Docker Compose v1.29.2+
* Git

---

## Puesta en Producción mediante Docker (Servidor Debian + Apache2)

Sigue estos pasos detallados para instalar y configurar el sistema utilizando Docker y el servidor web Apache2 en una máquina virtual con Debian:

### 1. Clonar el repositorio con sus submódulos
Dado que la infraestructura de contenedores (**Laradock**) está configurada como un submódulo de Git, es indispensable clonar el repositorio descargando sus submódulos:

```bash
git clone --recurse-submodules --remote-submodules https://github.com/tu-usuario/correspondencia.git
cd correspondencia
```

*Si ya habías clonado el repositorio sin submódulos, inicialízalos ejecutando:*
```bash
git submodule update --init --recursive
```

### 2. Configurar las Variables de Entorno del Proyecto
Crea el archivo `.env` para Laravel en el directorio raíz usando como plantilla el archivo preparado para Docker:

```bash
cp .env.docker.example .env
```

Edita el archivo `.env` recién creado:
* Define `APP_URL` con la IP pública o el nombre de dominio de tu máquina virtual Debian (ej. `APP_URL=http://192.168.1.100` o `http://tramite.lavictoria.gob.pe`).
* Define `SESSION_DOMAIN` y `SANCTUM_STATEFUL_DOMAINS` con el mismo dominio o IP sin el protocolo (ej. `192.168.1.100` o `tramite.lavictoria.gob.pe`).
* Modifica la variable `MIX_MQTT_HOST` para que apunte a la misma IP o dominio de tu servidor (esto es vital para que las notificaciones WebSocket de las derivaciones funcionen en el navegador).

### 3. Configurar Laradock para Producción con Apache
Copia los archivos de configuración pre-establecidos para Docker hacia el submódulo `laradock`:

```bash
cp docker/.env.example laradock/.env
cp docker/docker-compose.yml laradock/docker-compose.yml
cp docker/mosquitto.conf laradock/mosquitto/
```

Edita el archivo de configuración de Laradock `laradock/.env`:
* Verifica que `APP_CODE_PATH_HOST=../` apunte correctamente al directorio raíz del proyecto.
* Configura la contraseña y el usuario de la base de datos de ser necesario (por defecto están configurados como `admin` / `admin` para MariaDB).

### 4. Configurar las credenciales iniciales de Administrador
Crea el archivo de configuración para el usuario administrador inicial:

```bash
cp admin_data.json.example storage/app/admin_data.json
```
Abre `storage/app/admin_data.json` y edita los campos del usuario inicial (nombre, email, usuario y contraseña) para el administrador del sistema.

### 5. Construir y levantar los contenedores con Apache2
Accede a la carpeta de Laradock y levanta los servicios utilizando **Apache2** como servidor web (en lugar de Nginx), junto con la base de datos MariaDB, el Workspace, Mosquitto Broker y PHP-FPM:

```bash
cd laradock
docker-compose build --parallel apache2 php-fpm workspace mariadb mosquitto
docker-compose up -d apache2 php-fpm workspace mariadb mosquitto
```

Verifica que todos los contenedores estén corriendo con:
```bash
docker-compose ps
```

### 6. Instalar dependencias e inicializar el sistema
Ejecuta los comandos de inicialización dentro del contenedor de `workspace`:

```bash
# Entrar al contenedor de workspace
docker-compose exec --user=laradock workspace bash

# Instalar dependencias de PHP y generar la llave de la aplicación
composer install --ignore-platform-reqs
php artisan key:generate

# Instalar dependencias de Node y compilar recursos frontend para producción
yarn install
yarn prod

# Ejecutar las migraciones y seeders de la base de datos
php artisan migrate --force
php artisan db:seed --class=DatabaseSeeder

# Parchear el cargador de PDFs (para imágenes base64 de los reportes)
exit
cd ..
cp docker/Cpdf.php vendor/dompdf/dompdf/lib/Cpdf.php
```

### 7. Comprobación y Cortafuegos
Una vez completado todo, la aplicación estará disponible en el puerto `80` (HTTP) y `443` (HTTPS) a través de la IP de la máquina virtual.
Asegúrate de que tu máquina virtual Debian tenga abiertos los siguientes puertos en su firewall (UFW o iptables):
* **80 / 443**: Para el tráfico web de la aplicación (Apache).
* **9001**: Para la conexión de WebSockets de notificaciones (Mosquitto WS).


---

## ⚖️ Créditos y Licencia

> 💡 **Nota de Autoría y Modificación:** > Este sistema es una versión **modificada, personalizada y adaptada** por **Carlos** (@carlos-d04p) para optimizar el **Trámite Documentario de la Municipalidad V**.

* **Proyecto Original:** El software base y su estructura inicial fueron desarrollados originalmente por `Daniel Jimenez Jerez - djimenezjerez`.
* **Licencia:** Al ser un derivado de un proyecto de código abierto, este sistema se distribuye bajo la licencia **GNU General Public License v3 (GPL v3)**. Puedes consultar los términos completos en el archivo `LICENSE` incluido en este repositorio.

---