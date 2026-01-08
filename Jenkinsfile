pipeline {
  agent any

  stages {
    stage('Build Docker Image') {
      steps {
        sh '''
          docker build -t mehdiba11/api-gateway:latest -f docker/Dockerfile.api .
        '''
      }
    }

    stage('Trivy Scan') {
      steps {
        sh '''
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image mehdiba11/api-gateway:latest
        '''
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push mehdiba11/api-gateway:latest
          '''
        }
      }
    }
  }
}
// End of Jenkinsfile