FROM openjdk:17
WORKDIR /app

ARG JAR_FILE=./build/libs/backend-0.0.1-SNAPSHOT.jar

# 빌드 결과물 복사 및 실행
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

 