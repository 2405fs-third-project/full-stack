FROM gradle:7.5.1-jdk17 AS build
WORKDIR /app

COPY . .

RUN gradle build --no-daemon

FROM openjdk:17
WORKDIR /app

COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
