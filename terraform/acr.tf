# Azure Container Registry
# Basic SKU is the cheapest tier - included in student credits
resource "azurerm_container_registry" "acr" {
  name                = "acr${var.project_name}${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  sku = "Basic"

  # FIX: must be true — vault.tf stores acr_username/acr_password which are
  # the admin credentials; admin_enabled = false would make them useless.
  admin_enabled = true

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}
