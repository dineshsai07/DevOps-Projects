pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    stages {
        stage('Terraform Init') {
            steps {
                script {
                    // Terraform init
                    sh 'terraform init -input=false'
                }
            }
        }

        stage('Check Infrastructure') {
            steps {
                script {
                    // Check if infrastructure already exists
                    def planStatus = sh(script: 'terraform show', returnStatus: true)

                    // If infrastructure already exists, skip Terraform apply
                    if (planStatus == 0) {
                        echo 'Infrastructure already exists. Skipping Terraform apply.'
                        currentBuild.result = 'SUCCESS'
                        return
                    }
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                script {
                    // Terraform plan
                    sh 'terraform plan'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                script {
                    // Terraform apply
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Get Outputs') {
            steps {
                script {
                    // Retrieve Terraform outputs
                    def privateKey = sh(script: 'terraform output -raw private_key', returnStdout: true).trim()
                    def masterIp = sh(script: 'terraform output -raw master_ip', returnStdout: true).trim()
                    def workerIps = sh(script: 'terraform output -raw worker_ips', returnStdout: true).trim().split('\n')

                    // Store outputs as environment variables for later use
                    env.MASTER_IP = masterIp
                    env.WORKER_IPS = workerIps.join(',')
                    env.PRIVATE_KEY = privateKey
                }
            }
        }

        stage('Install Ansible') {
            steps {
                script {
                    // Install Ansible on master node
                    sh "ssh -i ${env.PRIVATE_KEY} ubuntu@${env.MASTER_IP} 'sudo apt-get update && sudo apt-get install -y ansible'"

                    // Install Ansible on worker nodes
                    for (workerIp in env.WORKER_IPS.split(',')) {
                        sh "ssh -i ${env.PRIVATE_KEY} ubuntu@${workerIp} 'sudo apt-get update && sudo apt-get install -y ansible'"
                    }
                }
            }
        }

        stage('Configure Ansible') {
            steps {
                script {
                    // Copy Ansible configuration files or roles to the master node
                    sh "scp -i ${env.PRIVATE_KEY} -r ansible/* ubuntu@${env.MASTER_IP}:~/ansible/"

                    // Run Ansible playbook on the master node
                    sh "ssh -i ${env.PRIVATE_KEY} ubuntu@${env.MASTER_IP} 'cd ~/ansible && ansible-playbook your-playbook.yml'"
                }
            }
        }
    }

    // No destroy step
}
