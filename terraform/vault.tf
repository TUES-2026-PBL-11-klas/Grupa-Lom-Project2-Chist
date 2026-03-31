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
