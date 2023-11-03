const sonarqubeScanner = require('sonarqube-scanner');

/**Specify this value with the local sonar project key.*/
const localProjectToken = ''; 

/**Include the file names that needs to be ignored in SonarqubeScan */
const ignoreFiles = ['SWMessageHandlers'];

const mapFileForExclusions = item => `**/${item}.js`;

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9080',
    token: localProjectToken,
    options: {
      'sonar.sources': 'app',
      'sonar.tests': 'app',
      'sonar.inclusions': '**',
      'sonar.exclusions': ignoreFiles.map(mapFileForExclusions).toString(),
      'sonar.test.inclusions': 'app/**/*.test.js,app/**/*.test.jsx',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'reports/test-report.xml'
    }
  },
  () => process.exit()
);
