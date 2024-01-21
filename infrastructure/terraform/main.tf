provider "aws" {
  region = var.region
  secret_key = 
}

resource "aws_instance" "master_node" {
  ami           = var.ami
  instance_type = "t2.medium"
}

resource "aws_instance" "worker_node_1" {
  ami           = var.ami
  instance_type = "t2.micro"
}

resource "aws_instance" "worker_node_2" {
  ami           = var.ami
  instance_type = "t2.micro"
}


output "private_key" {
  value       = aws_instance.master_node.private_key
  sensitive   = true
}

output "master_ip" {
  value       = aws_instance.master_node.private_ip
}

output "worker_ips" {
  value       = [
    aws_instance.worker_node_1.private_ip,
    aws_instance.worker_node_2.private_ip,
  ]
}
