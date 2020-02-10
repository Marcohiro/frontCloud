terraform {
  required_version = ">= 0.12.0"
  required_providers {
    azurerm = ">=1.30.0"
}
}

provider "azurerm" {
  version = ">=1.30.0"
}

locals {
  group_name = "esgialgrp4"
}

#Ressource Group
resource "azurerm_resource_group" "groupe4esgi" {
  name     = "grp4-ressourcegroup"
  location = "francecentral"
}

#Storage Account
resource "azurerm_storage_account" "groupe4esgi" {
  name                     = "ghalemelbarakapetit"
  resource_group_name      = azurerm_resource_group.groupe4esgi.name
  location                 = azurerm_resource_group.groupe4esgi.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

#Function Application (Azure function)
resource "azurerm_function_app" "groupe4esgi" {
  name                      = "grp4-azure-functions"
  location                  = azurerm_resource_group.groupe4esgi.location
  resource_group_name       = azurerm_resource_group.groupe4esgi.name
  app_service_plan_id       = azurerm_app_service_plan.groupe4esgi.id
  storage_connection_string = azurerm_storage_account.groupe4esgi.primary_connection_string
}


# Crée le plan que le service va utiliser
resource "azurerm_app_service_plan" "groupe4esgi" {
  name                = "grp4-azure-functions-plan"
  location            = azurerm_resource_group.groupe4esgi.location
  resource_group_name = azurerm_resource_group.groupe4esgi.name
  kind                = "FunctionApp"

  sku {
    tier = "Standard"
    size = "S1"
  }
}

#App Service (Api)
resource "azurerm_app_service" "groupe4esgi" {
    name                = "grp4-ApiCloud"
    location            = azurerm_resource_group.groupe4esgi.location
    resource_group_name = azurerm_resource_group.groupe4esgi.name
    app_service_plan_id = azurerm_app_service_plan.groupe4esgi.id
    site_config {
        dotnet_framework_version = "v2.0"
  }
  connection_string {
    name  = "grp4-mysqldatabase"
    type  = "MySQL"
    value = "Database=grp4-mysqldatabase;Data Source=grp4-mysqlserver.mysql.database.azure.com;User Id=groupe4esgi@grp4-mysqlserver;Password=v3ry-53cr37-p455w0rd"
  }
}

# Crée MySQL server
resource "azurerm_mysql_server" "groupe4esgi" {
    name                         = "grp4-mysqlserver"
    resource_group_name          = azurerm_resource_group.groupe4esgi.name
    location                     = azurerm_resource_group.groupe4esgi.location

    sku_name = "B_Gen5_2"

  storage_profile {
        storage_mb            = 5120
        backup_retention_days = 7
        geo_redundant_backup  = "Disabled"
  }
    version                      = "5.7"
    administrator_login          = "grp4"
    administrator_login_password = "v3ry-s3cr3t-p4ssw0rd"
    ssl_enforcement              = "Enabled"
}
#Database utilisée
resource "azurerm_mysql_database" "groupe4esgi" {
  name                             = "grp4-mysqldatabase"
  resource_group_name              = azurerm_resource_group.groupe4esgi.name
  server_name                      = azurerm_mysql_server.groupe4esgi.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

resource "azurerm_mysql_firewall_rule" "groupe4esgi" {
  name                = "grp4-AllowAzureServices"
  resource_group_name = azurerm_resource_group.groupe4esgi.name
  server_name         = azurerm_mysql_server.groupe4esgi.name
  start_ip_address    = "92.154.125.161"
  end_ip_address      = "92.154.125.161"
# Pour permettre d'accéder à la bdd avec votre adresse IP  
#start_ip_address    = "VotreAdresseIP"
#end_ip_address      = "VotreAdresseIP"


}

#configure docker provider
provider "docker" {
    version = "~> 2.6"
    host = "npipe:////.//pipe//docker_engine"
}

#Appel resgistre de l'image
data "docker_registry_image" "front" {
  name = "marcohiro/frontcloud:second"
}

#Appel de l'image
resource "docker_image" "front" {
    name = "marcohiro/frontcloud:second"
}

# Docker Front
resource "azurerm_container_group" "docker_front" {
  name                     = "frontAffichage"
  resource_group_name      = azurerm_resource_group.groupe4esgi.name
  location                 = "westeurope"
  ip_address_type          = "public"
  dns_name_label           = "groupe4esgi-front"
  os_type                  = "linux"
  container {
    name                   = "container"
    image                  = "docker.io/marcohiro/frontcloud:second"
    port                   = "3000"
    cpu                    = "0.5"
    memory                 = "1.5"
  }
}
