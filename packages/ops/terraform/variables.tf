variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "aion-omega"
}

variable "tags" {
  description = "Tags para recursos"
  type        = map(string)
  default = {
    Project     = "AION-Omega"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}
