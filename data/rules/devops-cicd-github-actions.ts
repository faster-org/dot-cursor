import { Rule } from "../types";

export const rule: Rule = {
	id: "devops-cicd-github-actions",
	slug: "devops-cicd-github-actions",
  title: "DevOps CI/CD with GitHub Actions",
  tags: ["devops", "cicd", "github-actions", "deployment", "automation"],
  languages: ["yaml", "bash"],
  description: "Build robust CI/CD pipelines using GitHub Actions for automated testing, building, and deployment",
  
	categories: ["devops", "deployment"],content: `# DevOps CI/CD with GitHub Actions

## 1. Workflow Fundamentals and Setup

### Basic Workflow Structure
\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]
  schedule:
    - cron: '0 2 * * 1' # Weekly on Monday at 2 AM UTC

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  # Job definitions will be added below
\`\`\`

### Environment Variables and Secrets Management
\`\`\`yaml
# Environment setup
env:
  # Application configuration
  NODE_ENV: production
  API_URL: \${{ vars.API_URL }}
  DATABASE_URL: \${{ secrets.DATABASE_URL }}

  # Build configuration
  DOCKER_BUILDKIT: 1
  COMPOSE_DOCKER_CLI_BUILD: 1

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      version: \${{ steps.version.outputs.version }}
      environment: \${{ steps.env.outputs.environment }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Determine version
        id: version
        run: |
          if [[ "\${{ github.event_name }}" == "release" ]]; then
            echo "version=\${{ github.event.release.tag_name }}" >> $GITHUB_OUTPUT
          else
            echo "version=dev-\${{ github.sha }}" >> $GITHUB_OUTPUT
          fi

      - name: Determine environment
        id: env
        run: |
          if [[ "\${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
          elif [[ "\${{ github.ref }}" == "refs/heads/develop" ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
          fi
\`\`\`

## 2. Node.js Application CI/CD

### Complete Node.js Pipeline
\`\`\`yaml
# .github/workflows/nodejs.yml
name: Node.js CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: |
          npm ci
          npm run build --if-present

      - name: Run linting
        run: |
          npm run lint
          npm run type-check

      - name: Run unit tests
        run: npm run test:unit
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Run E2E tests
        run: |
          npm run build
          npm run start:test &
          sleep 30
          npm run test:e2e
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Generate coverage report
        run: npm run coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: \${{ secrets.CODECOV_TOKEN }}
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=moderate

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run CodeQL analysis
        uses: github/codeql-action/init@v3
        with:
          languages: javascript

      - name: Perform CodeQL analysis
        uses: github/codeql-action/analyze@v3

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    outputs:
      image-tag: \${{ steps.meta.outputs.tags }}
      image-digest: \${{ steps.build.outputs.digest }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: \${{ github.event_name != 'pull_request' }}
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NODE_ENV=production
            BUILD_DATE=\${{ fromJSON(_steps._meta._outputs._json).labels['org.opencontainers.image.created'] }}
            VCS_REF=\${{ github.sha }}

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: [build]
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying \${{ needs.build.outputs.image-tag }} to staging"
          # Add deployment logic here

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [build]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying \${{ needs.build.outputs.image-tag }} to production"
          # Add deployment logic here
\`\`\`

### Advanced Docker Multi-Stage Build
\`\`\`dockerfile
# Dockerfile optimized for CI/CD
# syntax=docker/dockerfile:1

ARG NODE_VERSION=18
ARG ALPINE_VERSION=3.18

# Base stage with common dependencies
FROM node:\${NODE_VERSION}-alpine\${ALPINE_VERSION} AS base
WORKDIR /app

# Install security updates and necessary packages
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        curl \
        && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && \
    npm prune --production

# Runtime stage
FROM base AS runner

ENV NODE_ENV=production
ARG BUILD_DATE
ARG VCS_REF

LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.source=https://github.com/your-org/your-repo \
      org.opencontainers.image.revision=$VCS_REF

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

USER nextjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
\`\`\`

## 3. Infrastructure as Code with Terraform

### Terraform Deployment Pipeline
\`\`\`yaml
# .github/workflows/terraform.yml
name: Terraform Infrastructure

on:
  push:
    branches: [ main ]
    paths: [ 'terraform/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'terraform/**' ]

env:
  TF_VERSION: '1.5.0'
  TF_WORKING_DIR: './terraform'

jobs:
  terraform-validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Terraform Format Check
        run: terraform fmt -check -recursive
        working-directory: \${{ env.TF_WORKING_DIR }}

      - name: Terraform Init
        run: terraform init -backend=false
        working-directory: \${{ env.TF_WORKING_DIR }}

      - name: Terraform Validate
        run: terraform validate
        working-directory: \${{ env.TF_WORKING_DIR }}

      - name: Run tflint
        uses: terraform-linters/setup-tflint@v4
        with:
          tflint_version: latest

      - name: Run tflint
        run: |
          tflint --init
          tflint
        working-directory: \${{ env.TF_WORKING_DIR }}

  terraform-plan:
    if: github.event_name == 'pull_request'
    needs: [terraform-validate]
    runs-on: ubuntu-latest
    env:
      ARM_CLIENT_ID: \${{ secrets.ARM_CLIENT_ID }}
      ARM_CLIENT_SECRET: \${{ secrets.ARM_CLIENT_SECRET }}
      ARM_SUBSCRIPTION_ID: \${{ secrets.ARM_SUBSCRIPTION_ID }}
      ARM_TENANT_ID: \${{ secrets.ARM_TENANT_ID }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Terraform Init
        run: |
          terraform init \
            -backend-config="resource_group_name=\${{ secrets.TF_STATE_RG }}" \
            -backend-config="storage_account_name=\${{ secrets.TF_STATE_SA }}" \
            -backend-config="container_name=\${{ secrets.TF_STATE_CONTAINER }}" \
            -backend-config="key=terraform.tfstate"
        working-directory: \${{ env.TF_WORKING_DIR }}

      - name: Terraform Plan
        run: |
          terraform plan \
            -var="environment=staging" \
            -var="app_version=\${{ github.sha }}" \
            -out=tfplan
        working-directory: \${{ env.TF_WORKING_DIR }}

      - name: Comment PR with plan
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const plan = fs.readFileSync('terraform/tfplan.txt', 'utf8');
            const maxGitHubBodyCharacters = 65536;

            function chunkSubstr(str, size) {
              const numChunks = Math.ceil(str.length / size)
              const chunks = new Array(numChunks)
              for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
                chunks[i] = str.substr(o, size)
              }
              return chunks
            }

            const body = \`## Terraform Plan Results
            \\\`\\\`\\\`
            \${plan}
            \\\`\\\`\\\`
            \`;

            if (body.length > maxGitHubBodyCharacters) {
              const chunks = chunkSubstr(body, maxGitHubBodyCharacters);
              for (let i = 0; i < chunks.length; i++) {
                await github.rest.issues.createComment({
                  issue_number: context.issue.number,
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  body: \`### Terraform Plan Results (Part \${i + 1}/\${chunks.length})
                  \\\`\\\`\\\`
                  \${chunks[i]}
                  \\\`\\\`\\\`
                  \`
                });
              }
            } else {
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            }

  terraform-apply:
    if: github.ref == 'refs/heads/main'
    needs: [terraform-validate]
    runs-on: ubuntu-latest
    environment: production
    env:
      ARM_CLIENT_ID: \${{ secrets.ARM_CLIENT_ID }}
      ARM_CLIENT_SECRET: \${{ secrets.ARM_CLIENT_SECRET }}
      ARM_SUBSCRIPTION_ID: \${{ secrets.ARM_SUBSCRIPTION_ID }}
      ARM_TENANT_ID: \${{ secrets.ARM_TENANT_ID }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Terraform Init
        run: |
          terraform init \
            -backend-config="resource_group_name=\${{ secrets.TF_STATE_RG }}" \
            -backend-config="storage_account_name=\${{ secrets.TF_STATE_SA }}" \
            -backend-config="container_name=\${{ secrets.TF_STATE_CONTAINER }}" \
            -backend-config="key=terraform.tfstate"
        working-directory: \${{ env.TF_WORKING_DIR }}

      - name: Terraform Apply
        run: |
          terraform apply \
            -var="environment=production" \
            -var="app_version=\${{ github.sha }}" \
            -auto-approve
        working-directory: \${{ env.TF_WORKING_DIR }}
\`\`\`

## 4. Kubernetes Deployment Pipeline

### Kubernetes Deployment Workflow
\`\`\`yaml
# .github/workflows/k8s-deploy.yml
name: Kubernetes Deployment

on:
  workflow_run:
    workflows: ["Node.js CI/CD"]
    types: [completed]
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  deploy:
    if: \${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest

    strategy:
      matrix:
        environment: [staging, production]
        include:
          - environment: staging
            branch: develop
            namespace: staging
            replicas: 2
          - environment: production
            branch: main
            namespace: production
            replicas: 3

    environment:
      name: \${{ matrix.environment }}
      url: https://\${{ matrix.environment }}.example.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'

      - name: Setup Helm
        uses: azure/setup-helm@v3
        with:
          version: 'latest'

      - name: Configure kubectl
        run: |
          echo "\${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config
          kubectl config use-context \${{ matrix.environment }}

      - name: Create namespace if not exists
        run: |
          kubectl create namespace \${{ matrix.namespace }} --dry-run=client -o yaml | kubectl apply -f -

      - name: Create image pull secret
        run: |
          kubectl create secret docker-registry ghcr-secret \
            --docker-server=\${{ env.REGISTRY }} \
            --docker-username=\${{ github.actor }} \
            --docker-password=\${{ secrets.GITHUB_TOKEN }} \
            --namespace=\${{ matrix.namespace }} \
            --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy with Helm
        run: |
          helm upgrade --install \${{ github.event.repository.name }} ./k8s/helm \
            --namespace \${{ matrix.namespace }} \
            --set image.repository=\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }} \
            --set image.tag=\${{ github.event.workflow_run.head_sha }} \
            --set replicaCount=\${{ matrix.replicas }} \
            --set environment=\${{ matrix.environment }} \
            --set ingress.host=\${{ matrix.environment }}.example.com \
            --wait --timeout=10m

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/\${{ github.event.repository.name }} \
            --namespace=\${{ matrix.namespace }} \
            --timeout=300s

      - name: Run smoke tests
        run: |
          # Wait for ingress to be ready
          sleep 30
          curl -f https://\${{ matrix.environment }}.example.com/health || exit 1

      - name: Notify deployment success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: "✅ Deployment to \${{ matrix.environment }} successful!"
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}

      - name: Notify deployment failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: "❌ Deployment to \${{ matrix.environment }} failed!"
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}
\`\`\`

### Helm Chart Template
\`\`\`yaml
# k8s/helm/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "app.fullname" . }}
  namespace: {{ .Values.namespace }}
  labels:
    {{- include "app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
  selector:
    matchLabels:
      {{- include "app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
      labels:
        {{- include "app.selectorLabels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "app.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      imagePullSecrets:
        - name: {{ .Values.image.pullSecret }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          env:
            - name: NODE_ENV
              value: {{ .Values.environment }}
            - name: PORT
              value: "3000"
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          envFrom:
            - configMapRef:
                name: {{ include "app.fullname" . }}-config
            - secretRef:
                name: {{ include "app.fullname" . }}-secrets
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
\`\`\`

## 5. Database Migration and Backup

### Database Migration Pipeline
\`\`\`yaml
# .github/workflows/database-migration.yml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
      migration_direction:
        description: 'Migration direction'
        required: true
        default: 'up'
        type: choice
        options:
        - up
        - down
      dry_run:
        description: 'Dry run (preview changes only)'
        required: false
        default: true
        type: boolean

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: \${{ github.event.inputs.environment }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create database backup
        if: github.event.inputs.environment == 'production'
        run: |
          echo "Creating backup before migration..."
          npm run db:backup
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          BACKUP_STORAGE_URL: \${{ secrets.BACKUP_STORAGE_URL }}

      - name: Run migration dry run
        if: github.event.inputs.dry_run == 'true'
        run: |
          echo "🔍 Dry run - Preview of migration changes:"
          npm run migrate:preview
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}

      - name: Run database migration
        if: github.event.inputs.dry_run == 'false'
        run: |
          if [ "\${{ github.event.inputs.migration_direction }}" == "up" ]; then
            echo "⬆️ Running migration up..."
            npm run migrate:up
          else
            echo "⬇️ Running migration down..."
            npm run migrate:down
          fi
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}

      - name: Verify migration
        if: github.event.inputs.dry_run == 'false'
        run: |
          echo "✅ Verifying migration..."
          npm run migrate:status
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}

      - name: Notify teams
        if: github.event.inputs.dry_run == 'false'
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          text: |
            Database migration completed for \${{ github.event.inputs.environment }}
            Direction: \${{ github.event.inputs.migration_direction }}
            Status: \${{ job.status }}
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}
\`\`\`

## 6. Monitoring and Observability

### Performance Monitoring Pipeline
\`\`\`yaml
# .github/workflows/monitoring.yml
name: Performance Monitoring

on:
  schedule:
    - cron: '*/15 * * * *' # Every 15 minutes
  workflow_dispatch:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [staging, production]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://\${{ matrix.environment }}.example.com
            https://\${{ matrix.environment }}.example.com/dashboard
            https://\${{ matrix.environment }}.example.com/profile
          configPath: '.lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Upload results to monitoring system
        run: |
          # Send results to your monitoring system
          curl -X POST "\${{ secrets.MONITORING_WEBHOOK }}" \
            -H "Content-Type: application/json" \
            -d '{
              "environment": "\${{ matrix.environment }}",
              "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
              "lighthouse_score": "'"$LIGHTHOUSE_SCORE"'"
            }'

  uptime-check:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [staging, production]
        endpoint: ['/health', '/api/status', '/metrics']

    steps:
      - name: Check endpoint availability
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" \
            https://\${{ matrix.environment }}.example.com\${{ matrix.endpoint }})

          if [ $response -eq 200 ]; then
            echo "✅ \${{ matrix.endpoint }} is healthy"
          else
            echo "❌ \${{ matrix.endpoint }} returned $response"
            exit 1
          fi

      - name: Report to monitoring
        if: failure()
        run: |
          curl -X POST "\${{ secrets.ALERT_WEBHOOK }}" \
            -H "Content-Type: application/json" \
            -d '{
              "alert": "Endpoint Down",
              "environment": "\${{ matrix.environment }}",
              "endpoint": "\${{ matrix.endpoint }}",
              "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
            }'
\`\`\`

## 7. Reusable Workflows and Actions

### Custom Action for Deployment
\`\`\`yaml
# .github/actions/deploy-app/action.yml
name: 'Deploy Application'
description: 'Deploy application to specified environment'

inputs:
  environment:
    description: 'Target environment'
    required: true
  image-tag:
    description: 'Docker image tag'
    required: true
  kubectl-config:
    description: 'Kubectl configuration'
    required: true
  namespace:
    description: 'Kubernetes namespace'
    required: true
    default: 'default'

outputs:
  deployment-url:
    description: 'URL of the deployed application'
    value: \${{ steps.deploy.outputs.url }}

runs:
  using: 'composite'
  steps:
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'

    - name: Configure kubectl
      shell: bash
      run: |
        echo "\${{ inputs.kubectl-config }}" | base64 -d > $HOME/.kube/config

    - name: Deploy application
      id: deploy
      shell: bash
      run: |
        kubectl set image deployment/app \
          app=\${{ inputs.image-tag }} \
          --namespace=\${{ inputs.namespace }}

        kubectl rollout status deployment/app \
          --namespace=\${{ inputs.namespace }} \
          --timeout=300s

        echo "url=https://\${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT

    - name: Verify deployment
      shell: bash
      run: |
        sleep 30
        curl -f https://\${{ inputs.environment }}.example.com/health
\`\`\`

### Reusable Security Workflow
\`\`\`yaml
# .github/workflows/security-reusable.yml
name: Security Checks

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '18'
      severity-threshold:
        required: false
        type: string
        default: 'high'

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Security audit
        run: |
          npm audit --audit-level=moderate
          npx audit-ci --moderate

      - name: Dependency check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'myproject'
          path: '.'
          format: 'HTML,JSON'

      - name: SAST with Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: auto

      - name: Upload security results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: security-results
          path: |
            reports/
            dependency-check-report.html
\`\`\`

## Checklist for DevOps CI/CD with GitHub Actions

- [ ] Set up comprehensive workflow structure with proper triggers
- [ ] Configure environment variables and secrets management
- [ ] Implement multi-stage testing (unit, integration, E2E)
- [ ] Add security scanning and vulnerability checks
- [ ] Set up Docker multi-stage builds with optimization
- [ ] Configure container registry authentication and push
- [ ] Implement Infrastructure as Code with Terraform
- [ ] Set up Kubernetes deployment with Helm charts
- [ ] Add database migration and backup workflows
- [ ] Configure monitoring and alerting pipelines
- [ ] Implement proper deployment strategies (blue-green, rolling)
- [ ] Set up environment-specific configurations
- [ ] Add performance monitoring and lighthouse checks
- [ ] Create reusable workflows and custom actions
- [ ] Configure proper notification systems (Slack, email)
- [ ] Implement rollback mechanisms for failed deployments`,
	applicationMode: "intelligent",

}