FROM node:16-alpine3.16
ARG sonarservertoken

WORKDIR /app
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install && yarn cache clean
COPY . .
RUN apk update && apk add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN apk add build-base
RUN ldd /usr/lib/jvm/java-11-openjdk/bin/java
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"
RUN java -version
# Install Sonar Scanner
RUN apk add unzip && unzip
RUN umask 644 sonar-scanner-cli-4.2.0.1873-linux.zip
RUN wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873-linux.zip
RUN unzip sonar-scanner-cli-4.2.0.1873-linux.zip
ENV SONAR_SCANNER_HOME=/app/sonar-scanner-4.2.0.1873-linux
ENV PATH="$SONAR_SCANNER_HOME/bin:${PATH}"
RUN echo $SONAR_SCANNER_HOME && echo $JAVA_HOME && echo $PATH
RUN yarn test --coverage
RUN sed -i 's/use_embedded_jre=true/use_embedded_jre=false/g' /app/sonar-scanner-4.2.0.1873-linux/bin/sonar-scanner
# RUN /app/sonar-scanner-4.2.0.1873-linux/bin/sonar-scanner -Dsonar.projectKey="commercial-pricing-facit-web" -Dsonar.login=${sonarservertoken} -Dsonar.host.url="https://sonarqube.devops.tui/" -Dsonar.sources=app -Dsonar.tests=app -Dsonar.test.inclusions="**/*.test.js,**/*.test.jsx" -Dsonar.javascript.coveragePlugin=lcov -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info -Dsonar.exclusions="**/node_modules/**,build/**,**/*test*.*,**/SWMessageHandlers.js, **/PackageMessageHandler.js, **/TransfersMessageHandler.js" -Dsonar.javascript.file.suffixes=.js,.jsx -Dsonar.sourceEncoding=UTF-8 -Dsonar.testExecutionReportPaths="reports/test-report.xml"
RUN /app/sonar-scanner-4.2.0.1873-linux/bin/sonar-scanner -Dsonar.login=${sonarservertoken}
RUN yarn build
FROM nginx:alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/
COPY openssl.cnf /etc/ssl/
COPY --from=0 /app/dist/. /app/html/
CMD ["nginx", "-g", "daemon off;"]
