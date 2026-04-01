# Enable KV v2 secrets engine
resource "vault_mount" "kv" {
  path = "secret"
  type = "kv-v2"
}

# All your secrets

resource "vault_kv_secret_v2" "acr" {
  mount = vault_mount.kv.path
  name  = "acr"
  data_json = jsonencode({
    registry = var.acr_registry
    username = var.acr_username
    password = var.acr_password
  })
}

resource "vault_kv_secret_v2" "database" {
  mount = vault_mount.kv.path
  name  = "database"
  data_json = jsonencode({
    url      = var.db_url
    username = var.db_username
    password = var.db_password
  })
}

# ── Policies ──────────────────────────────────────────────────

# GitHub Actions policy - can only read ACR
resource "vault_policy" "github_actions" {
  name = "github-actions"
  policy = <<EOT
path "secret/data/acr" {
  capabilities = ["read"]
}
EOT
}

# Backend policy - can only read DB
resource "vault_policy" "backend" {
  name = "backend"
  policy = <<EOT
path "secret/data/database" {
  capabilities = ["read"]
}
EOT
}

# AppRole Auth

resource "vault_auth_backend" "approle" {
  type = "approle"
}

# AppRole for GitHub Actions
resource "vault_approle_auth_backend_role" "github_actions" {
  backend        = vault_auth_backend.approle.path
  role_name      = "github-actions"
  token_policies = [vault_policy.github_actions.name]
  token_ttl      = 3600      # 1 hour - enough for a CI run
  token_max_ttl  = 7200
}

# AppRole for Spring Boot backend
resource "vault_approle_auth_backend_role" "backend" {
  backend        = vault_auth_backend.approle.path
  role_name      = "backend"
  token_policies = [vault_policy.backend.name]
  token_ttl      = 3600
  token_max_ttl  = 86400     # 24 hours
}

# Outputs (Role IDs to use in GitHub Secrets)

data "vault_approle_auth_backend_role_id" "github_actions" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.github_actions.role_name
}

resource "vault_approle_auth_backend_role_secret_id" "github_actions" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.github_actions.role_name
}

resource "vault_approle_auth_backend_role_secret_id" "backend" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.backend.role_name
}

data "vault_approle_auth_backend_role_id" "backend" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.backend.role_name
}

output "github_actions_role_id" {
  value     = data.vault_approle_auth_backend_role_id.github_actions.role_id
  sensitive = true
}

output "github_actions_secret_id" {
  value     = vault_approle_auth_backend_role_secret_id.github_actions.secret_id
  sensitive = true
}

output "backend_role_id" {
  value     = data.vault_approle_auth_backend_role_id.backend.role_id
  sensitive = true
}

output "backend_secret_id" {
  value     = vault_approle_auth_backend_role_secret_id.backend.secret_id
  sensitive = true
}

# Computer Vision secret
resource "vault_kv_secret_v2" "computer_vision" {
  mount = vault_mount.kv.path
  name  = "computer-vision"
  data_json = jsonencode({
    endpoint = azurerm_cognitive_account.vision.endpoint
    key      = azurerm_cognitive_account.vision.primary_access_key
  })
}

# Database admin secret (for colleagues to connect + manage tables)
resource "vault_kv_secret_v2" "db_admin" {
  mount = vault_mount.kv.path
  name  = "db-admin"
  data_json = jsonencode({
    host     = "cnpg-cluster-rw.db.svc.cluster.local"
    port     = "5432"
    database = var.db_name
    username = var.db_username
    password = var.db_password
    jdbc_url = "jdbc:postgresql://cnpg-cluster-rw.db.svc.cluster.local:5432/${var.db_name}"
  })
}

# Policy for colleagues: read CV key + DB admin
resource "vault_policy" "developer" {
  name = "developer"
  policy = <<EOT
path "secret/data/computer-vision" {
  capabilities = ["read"]
}
path "secret/data/db-admin" {
  capabilities = ["read"]
}
EOT
}

# AppRole for colleagues
resource "vault_approle_auth_backend_role" "developer" {
  backend        = vault_auth_backend.approle.path
  role_name      = "developer"
  token_policies = [vault_policy.developer.name]
  token_ttl      = 28800   # 8 hours
  token_max_ttl  = 86400
}

data "vault_approle_auth_backend_role_id" "developer" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.developer.role_name
}

resource "vault_approle_auth_backend_role_secret_id" "developer" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.developer.role_name
}

output "developer_role_id" {
  value     = data.vault_approle_auth_backend_role_id.developer.role_id
  sensitive = true
}

output "developer_secret_id" {
  value     = vault_approle_auth_backend_role_secret_id.developer.secret_id
  sensitive = true
}
