import {
  to = azurerm_cognitive_account.vision
  id = "/subscriptions/bf606b72-98ef-41a9-b412-4f95aea302d6/resourceGroups/rg-chist-dev/providers/Microsoft.CognitiveServices/accounts/cv-chist-dev"
}

import {
  to = azurerm_subnet.aks
  id = "/subscriptions/bf606b72-98ef-41a9-b412-4f95aea302d6/resourceGroups/rg-chist-dev/providers/Microsoft.Network/virtualNetworks/vnet-chist-dev/subnets/subnet-aks-dev"
}

import {
  to = azurerm_network_security_group.public
  id = "/subscriptions/bf606b72-98ef-41a9-b412-4f95aea302d6/resourceGroups/rg-chist-dev/providers/Microsoft.Network/networkSecurityGroups/nsg-public-dev"
}
