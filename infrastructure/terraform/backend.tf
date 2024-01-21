terraform {
  backend "s3" {
    bucket = "dineshpractice"
    key = "dev.tfstate"
    region = "us-east-1"
    encrypt = false
  }
}