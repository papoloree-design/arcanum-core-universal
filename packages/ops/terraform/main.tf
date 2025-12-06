terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Configurar backend para state remoto
  # backend "s3" {
  #   bucket = "aion-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# Variables
variable "cluster_name" {
  description = "Nombre del cluster Kubernetes"
  type        = string
  default     = "aion-omega-prod"
}

variable "region" {
  description = "Región del cloud provider"
  type        = string
  default     = "us-east-1"
}

variable "node_count" {
  description = "Número de nodos worker"
  type        = number
  default     = 3
}

variable "node_instance_type" {
  description = "Tipo de instancia para nodos"
  type        = string
  default     = "t3.medium"
}

# Outputs
output "cluster_name" {
  value = var.cluster_name
}

output "region" {
  value = var.region
}
