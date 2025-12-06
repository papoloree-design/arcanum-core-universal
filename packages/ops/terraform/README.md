# AION-Ω Terraform Infrastructure

Infraestructura como código (IaC) para AION-Ω.

## Proveedores Soportados

- AWS (EKS)
- Google Cloud (GKE)
- Azure (AKS)
- DigitalOcean (DOKS)

## Uso

### 1. Inicializar Terraform

```bash
terraform init
```

### 2. Planificar cambios

```bash
terraform plan
```

### 3. Aplicar infraestructura

```bash
terraform apply
```

### 4. Destruir (solo desarrollo)

```bash
terraform destroy
```

## Configuración

1. Copiar `terraform.tfvars.example` a `terraform.tfvars`
2. Completar con tus valores
3. Nunca subir `terraform.tfvars` al repositorio

## State Management

Para producción, configurar backend remoto:

- AWS S3 + DynamoDB
- Terraform Cloud
- Google Cloud Storage
