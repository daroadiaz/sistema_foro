FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /workspace/app

# Copia los archivos de Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Arregla los permisos del script mvnw
RUN chmod +x ./mvnw
# Compila y empaqueta la aplicación
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=build /workspace/app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]