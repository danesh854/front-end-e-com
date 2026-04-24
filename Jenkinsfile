pipeline {
    agent any

    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        IMAGE_NAME = 'daneshkabade45/frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DEPLOYMENT_NAME = 'frontend-deployment'
        CONTAINER_NAME = 'frontend'
        NAMESPACE = 'frontend'
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/danesh854/front-end-e-com.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $IMAGE_NAME:$IMAGE_TAG
                    docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                    docker push $IMAGE_NAME:latest
                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                export KUBECONFIG=/var/lib/jenkins/.kube/config

                kubectl apply -f k8s/deployment.yaml -n $NAMESPACE
                kubectl apply -f k8s/service.yaml -n $NAMESPACE

                kubectl set image deployment/$DEPLOYMENT_NAME \
                $CONTAINER_NAME=$IMAGE_NAME:$IMAGE_TAG -n $NAMESPACE

                kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE
                '''
            }
        }
    }
}
