# NGINX Ingress Controller (replaces AWS ALB Controller)
resource "helm_release" "nginx_ingress" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.10.0"
  namespace        = "ingress-nginx"
  create_namespace = true

  values = [
    yamlencode({
      controller = {
        service = {
          type = "LoadBalancer"
        }
      }
    })
  ]

  depends_on = [azurerm_kubernetes_cluster.aks]
}

# ArgoCD
resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "7.8.13"
  namespace        = "argocd"
  create_namespace = true

  values = [
    yamlencode({
      server = {
        ingress = {
          enabled          = true
          ingressClassName = "nginx"
          hostname         = var.argocd_hostname
          annotations = {
            "nginx.ingress.kubernetes.io/ssl-redirect"     = "false"
            "nginx.ingress.kubernetes.io/backend-protocol" = "HTTP"
          }
          tls = false
        }
        extraArgs = ["--insecure"]
      }
    })
  ]

  depends_on = [helm_release.nginx_ingress]
}

# ArgoCD Apps - points to your GitHub repo
# FIX: file path updated to "templates/argocd-apps-values.yaml" to match
# the folder structure (templates/ subfolder alongside .tf files).
resource "helm_release" "argocd_apps" {
  name             = "argocd-apps"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argocd-apps"
  version          = "2.0.2"
  namespace        = "argocd"
  create_namespace = false

  values = [
    file("${path.module}/templates/argocd-apps-values.yaml")
  ]

  depends_on = [helm_release.argocd]
}
