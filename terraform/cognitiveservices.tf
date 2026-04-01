resource "azurerm_cognitive_account" "vision" {
  name                = "cv-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  kind                = "ComputerVision"
  sku_name            = "F0"  # Free tier: 5000 calls/month

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}
