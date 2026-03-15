## ---------- BUILD STAGE ----------
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven wrapper + build files
COPY .mvn/ .mvn/
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd
COPY pom.xml pom.xml

# Download dependencies (cached layer)
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

# Copy source and build
COPY src/ src/
RUN ./mvnw -q -DskipTests package

## ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy built jar
COPY --from=build /app/target/*.jar fintrack.jar

EXPOSE 8080

# Config (DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET, etc.) comes from env vars
# Force server port to 8080 for Render compatibility
ENTRYPOINT ["java","-jar","-Dserver.port=8080","/app/fintrack.jar"]
