import { Rule } from '../types';

export const rule: Rule = {
  id: 'terraform-infrastructure',
  slug: 'terraform-infrastructure',
  name: 'Terraform Infrastructure',
  description: 'Best practices for Infrastructure as Code with Terraform',
  tags: ['terraform', 'infrastructure', 'iac', 'cloud', 'devops'],
  votes: { up: 0, down: 0 },
  featured: false,
  createdAt: '2024-01-01',
  content: `# Terraform Infrastructure as Code Best Practices

## 1. Project Structure & Organization

Organize Terraform code with clear module structure and separation of concerns.

\`\`\`hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }

  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
    }
  }
}

# Variables
variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}
\`\`\`

## 2. Module Development

Create reusable modules with proper inputs, outputs, and documentation.

\`\`\`hcl
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name = "\${var.name}-vpc"
  })
}

resource "aws_subnet" "public" {
  # Resource count configuration
  resource_count   = length(var.public_subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[\$count_index]
  availability_zone       = data.aws_availability_zones.available.names[\$count_index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "\${var.name}-public-\${count.index + 1}"
    Type = "public"
  })
}

resource "aws_subnet" "private" {
  # Resource count for private subnets
  resource_count   = length(var.private_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[\$count_index]
  availability_zone = data.aws_availability_zones.available.names[\$count_index]

  tags = merge(var.tags, {
    Name = "\${var.name}-private-\${count.index + 1}"
    Type = "private"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.tags, {
    Name = "\${var.name}-igw"
  })
}

resource "aws_nat_gateway" "main" {
  # Enable NAT gateway count
  resource_count   = var.enable_nat_gateway ? length(var.public_subnets) : 0

  allocation_id = aws_eip.nat[\$count_index].id
  subnet_id     = aws_subnet.public[\$count_index].id

  tags = merge(var.tags, {
    Name = "\${var.name}-nat-\${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}

resource "aws_eip" "nat" {
  # Enable NAT gateway count
  resource_count   = var.enable_nat_gateway ? length(var.public_subnets) : 0

  domain = "vpc"

  tags = merge(var.tags, {
    Name = "\${var.name}-eip-\${count.index + 1}"
  })
}

data "aws_availability_zones" "available" {
  state = "available"
}

# modules/vpc/variables.tf
variable "name" {
  description = "Name prefix for VPC resources"
  type        = string
}

variable "cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  validation {
    condition     = can(cidrhost(var.cidr_block, 0))
    error_message = "CIDR block must be valid."
  }
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = []
}

variable "private_subnets" {
  description = "List of private subnet CIDR blocks"
  type        = list(string)
  default     = []
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}
\`\`\`

## 3. State Management

Use remote state and implement state locking for team collaboration.

\`\`\`hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "environments/production/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"

    # Optional: Use role assumption for cross-account access
    role_arn = "arn:aws:iam::123456789012:role/TerraformRole"
  }
}

# Create S3 bucket for state storage
resource "aws_s3_bucket" "terraform_state" {
  bucket = "company-terraform-state"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_locks" {
  name           = "terraform-state-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "Terraform State Locks"
  }
}
\`\`\`

## 4. Variable Management

Use locals, data sources, and proper variable handling.

\`\`\`hcl
# variables.tf
variable "environment" {
  description = "Environment name"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "instance_types" {
  description = "Map of instance types by environment"
  type        = map(string)
  default = {
    dev     = "t3.micro"
    staging = "t3.small"
    prod    = "t3.medium"
  }
}

variable "database_config" {
  description = "Database configuration"
  type = object({
    engine         = string
    engine_version = string
    instance_class = string
    allocated_storage = number
    backup_retention_period = number
  })

  validation {
    condition     = var.database_config.allocated_storage >= 20
    error_message = "Database storage must be at least 20 GB."
  }
}

# locals.tf
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    CreatedAt   = timestamp()
  }

  instance_type = var.instance_types[var.environment]

  azs = slice(data.aws_availability_zones.available.names, 0, 3)

  vpc_cidr = {
    dev     = "10.0.0.0/16"
    staging = "10.1.0.0/16"
    prod    = "10.2.0.0/16"
  }
}

# data.tf
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}
\`\`\`

## 5. Resource Configuration

Follow best practices for resource configuration and naming.

\`\`\`hcl
# ec2.tf
resource "aws_launch_template" "app" {
  name_prefix   = "\${var.project_name}-\${var.environment}-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = local.instance_type

  vpc_security_group_ids = [aws_security_group.app.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.app.name
  }

  user_data = base64encode(templatefile("${path.module}/userdata.sh", {
    environment = var.environment
    app_version = var.app_version
  }))

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "\${var.project_name}-\${var.environment}-app"
    })
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "\${var.project_name}-\${var.environment}-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"

  min_size         = var.asg_config.min_size
  max_size         = var.asg_config.max_size
  desired_capacity = var.asg_config.desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }

  tag {
    key                 = "Name"
    value               = "\${var.project_name}-\${var.environment}-asg"
    propagate_at_launch = false
  }

  dynamic "tag" {
    for_each = local.common_tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }
}

# Security Groups
resource "aws_security_group" "app" {
  name_prefix = "\${var.project_name}-\${var.environment}-app-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "\${var.project_name}-\${var.environment}-app-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}
\`\`\`

## 6. Output Values

Define comprehensive outputs for module composition.

\`\`\`hcl
# outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "security_group_ids" {
  description = "Map of security group IDs"
  value = {
    app      = aws_security_group.app.id
    database = aws_security_group.database.id
    alb      = aws_security_group.alb.id
  }
}

output "resource_arns" {
  description = "ARNs of created resources"
  value = {
    s3_bucket    = aws_s3_bucket.app_data.arn
    kms_key      = aws_kms_key.app.arn
    iam_role     = aws_iam_role.app.arn
    target_group = aws_lb_target_group.app.arn
  }
}
\`\`\`

## 7. Environment Management

Use workspaces and environment-specific configurations.

\`\`\`hcl
# environments/dev/terraform.tfvars
environment = "dev"
project_name = "myapp"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"
public_subnets = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]
private_subnets = [
  "10.0.10.0/24",
  "10.0.20.0/24"
]

# Auto Scaling Configuration
asg_config = {
  min_size         = 1
  max_size         = 3
  desired_capacity = 1
}

# Database Configuration
database_config = {
  engine                  = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  backup_retention_period = 7
}

# environments/prod/terraform.tfvars
environment = "prod"
project_name = "myapp"

vpc_cidr = "10.2.0.0/16"
public_subnets = [
  "10.2.1.0/24",
  "10.2.2.0/24",
  "10.2.3.0/24"
]
private_subnets = [
  "10.2.10.0/24",
  "10.2.20.0/24",
  "10.2.30.0/24"
]

asg_config = {
  min_size         = 3
  max_size         = 10
  desired_capacity = 5
}

database_config = {
  engine                  = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.r6g.large"
  allocated_storage      = 100
  backup_retention_period = 30
}
\`\`\`

## 8. Security & Compliance

Implement security best practices and compliance requirements.

\`\`\`hcl
# security.tf
resource "aws_kms_key" "app" {
  description             = "KMS key for \${var.project_name}-\${var.environment}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_kms_alias" "app" {
  name          = "alias/\${var.project_name}-\${var.environment}"
  target_key_id = aws_kms_key.app.key_id
}

# S3 Bucket with encryption and versioning
resource "aws_s3_bucket" "app_data" {
  bucket = "\${var.project_name}-\${var.environment}-data-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "app_data" {
  bucket = aws_s3_bucket.app_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.app.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "random_id" "bucket_suffix" {
  byte_length = 8
}

# IAM Role with least privilege
resource "aws_iam_role" "app" {
  name = "\${var.project_name}-\${var.environment}-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_policy" "app" {
  name        = "\${var.project_name}-\${var.environment}-app-policy"
  description = "Policy for \${var.project_name} application"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.app_data.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.app.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "app" {
  role       = aws_iam_role.app.name
  policy_arn = aws_iam_policy.app.arn
}
\`\`\`

## 9. Testing & Validation

Implement testing strategies for infrastructure code.

\`\`\`hcl
# tests/integration_test.go
package test

import (
    "testing"
    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/gruntwork-io/terratest/modules/aws"
    "github.com/stretchr/testify/assert"
)

func TestTerraformVPCModule(t *testing.T) {
    t.Parallel()

    // Configure Terraform options
    terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
        TerraformDir: "../modules/vpc",
        Vars: map[string]interface{}{
            "name":            "test-vpc",
            "cidr_block":      "10.0.0.0/16",
            "public_subnets":  []string{"10.0.1.0/24", "10.0.2.0/24"},
            "private_subnets": []string{"10.0.10.0/24", "10.0.20.0/24"},
        },
    })

    // Clean up resources after test
    defer terraform.Destroy(t, terraformOptions)

    // Deploy infrastructure
    terraform.InitAndApply(t, terraformOptions)

    // Validate outputs
    vpcId := terraform.Output(t, terraformOptions, "vpc_id")
    assert.NotEmpty(t, vpcId)

    // Validate VPC exists in AWS
    aws.GetVpcById(t, vpcId, "us-west-2")
}

# Makefile for common operations
.PHONY: init plan apply destroy validate format test

init:
	terraform init

validate:
	terraform validate
	tflint
	checkov -d .

format:
	terraform fmt -recursive

plan:
	terraform plan -var-file="environments/$(ENV)/terraform.tfvars"

apply:
	terraform apply -var-file="environments/$(ENV)/terraform.tfvars"

destroy:
	terraform destroy -var-file="environments/$(ENV)/terraform.tfvars"

test:
	cd tests && go test -v -timeout 30m
\`\`\`

## 10. CI/CD Integration

Integrate Terraform with CI/CD pipelines for automated deployments.

\`\`\`yaml
# .github/workflows/terraform.yml
name: Terraform CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  TF_VERSION: 1.6.0

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      with:
        terraform_version: \${{ env.TF_VERSION }}

    - name: Terraform Format
      run: terraform fmt -check

    - name: Terraform Init
      run: terraform init

    - name: Terraform Validate
      run: terraform validate

    - name: Run TFLint
      uses: terraform-linters/setup-tflint@v3
      with:
        tflint_version: latest

    - name: TFLint
      run: |
        tflint --init
        tflint

  plan:
    runs-on: ubuntu-latest
    needs: validate
    strategy:
      matrix:
        environment: [dev, staging]
    steps:
    - uses: actions/checkout@v4

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      with:
        terraform_version: \${{ env.TF_VERSION }}

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2

    - name: Terraform Init
      run: terraform init

    - name: Terraform Plan
      run: |
        terraform plan \\
          -var-file="environments/\${{ matrix.environment }}/terraform.tfvars" \\
          -out="\${{ matrix.environment }}.tfplan"

    - name: Upload Plan
      uses: actions/upload-artifact@v3
      with:
        name: \${{ matrix.environment }}-plan
        path: \${{ matrix.environment }}.tfplan

  apply:
    runs-on: ubuntu-latest
    needs: plan
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: \${{ steps.apply.outputs.app_url }}
    steps:
    - uses: actions/checkout@v4

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      with:
        terraform_version: \${{ env.TF_VERSION }}

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2

    - name: Terraform Init
      run: terraform init

    - name: Terraform Apply
      id: apply
      run: |
        terraform apply \\
          -var-file="environments/prod/terraform.tfvars" \\
          -auto-approve

        # Capture outputs
        echo "app_url=$(terraform output -raw load_balancer_dns)" >> $GITHUB_OUTPUT
\`\`\`

## Checklist

- [ ] Use consistent naming conventions and resource tagging
- [ ] Implement proper module structure with inputs, outputs, and documentation
- [ ] Configure remote state storage with encryption and locking
- [ ] Use data sources and locals to avoid hardcoded values
- [ ] Implement validation rules for variables and resources
- [ ] Follow security best practices with KMS encryption and IAM policies
- [ ] Use lifecycle rules to prevent accidental resource destruction
- [ ] Implement comprehensive testing with Terratest
- [ ] Set up CI/CD pipelines for automated validation and deployment
- [ ] Use Terraform workspaces or separate state files for environments
- [ ] Keep Terraform and provider versions pinned
- [ ] Implement drift detection and remediation processes
- [ ] Use Terraform Cloud or similar for team collaboration
- [ ] Document infrastructure architecture and deployment procedures
- [ ] Monitor infrastructure costs and implement cost controls`
};