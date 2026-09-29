stage('Backend Build & Test') {
    steps {
        dir('backend') {
            withCredentials([string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY')]) {
                bat 'mvnw.cmd clean test package'
            }
        }
    }
}