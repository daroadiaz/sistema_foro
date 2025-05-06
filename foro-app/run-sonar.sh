#!/bin/bash

echo "===== Iniciando SonarQube ====="
cd ..
docker-compose -f docker-compose-sonar.yml up -d
sleep 20
echo "===== SonarQube iniciado ====="

echo "===== Ejecutando pruebas unitarias ====="
cd foro-app
npm run test:ci
echo "===== Ejecutando análisis de SonarQube ====="
npm run sonar

echo "===== Análisis completado ====="
echo "Los resultados están disponibles en http://localhost:9000"
echo "Usuario: admin"
echo "Contraseña: admin"