import { useState } from 'react';
import { Server, Shield, Database, Network, Lock, Layers, Terminal } from 'lucide-react';

interface InfraNode {
  id: string;
  name: string;
  tier: string;
  purpose: string;
  connections: string;
  hclSnippet: string;
  icon: typeof Server;
}

const AZURE_NODES: InfraNode[] = [
  {
    id: 'vnet',
    name: 'Virtual Network (VNet)',
    tier: 'Networking',
    purpose: 'Isolated private address space (10.0.0.0/16) hosting all compute, storage, and database subnets.',
    connections: 'Contains App Subnet, Data Subnet, and attaches Load Balancer ingress.',
    icon: Network,
    hclSnippet: `resource "azurerm_virtual_network" "core" {
  name                = "vnet-vishnu-prod"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
}`,
  },
  {
    id: 'nsg',
    name: 'Network Security Group (NSG)',
    tier: 'Security',
    purpose: 'Stateful Layer-4 firewall rules permitting HTTPS (443) from Load Balancer and blocking direct public DB traffic.',
    connections: 'Bound directly to App Subnet and Data Subnet.',
    icon: Shield,
    hclSnippet: `resource "azurerm_network_security_group" "app_nsg" {
  name                = "nsg-app-tier"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    destination_port_range     = "443"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }
}`,
  },
  {
    id: 'lb',
    name: 'Azure Load Balancer',
    tier: 'Ingress',
    purpose: 'Distributes inbound HTTPS traffic across healthy compute instances with probe health checks.',
    connections: 'Routes external traffic into App Subnet VM/App Service pool.',
    icon: Layers,
    hclSnippet: `resource "azurerm_lb" "public" {
  name                = "lb-edge-ingress"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Standard"
}`,
  },
  {
    id: 'compute',
    name: 'Compute / App Tier',
    tier: 'Compute',
    purpose: 'Hosts containerized Spring Boot / web workloads inside private App Subnet (10.0.1.0/24).',
    connections: 'Reads secrets from Key Vault via Managed Identity and connects to MySQL in Data Subnet.',
    icon: Server,
    hclSnippet: `resource "azurerm_subnet" "app" {
  name                 = "snet-app"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.core.name
  address_prefixes     = ["10.0.1.0/24"]
}`,
  },
  {
    id: 'keyvault',
    name: 'Azure Key Vault',
    tier: 'Secrets',
    purpose: 'Stores database credentials, JWT signing keys, and storage keys without plaintext values in tfvars.',
    connections: 'Accessed by Terraform data sources and Compute Managed Identity.',
    icon: Lock,
    hclSnippet: `resource "azurerm_key_vault" "secrets" {
  name                        = "kv-vishnu-secrets"
  location                    = var.location
  resource_group_name         = azurerm_resource_group.main.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  purge_protection_enabled    = true
}`,
  },
  {
    id: 'storage',
    name: 'Azure Storage & Database',
    tier: 'Data & State',
    purpose: 'Provides remote Terraform tfstate locking container and private-subnet relational persistence.',
    connections: 'Isolated inside Data Subnet (10.0.2.0/24) with no direct public ingress.',
    icon: Database,
    hclSnippet: `terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate"
    storage_account_name = "stvishnutfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}`,
  },
];

type TfStep = 'init' | 'validate' | 'plan' | 'apply' | 'destroy';

const TF_OUTPUTS: Record<TfStep, string[]> = {
  init: [
    '$ terraform init',
    'Initializing modules... - module.network - module.compute - module.security',
    'Initializing the backend... Successfully configured the backend "azurerm".',
    'Initializing provider plugins... hashicorp/azurerm v3.110.0',
    'Terraform has been successfully initialized!',
  ],
  validate: [
    '$ terraform validate',
    'Checking module variable types and Key Vault references...',
    'Success! The configuration is valid.',
  ],
  plan: [
    '$ terraform plan -out=tfplan',
    'Refreshing state from remote azurerm backend...',
    '+ azurerm_virtual_network.core (10.0.0.0/16)',
    '+ azurerm_subnet.app & azurerm_subnet.data',
    '+ azurerm_network_security_group.app_nsg',
    '+ azurerm_key_vault.secrets (RBAC enabled)',
    '+ azurerm_lb.public & azurerm_linux_virtual_machine.app',
    'Plan: 8 to add, 0 to change, 0 to destroy.',
  ],
  apply: [
    '$ terraform apply "tfplan"',
    'azurerm_virtual_network.core: Creation complete after 4s',
    'azurerm_network_security_group.app_nsg: Creation complete after 3s',
    'azurerm_key_vault.secrets: Creation complete after 6s',
    'azurerm_lb.public: Creation complete after 8s',
    'Apply complete! Resources: 8 added, 0 changed, 0 destroyed. (Simulated)',
  ],
  destroy: [
    '$ terraform destroy -auto-approve',
    'azurerm_lb.public: Destruction complete after 5s',
    'azurerm_key_vault.secrets: Soft-deleted (purge protection active)',
    'azurerm_virtual_network.core: Destruction complete after 4s',
    'Destroy complete! Resources: 8 destroyed. (Simulated)',
  ],
};

export function TerraformExplorerDemo() {
  const [selectedId, setSelectedId] = useState<string>(AZURE_NODES[0].id);
  const [activeStep, setActiveStep] = useState<TfStep>('plan');

  const selectedNode = AZURE_NODES.find((n) => n.id === selectedId) || AZURE_NODES[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            Azure Infrastructure &amp; Terraform Topology Explorer
          </h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Interactive local simulation of the resume-stated Azure Terraform architecture. Click any node or lifecycle command.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          Simulation Only · No Real Cloud Resources Modified
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Interactive Topology Grid */}
        <div className="lg:col-span-6 grid gap-3 sm:grid-cols-2">
          {AZURE_NODES.map((node) => {
            const Icon = node.icon;
            const isSelected = node.id === selectedNode.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedId(node.id)}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0A0E17] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{node.tier}</span>
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-slate-900 dark:text-white">
                  {node.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                  {node.purpose}
                </p>
              </button>
            );
          })}
        </div>

        {/* Node Detail + HCL Inspector */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#0A0E17] p-5 space-y-4">
          <div>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">{selectedNode.tier}</p>
            <h4 className="mt-1 font-display text-base font-semibold text-slate-900 dark:text-white">
              {selectedNode.name}
            </h4>
            <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{selectedNode.purpose}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Connectivity:</strong> {selectedNode.connections}
            </p>
          </div>

          <div>
            <p className="mb-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">Sample Terraform HCL Module</p>
            <pre className="overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10 bg-slate-900 p-3.5 font-mono text-xs leading-relaxed text-slate-200">
              {selectedNode.hclSnippet}
            </pre>
          </div>
        </div>
      </div>

      {/* Simulated Terraform CLI Workflow */}
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 p-4 text-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span>Simulated Terraform CLI Workflow</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['init', 'validate', 'plan', 'apply', 'destroy'] as TfStep[]).map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors cursor-pointer ${
                  activeStep === step
                    ? 'bg-blue-500 text-slate-950 font-semibold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                terraform {step}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-black/50 p-3 font-mono text-xs leading-relaxed text-slate-300 space-y-1">
          {TF_OUTPUTS[activeStep].map((line, i) => (
            <div key={i} className={line.startsWith('+') ? 'text-emerald-400' : line.startsWith('$') ? 'text-blue-400' : ''}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
