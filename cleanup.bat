@echo off
echo ===== Limpiando y deteniendo contenedores Docker =====
docker-compose down
docker system prune -f
echo ===== Limpieza completada =====