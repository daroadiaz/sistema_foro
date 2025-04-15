# Sistema de Foros - Comandos de Despliegue

## Creación de archivos Docker

```bash
# Crear el Dockerfile del backend
touch demo/Dockerfile

# Crear el Dockerfile y nginx.conf del frontend
touch foro-app/Dockerfile
touch foro-app/nginx.conf

# Crear el docker-compose.yml en la raíz
touch docker-compose.yml
```

## Ejecutar el proyecto con Docker Compose

```bash
# Construir y ejecutar todos los contenedores
docker-compose up -d --build

# Ver los logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Ver el estado de los contenedores
docker-compose ps
```

## Gestión de contenedores

```bash
# Detener los contenedores
docker-compose down

# Detener los contenedores y eliminar volúmenes
docker-compose down -v

# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

## Entrar a los contenedores

```bash
# Entrar al contenedor del backend
docker exec -it foro_backend /bin/bash

# Entrar al contenedor del frontend
docker exec -it foro_frontend /bin/sh

# Entrar al contenedor de MySQL
docker exec -it foro_mysql bash
```

## Comandos de MySQL

```bash
# Conectarse a MySQL desde el contenedor
docker exec -it foro_mysql mysql -u root -pFreya-100MTH

# Hacer backup de la base de datos
docker exec foro_mysql mysqldump -u root -pFreya-100MTH new_api > backup.sql

# Restaurar la base de datos desde un backup
cat backup.sql | docker exec -i foro_mysql mysql -u root -pFreya-100MTH new_api
```

## Acceder a la aplicación

```
Frontend: http://localhost
Backend API: http://localhost:8080/api
MySQL: localhost:3306
```

## Detener y limpiar todo el entorno

```bash
# Detener y eliminar contenedores, redes, volúmenes e imágenes
docker-compose down -v --rmi all --remove-orphans
```