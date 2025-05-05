@echo off
echo ===== Ejecutando limpieza =====
call cleanup.bat
echo ===== Construyendo y desplegando =====
docker-compose up -d --build
echo ===== Proceso completado =====
echo El frontend estará disponible en: http://localhost
echo El backend estará disponible en: http://localhost:8080