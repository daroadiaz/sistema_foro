# Sistema de Foro Online - Guía de Despliegue con Docker

Este documento contiene instrucciones para compilar, desplegar y gestionar la aplicación de Foro Online utilizando Docker.

## Requisitos previos

- Docker y Docker Compose instalados
- MySQL corriendo en el puerto 3306
- Puertos 80 y 8080 disponibles

## Comandos básicos

### Compilar y desplegar la aplicación

Para compilar y desplegar el frontend y el backend simultáneamente:

```bash
docker-compose up -d --build
```

### Ver los logs en tiempo real

Para monitorear los logs de ambos servicios:

```bash
docker-compose logs -f
```

Para ver los logs de un servicio específico:

```bash
# Para el backend
docker-compose logs -f backend

# Para el frontend
docker-compose logs -f frontend
```

### Detener los servicios

Para detener y eliminar los contenedores:

```bash
docker-compose down
```

Para detener, eliminar los contenedores y eliminar los volúmenes:

```bash
docker-compose down -v
```

### Reiniciar los servicios

Para reiniciar los servicios sin reconstruir las imágenes:

```bash
docker-compose restart
```

## Acceso a la aplicación

El frontend está disponible en:

```
http://localhost
```

El backend (API) está disponible en:

```
http://localhost:8080/api
```

## Estructura de la aplicación

- **Frontend**: Aplicación Angular servida por Nginx en el puerto 80
- **Backend**: API REST con Spring Boot en el puerto 8080
- **Base de datos**: MySQL en el puerto 3306 (host local)

## Notas

- La aplicación utiliza `host.docker.internal` para conectarse a la base de datos local
- Los cambios en el código requieren reconstruir las imágenes con `docker-compose up -d --build`
- Para desarrollo se puede usar un enfoque de volúmenes montados para evitar reconstruir las imágenes en cada cambio

## Solución de problemas

Si experimentas problemas de CORS, asegúrate de que la configuración de CORS en el backend y el archivo nginx.conf del frontend sean correctos.