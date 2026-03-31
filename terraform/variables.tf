variable "location" {
  description = "Azure region"
  type        = string
  default     = "West Europe"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "chist"
}

variable "vnet_cidr" {
  description = "CIDR block for the VNet"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "aks_subnet_cidr" {
  description = "CIDR for AKS subnet"
  type        = string
  default     = "10.0.10.0/24"
}

variable "db_subnet_cidr" {
  description = "CIDR for database subnet"
  type        = string
  default     = "10.0.20.0/24"
}

variable "acr_repositories" {
  description = "List of image repository names"
  type        = list(string)
  default     = ["frontend", "backend"]
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "appdb"
}

variable "db_username" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "dbadmin"
}

variable "aks_node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "argocd_hostname" {
  description = "Hostname for ArgoCD ingress"
  type        = string
  default     = "argocd.chist.dev"
}

variable "acr_registry" {
  description = "Azure Container Registry URL e.g. myregistry.azurecr.io"
  type        = string
}

variable "acr_username" {
  description = "ACR admin username"
  type        = string
}

variable "acr_password" {
  description = "ACR admin password"
  type        = string
  sensitive   = true
}

variable "db_url" {
  description = "Database connection URL"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret for user-module (base64, min 32 chars). Set as sensitive in HCP Terraform workspace."
  type        = string
  sensitive   = true
}
