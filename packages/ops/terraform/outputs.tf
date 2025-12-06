output "deployment_info" {
  value = {
    cluster_name = var.cluster_name
    region       = var.region
    environment  = var.environment
  }
  description = "Información del despliegue"
}
