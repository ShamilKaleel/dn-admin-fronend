pipeline {
    agent any
    
    tools {
        nodejs 'Node.js 20.9.0'
    }
    
    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = credentials('ec2-host')
        APP_NAME = 'admin-frontend'
        DEPLOY_PATH = '/var/www/html/admin'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                // For React
                withEnv(['PUBLIC_URL=/admin']) {
                    sh 'npm install'
                    sh 'npm run build'
                }
                
                sh 'ls -la' // List files to see what was created
                sh 'ls -la ./dist' // Explicitly list dist directory contents
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Use the dist directory directly
                    def buildDir = './dist'
                    
                    if (fileExists(buildDir)) {
                        echo "Found build directory: ${buildDir}"
                        
                        // Debug: Check build directory contents
                        sh "ls -la ${buildDir}"
                        
                        // Ensure the build directory exists and has files
                        if (fileExists("${buildDir}/index.html")) {
                            echo "Build directory contains index.html"
                        } else {
                            error "index.html is missing from build directory. Deployment aborted."
                        }
                        
                        sshagent(['ec2-ssh-key']) {
                            // Create a tar file of the build
                            echo "Creating tar archive from: ${buildDir}"
                            sh "tar -czf admin-build.tar.gz -C ${buildDir} ."
                            
                            // Verify tar was created
                            sh "ls -la admin-build.tar.gz"
                            
                            // Copy it to the EC2 instance
                            echo "Copying tar to EC2 instance"
                            sh "scp -o StrictHostKeyChecking=no admin-build.tar.gz ${EC2_USER}@${EC2_HOST}:/tmp/"
                            
                            // Extract and deploy on EC2
                            echo "Extracting and deploying on EC2 - improved method"
                            sh """
                                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                                    sudo rm -rf ${DEPLOY_PATH}
                                    sudo mkdir -p ${DEPLOY_PATH}
                                    sudo tar -xzf /tmp/admin-build.tar.gz -C ${DEPLOY_PATH}/
                                    sudo chmod -R 755 ${DEPLOY_PATH}
                                    rm /tmp/admin-build.tar.gz
                                    sudo systemctl reload nginx
                                '
                            """
                        }
                    } else {
                        error "Build directory not found. Check your build process."
                    }
                }
            }
        }
    }
    
    post {
        failure {
            echo 'The admin frontend pipeline failed. Check the build logs for details.'
        }
        success {
            echo 'Successfully built and deployed the admin frontend application.'
        }
    }
}