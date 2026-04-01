output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "vnet_id" {
  value = azurerm_virtual_network.main.id
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "acr_name" {
  value = azurerm_container_registry.acr.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "aks_cluster_endpoint" {
  value = azurerm_kubernetes_cluster.aks.kube_config[0].host
   sensitive = true
}

output "aks_kube_config" {
  value     = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive = true
}

# FIX: removed postgres_fqdn and postgres_connection_string — they referenced
# azurerm_postgresql_flexible_server.db which no longer exists (replaced by CNPG).
# CNPG is accessed in-cluster at cnpg-cluster-rw.db.svc.cluster.local.

output "cnpg_connection_host" {
  description = "In-cluster hostname for the CNPG read-write service"
  value       = "cnpg-cluster-rw.db.svc.cluster.local"
}

output "vault_public_url" {
  value = hcp_vault_cluster.main.vault_public_endpoint_url
}

output "vault_cluster_id" {
  value = hcp_vault_cluster.main.cluster_id
}
