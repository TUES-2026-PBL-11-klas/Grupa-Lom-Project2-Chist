variable "mail_host" {
  description = "SMTP mail host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "mail_port" {
  description = "SMTP mail port"
  type        = string
  default     = "587"
}

variable "mail_username" {
  description = "SMTP mail username"
  type        = string
}

variable "mail_password" {
  description = "SMTP mail password"
  type        = string
  sensitive   = true
}
