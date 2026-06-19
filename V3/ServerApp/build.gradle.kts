plugins {
	java
	war
	id("org.springframework.boot") version "2.7.10"
	id("io.spring.dependency-management") version "1.0.15.RELEASE"
}

group = "lk.earth"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	mavenCentral()
}

dependencies {
	// Swagger (commented out until needed)
	// implementation("io.springfox:springfox-boot-starter:3.0.0")
	// implementation("io.springfox:springfox-swagger2:2.9.2")
	// implementation("io.springfox:springfox-swagger-ui:2.9.2")

	// Spring Boot dependencies
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")

	// JWT
	implementation("io.jsonwebtoken:jjwt:0.9.1")

	// ✅ Correct MySQL Connector version
	runtimeOnly("com.mysql:mysql-connector-j:8.0.33")

	// Tomcat
	providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")

	// Testing
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
