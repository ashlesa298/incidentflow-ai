pipeline {
    agent any

    tools {
        jdk 'JDK21'
        nodejs 'Node22'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd clean test package'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar,frontend/dist/**',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'IncidentFlow AI CI pipeline completed successfully!'
        }

        failure {
            echo 'IncidentFlow AI CI pipeline failed!'
        }
    }
}