# 1. Install the CNPG operator via Helm
resource "helm_release" "cnpg_operator" {
  name             = "cnpg"
  repository       = "https://cloudnative-pg.github.io/charts"
  chart            = "cloudnative-pg"
  version          = "0.21.6"
  namespace        = "cnpg-system"
  create_namespace = true

  depends_on = [azurerm_kubernetes_cluster.aks]
}

# 2. Create the namespace for the database cluster
resource "kubernetes_namespace" "db" {
  metadata {
    name = "db"
  }

  depends_on = [azurerm_kubernetes_cluster.aks]
}

# 3. Create the secret with the app user credentials
resource "kubernetes_secret" "cnpg_app_credentials" {
  metadata {
    name      = "cnpg-app-credentials"
    namespace = kubernetes_namespace.db.metadata[0].name
  }

  data = {
    username = var.db_username
    password = var.db_password
  }

  type = "kubernetes.io/basic-auth"

  depends_on = [kubernetes_namespace.db]
}

# 4. Deploy the CNPG Cluster resource
# FIX: instances reduced from 2 → 1; with node_count = 1 in AKS there is
# only one node, so a 2-instance cluster (primary + replica) cannot schedule.
resource "kubernetes_manifest" "cnpg_cluster" {
  manifest = {
    apiVersion = "postgresql.cnpg.io/v1"
    kind       = "Cluster"
    metadata = {
      name      = "cnpg-cluster"
      namespace = kubernetes_namespace.db.metadata[0].name
    }
    spec = {
      instances = 1

      postgresql = {
        parameters = {
          max_connections = "100"
          shared_buffers  = "128MB"
        }
      }

      bootstrap = {
        initdb = {
          database = var.db_name
          owner    = var.db_username
          secret = {
            name = kubernetes_secret.cnpg_app_credentials.metadata[0].name
          }
        }
      }

      storage = {
        size = "8Gi"
      }

      resources = {
        requests = {
          memory = "256Mi"
          cpu    = "250m"
        }
        limits = {
          memory = "512Mi"
          cpu    = "500m"
        }
      }
    }
  }

  depends_on = [
    helm_release.cnpg_operator,
    kubernetes_secret.cnpg_app_credentials,
  ]
}

# 5. Namespace for application workloads
resource "kubernetes_namespace" "chist" {
  metadata {
    name = "chist"
  }

  depends_on = [azurerm_kubernetes_cluster.aks]
}

# 6. Backend secret consumed by application pods via envFrom.secretRef
resource "kubernetes_secret" "backend_secret" {
  metadata {
    name      = "backend-secret"
    namespace = kubernetes_namespace.chist.metadata[0].name
  }

  data = {
    # ── Database (CNPG) ──────────────────────────────────────
    DB_URL      = "jdbc:postgresql://cnpg-cluster-rw.db.svc.cluster.local:5432/${var.db_name}"
    DB_USERNAME = var.db_username
    DB_PASSWORD = var.db_password

    # ── JWT ──────────────────────────────────────────────────
    JWT_SECRET     = var.jwt_secret
    JWT_EXPIRATION = "86400000"

    # ── Service ports ────────────────────────────────────────
    SERVER_PORT_USER         = "8080"
    SERVER_PORT_REPORT       = "8081"
    SERVER_PORT_NOTIFICATION = "8082"

    # ── Inter-service URLs ───────────────────────────────────
    USER_SERVICE_URL = "http://user-module:8080"

    # ── External APIs ────────────────────────────────────────
    GOOGLE_MAPS_API_KEY = var.google_maps_api_key
  }

  depends_on = [kubernetes_namespace.chist]
}
