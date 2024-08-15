FROM openjdk:17-jdk-alpine
WORKDIR /app

# Gradle 관련 파일 및 소스 코드 복사
COPY gradlew /app/
COPY gradle /app/gradle/
COPY build.gradle /app/
COPY settings.gradle /app/
COPY src /app/src

# gradlew 실행 권한 부여 및 빌드 수행
RUN chmod +x gradlew
RUN ./gradlew build

# 빌드 결과물 복사 및 실행
COPY /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

 