# ── HCP Vault Cluster ─────────────────────────────────────────
# Authenticate to HCP using env vars:
#   export HCP_CLIENT_ID=...
#   export HCP_CLIENT_SECRET=...

# HCP Virtual Network (required for Vault cluster)
resource "hcp_hvn" "main" {
  hvn_id         = "chist-hvn"
  cloud_provider = "azure"
  region         = "eastus"
}

# Vault Dedicated Cluster - Development tier (cheapest)
resource "hcp_vault_cluster" "main" {
  cluster_id      = "chist-vault"
  hvn_id          = hcp_hvn.main.hvn_id
  tier            = "dev"
  public_endpoint = true # needed for GitHub Actions to reach it
}

# Admin token to configure Vault after creation
resource "hcp_vault_cluster_admin_token" "main" {
  cluster_id = hcp_vault_cluster.main.cluster_id
}
