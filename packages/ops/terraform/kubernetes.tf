# Este archivo contendría la configuración específica del cluster
# Ejemplo para AWS EKS:

# module "eks" {
#   source  = "terraform-aws-modules/eks/aws"
#   version = "~> 19.0"
#
#   cluster_name    = var.cluster_name
#   cluster_version = "1.28"
#
#   vpc_id     = module.vpc.vpc_id
#   subnet_ids = module.vpc.private_subnets
#
#   eks_managed_node_groups = {
#     aion_nodes = {
#       min_size     = 2
#       max_size     = 6
#       desired_size = var.node_count
#
#       instance_types = [var.node_instance_type]
#     }
#   }
# }

# Ejemplo para GCP GKE:

# resource "google_container_cluster" "aion_cluster" {
#   name     = var.cluster_name
#   location = var.region
#
#   remove_default_node_pool = true
#   initial_node_count       = 1
# }
#
# resource "google_container_node_pool" "aion_nodes" {
#   name       = "aion-node-pool"
#   cluster    = google_container_cluster.aion_cluster.name
#   location   = var.region
#   node_count = var.node_count
#
#   node_config {
#     machine_type = "e2-medium"
#   }
# }

resource "null_resource" "placeholder" {
  provisioner "local-exec" {
    command = "echo 'Configurar provider específico (AWS/GCP/Azure) en este archivo'"
  }
}
