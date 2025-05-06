@echo off
echo ===== Verificando si SonarQube está en ejecución =====
echo ===== Accediendo a SonarQube en http://localhost:9000 =====
timeout 5

echo ===== Ejecutando análisis de SonarQube =====
for /f "tokens=1" %%i in ('docker network inspect bridge --format="{{range .IPAM.Config}}{{.Gateway}}{{end}}"') do set HOST_IP=%%i
echo Usando IP del host: %HOST_IP%

docker run --rm --network=host -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.login=admin -Dsonar.password=admin
echo ===== Análisis completado =====
echo Los resultados están disponibles en http://localhost:9000
echo Usuario: admin
echo Contraseña: admin