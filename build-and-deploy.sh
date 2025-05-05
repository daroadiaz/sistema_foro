#!/bin/bash

echo "===== Iniciando compilación y despliegue del sistema de foro ====="

echo "===== Compilando backend (Spring Boot) ====="
cd demo
./mvnw clean package -DskipTests
cd ..

echo "===== Compilando frontend (Angular) ====="
cd foro-app
npm install
npm run build --prod
cd ..

echo "===== Iniciando contenedores Docker ====="
docker-compose up -d --build

echo "===== Proceso completado ====="
echo "El frontend está disponible en: http://localhost"
echo "El backend está disponible en: http://localhost:8080"