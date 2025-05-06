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



## Análisis con SonarQube

### 1. Desplegar SonarQube con Docker
```bash
# Iniciar SonarQube en modo standalone
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
```

### 2. Configurar el proyecto para SonarQube
Crea un archivo `sonar-project.properties` en la raíz del proyecto Angular:

```properties
sonar.projectKey=foro-app
sonar.projectName=Foro Online Frontend
sonar.projectVersion=1.0.0

sonar.sources=src
sonar.exclusions=node_modules/**,**/*.spec.ts,src/environments/**,src/assets/**
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts

sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.sourceEncoding=UTF-8
```

### 3. Configurar scripts para el análisis
Edita tu `package.json` para añadir los siguientes scripts:

```json
"scripts": {
  "test:coverage": "set NODE_OPTIONS=--openssl-legacy-provider && ng test --no-watch --code-coverage --browsers=ChromeHeadless",
  "sonar": "sonar-scanner"
}
```

### 4. Ejecutar las pruebas unitarias con cobertura
```bash
cd foro-app
npm run test:coverage
```

### 5. Crear archivo de análisis SonarQube
Crea un archivo `sonar-analysis.bat` en la raíz del proyecto Angular con el siguiente contenido:

```batch
@echo off
echo ===== Ejecutando análisis de SonarQube =====
docker run --rm -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.projectKey=foro-app -Dsonar.projectName="Foro Online Frontend" -Dsonar.sources=src -Dsonar.tests=src -Dsonar.test.inclusions=**/*.spec.ts -Dsonar.exclusions=node_modules/**,**/*.spec.ts,src/environments/**,src/assets/** -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info -Dsonar.host.url=http://localhost:9000 -Dsonar.login=admin -Dsonar.password=admin
echo ===== Análisis completado =====
```

> **Nota**: Para Linux/Mac, crea un archivo `sonar-analysis.sh`:

### 6. Ejecutar el análisis SonarQube
```bash
# Desde la carpeta raíz del proyecto Angular
cd foro-app
.\sonar-analysis.bat
```

### 7. Acceder a los resultados
Una vez finalizado el análisis, accede a la interfaz web de SonarQube:
```
http://localhost:9000
```

Credenciales por defecto:
- Usuario: admin
- Contraseña: admin (cambia esto después del primer inicio de sesión)

### Solución de problemas comunes

#### Error de OpenSSL en Node.js
Si encuentras un error similar a `error:0308010C:digital envelope routines::unsupported`, añade la siguiente variable de entorno antes de ejecutar los comandos:

```bash
# En Windows
set NODE_OPTIONS=--openssl-legacy-provider

# En Linux/Mac
export NODE_OPTIONS=--openssl-legacy-provider
```

#### Error de red entre contenedores Docker
Si SonarScanner no puede conectarse a SonarQube con el error "Network is unreachable", asegúrate de que ambos contenedores estén en la misma red Docker:

```bash
# Crear una red Docker
docker network create sonar-net

# Iniciar SonarQube en la red
docker run -d --name sonarqube --network sonar-net -p 9000:9000 sonarqube:community

# Ejecutar SonarScanner en la misma red
docker run --rm --network sonar-net -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=admin -Dsonar.password=admin ...
```

#### Token de acceso personalizado
Para mayor seguridad, puedes crear un token de acceso en SonarQube (Administración > Usuarios > Tokens) y usarlo en lugar de contraseña:

```bash
docker run --rm -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.host.url=http://localhost:9000 -Dsonar.login=tu_token_aqui ...
```

#### coverage del proyecto
Obtener coverage del proyecto desde la raiz del frontend
```bash
ng test --no-watch --code-coverage
```

#### Contraseña SonarQube
Contraseña SonarQube
```bash
P@ss1163Meth12345
```