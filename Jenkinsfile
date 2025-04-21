pipeline {
    agent any
    
    tools {
        nodejs 'Node.js 20.9.0'
    }
    
    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Select deployment environment')
    }
    
    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = credentials('ec2-host')
        APP_NAME = 'admin-frontend'
        DEPLOY_PATH = '/var/www/html/admin'
        DEPLOY_ENV = "${params.DEPLOY_ENV ?: 'staging'}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                // Use the environment file that's already in the repo
                sh 'npm run build'
                sh 'ls -la ./dist' // Verify the build output
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    def buildDir = './dist'
                    
                    if (!fileExists(buildDir)) {
                        error "Build directory not found. Check your build process."
                    }
                    
                    if (!fileExists("${buildDir}/index.html")) {
                        error "index.html is missing from build directory. Deployment aborted."
                    }
                    
                    sshagent(['ec2-ssh-key']) {
                        // Create a tar file of the build
                        sh "tar -czf admin-build.tar.gz -C ${buildDir} ."
                        
                        // Copy it to the EC2 instance
                        sh "scp -o StrictHostKeyChecking=no admin-build.tar.gz ${EC2_USER}@${EC2_HOST}:/tmp/"
                        
                        // Extract and deploy on EC2 with better error handling
                        sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                                set -e  # Exit on any error
                                
                                echo "Backing up existing admin site if it exists..."
                                if [ -d "${DEPLOY_PATH}" ]; then
                                    sudo mv ${DEPLOY_PATH} ${DEPLOY_PATH}_backup_\$(date +%Y%m%d%H%M%S) || true
                                fi
                                
                                echo "Creating deploy directory..."
                                sudo mkdir -p ${DEPLOY_PATH}
                                
                                echo "Extracting new build..."
                                sudo tar -xzf /tmp/admin-build.tar.gz -C ${DEPLOY_PATH}/
                                
                                echo "Setting permissions..."
                                sudo chmod -R 755 ${DEPLOY_PATH}
                                sudo chown -R www-data:www-data ${DEPLOY_PATH}
                                
                                echo "Cleaning up..."
                                rm /tmp/admin-build.tar.gz
                                
                                echo "Reloading Nginx..."
                                sudo systemctl reload nginx
                                
                                echo "Deployment complete!"
                            '
                        """
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            echo "Verifying deployment..."
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                                if [ -f "${DEPLOY_PATH}/index.html" ]; then
                                    echo "Deployment verified: index.html exists"
                                    exit 0
                                else
                                    echo "Deployment verification failed: index.html not found"
                                    exit 1
                                fi
                            '
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            script {
                echo 'The admin frontend pipeline failed. Check the build logs for details.'
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            if [ -d "${DEPLOY_PATH}_backup_*" ]; then
                                echo "Restoring from backup..."
                                sudo rm -rf ${DEPLOY_PATH} || true
                                sudo mv \$(ls -td ${DEPLOY_PATH}_backup_* | head -1) ${DEPLOY_PATH}
                                sudo systemctl reload nginx
                                echo "Restored from backup"
                            fi
                        '
                    """
                }
            }
        }
        success {
            echo 'Successfully built and deployed the admin frontend application.'
        }
    }
}
