pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'bompick'
        VITE_TMDB_API_KEY = '19ed8c8981608264e6220bd3f9bcc0b7'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        docker build \
                            --build-arg VITE_TMDB_API_KEY=$VITE_TMDB_API_KEY \
                            -t ${DOCKER_IMAGE}:latest .
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Stop existing container
                    sh 'docker stop bompick || true'
                    sh 'docker rm bompick || true'
                    
                    // Run new container
                    sh '''
                        docker run -d \
                            --name bompick \
                            --restart unless-stopped \
                            -p 3006:80 \
                            ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    // Remove dangling images
                    sh 'docker image prune -f'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ bomPick 배포 성공! https://bompick.yyyerin.co.kr'
        }
        failure {
            echo '❌ 배포 실패'
        }
    }
}
