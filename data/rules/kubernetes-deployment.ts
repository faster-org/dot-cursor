import { Rule } from '../types';

export const rule: Rule = {
  id: 'kubernetes-deployment',
  slug: 'kubernetes-deployment',
  name: 'Kubernetes Deployment',
  description: 'Best practices for Kubernetes application deployment and management',
  tags: ['kubernetes', 'k8s', 'deployment', 'containers', 'orchestration'],
  votes: { up: 0, down: 0 },
  featured: false,
  createdAt: '2024-01-01',
  content: `# Kubernetes Deployment Best Practices

## 1. Deployment Configuration

Create robust deployment manifests with proper resource management.

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
  labels:
    app: my-app
    version: v1.0.0
    environment: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: v1.0.0
    spec:
      serviceAccountName: my-app-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 2000
      containers:
      - name: my-app
        image: my-registry/my-app:v1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        - containerPort: 9090
          name: metrics
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: log-level
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        volumeMounts:
        - name: app-data
          mountPath: /data
        - name: app-config
          mountPath: /etc/config
          readOnly: true
      volumes:
      - name: app-data
        persistentVolumeClaim:
          claimName: app-data-pvc
      - name: app-config
        configMap:
          name: app-config
      nodeSelector:
        kubernetes.io/os: linux
      tolerations:
      - key: "node-type"
        operator: "Equal"
        value: "application"
        effect: "NoSchedule"
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - my-app
              topologyKey: kubernetes.io/hostname
\`\`\`

## 2. Service and Networking

Configure services and ingress for proper networking and load balancing.

\`\`\`yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  labels:
    app: my-app
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  - port: 9090
    targetPort: 9090
    protocol: TCP
    name: metrics
  selector:
    app: my-app

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-rps: "10"
spec:
  tls:
  - hosts:
    - my-app.example.com
    secretName: my-app-tls
  rules:
  - host: my-app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80

---
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: my-app-network-policy
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9090
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
\`\`\`

## 3. ConfigMaps and Secrets

Manage application configuration and sensitive data securely.

\`\`\`yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  labels:
    app: my-app
data:
  log-level: "INFO"
  app.properties: |
    server.port=8080
    management.endpoints.web.exposure.include=health,metrics,prometheus
    management.endpoint.health.show-details=always
    logging.level.com.example.myapp=INFO
    spring.profiles.active=production

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  labels:
    app: my-app
type: Opaque
data:
  database-url: cG9zdGdyZXNxbDovL3VzZXI6cGFzc3dvcmRAZGItaG9zdDo1NDMyL215YXBwZGI=
  api-key: bXktc2VjcmV0LWFwaS1rZXk=
  jwt-secret: bXktand0LXNlY3JldA==

---
# sealed-secret.yaml (using Sealed Secrets)
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: app-secrets-sealed
  namespace: default
spec:
  encryptedData:
    database-url: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEQAx...
    api-key: AgAKAoiQm+/LbxSRm9kfZdyDcW8...
  template:
    metadata:
      name: app-secrets
      namespace: default
    type: Opaque
\`\`\`

## 4. Persistent Storage

Configure persistent volumes and storage classes for data persistence.

\`\`\`yaml
# storage-class.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer

---
# persistent-volume-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data-pvc
  labels:
    app: my-app
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 10Gi

---
# stateful-set.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: database-headless
  replicas: 3
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 50Gi
\`\`\`

## 5. Resource Management and Autoscaling

Implement horizontal and vertical pod autoscaling for optimal resource usage.

\`\`\`yaml
# horizontal-pod-autoscaler.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15

---
# vertical-pod-autoscaler.yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: my-app
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources: ["cpu", "memory"]

---
# pod-disruption-budget.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-app-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: my-app
\`\`\`

## 6. Security and RBAC

Implement proper security controls and role-based access control.

\`\`\`yaml
# service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app-sa
  labels:
    app: my-app
automountServiceAccountToken: false

---
# cluster-role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: my-app-role
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]

---
# cluster-role-binding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: my-app-role-binding
subjects:
- kind: ServiceAccount
  name: my-app-sa
  namespace: default
roleRef:
  kind: ClusterRole
  name: my-app-role
  apiGroup: rbac.authorization.k8s.io

---
# security-context-constraints.yaml (OpenShift)
apiVersion: security.openshift.io/v1
kind: SecurityContextConstraints
metadata:
  name: my-app-scc
allowHostDirVolumePlugin: false
allowHostIPC: false
allowHostNetwork: false
allowHostPID: false
allowHostPorts: false
allowPrivilegedContainer: false
allowedCapabilities: []
defaultAddCapabilities: []
fsGroup:
  type: MustRunAs
  ranges:
  - min: 1000
  - max: 2000
runAsUser:
  type: MustRunAsNonRoot
seLinuxContext:
  type: MustRunAs
supplementalGroups:
  type: MustRunAs
  ranges:
  - min: 1000
  - max: 2000
volumes:
- configMap
- downwardAPI
- emptyDir
- persistentVolumeClaim
- projected
- secret
\`\`\`

## 7. Monitoring and Observability

Set up comprehensive monitoring and logging for your applications.

\`\`\`yaml
# service-monitor.yaml (Prometheus)
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-metrics
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics

---
# prometheus-rule.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: my-app-alerts
  labels:
    app: my-app
spec:
  groups:
  - name: my-app.rules
    rules:
    - alert: HighCPUUsage
      expr: |
        rate(container_cpu_usage_seconds_total{pod=~"my-app-.*"}[5m]) * 100 > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage detected"
        description: "CPU usage is above 80% for {{ $labels.pod }}"
    - alert: HighMemoryUsage
      expr: |
        (container_memory_working_set_bytes{pod=~"my-app-.*"} / container_spec_memory_limit_bytes{pod=~"my-app-.*"}) * 100 > 85
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High memory usage detected"
        description: "Memory usage is above 85% for {{ $labels.pod }}"
    - alert: PodCrashLooping
      expr: |
        rate(kube_pod_container_status_restarts_total{pod=~"my-app-.*"}[15m]) > 0
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "Pod is crash looping"
        description: "Pod {{ $labels.pod }} is restarting frequently"

---
# grafana-dashboard.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-app-dashboard
  labels:
    grafana_dashboard: "1"
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "My App Dashboard",
        "tags": ["kubernetes", "my-app"],
        "panels": [
          {
            "title": "CPU Usage",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(container_cpu_usage_seconds_total{pod=~"my-app-.*"}[5m]) * 100"
              }
            ]
          },
          {
            "title": "Memory Usage",
            "type": "graph",
            "targets": [
              {
                "expr": "container_memory_working_set_bytes{pod=~"my-app-.*"}"
              }
            ]
          }
        ]
      }
    }
\`\`\`

## 8. CI/CD Integration

Integrate Kubernetes deployments with CI/CD pipelines.

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Build Docker Image
      run: |
        docker build -t \${{ secrets.REGISTRY }}/my-app:\${{ github.sha }} .
        docker push \${{ secrets.REGISTRY }}/my-app:\${{ github.sha }}

    - name: Setup Kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.28.0'

    - name: Deploy to Kubernetes
      run: |
        echo "\${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig

        # Update image tag
        kubectl set image deployment/my-app my-app=\${{ secrets.REGISTRY }}/my-app:\${{ github.sha }}

        # Wait for rollout
        kubectl rollout status deployment/my-app --timeout=300s

        # Verify deployment
        kubectl get pods -l app=my-app

---
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
- ingress.yaml
- configmap.yaml

images:
- name: my-registry/my-app
  newTag: latest

replicas:
- name: my-app
  count: 3

configMapGenerator:
- name: app-config
  files:
  - config/app.properties
  - config/log4j2.xml

secretGenerator:
- name: app-secrets
  envs:
  - secrets.env

commonLabels:
  app: my-app
  version: v1.0.0
\`\`\`

## 9. Backup and Disaster Recovery

Implement backup strategies and disaster recovery procedures.

\`\`\`yaml
# velero-backup.yaml
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: my-app-backup
  namespace: velero
spec:
  includedNamespaces:
  - default
  includedResources:
  - deployments
  - services
  - configmaps
  - secrets
  - persistentvolumeclaims
  labelSelector:
    matchLabels:
      app: my-app
  storageLocation: default
  volumeSnapshotLocations:
  - default
  ttl: 720h0m0s

---
# velero-schedule.yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: my-app-daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
    - default
    labelSelector:
      matchLabels:
        app: my-app
    storageLocation: default
    ttl: 168h0m0s

---
# etcd-backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: etcd-backup
  namespace: kube-system
spec:
  schedule: "0 3 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: etcd-backup
            image: k8s.gcr.io/etcd:3.5.7-0
            command:
            - /bin/sh
            - -c
            - |
              ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-$(date +%Y%m%d-%H%M%S).db \\
                --endpoints=https://127.0.0.1:2379 \\
                --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
                --cert=/etc/kubernetes/pki/etcd/peer.crt \\
                --key=/etc/kubernetes/pki/etcd/peer.key
            volumeMounts:
            - name: etcd-certs
              mountPath: /etc/kubernetes/pki/etcd
              readOnly: true
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: etcd-certs
            hostPath:
              path: /etc/kubernetes/pki/etcd
          - name: backup-storage
            persistentVolumeClaim:
              claimName: etcd-backup-pvc
          restartPolicy: OnFailure
          hostNetwork: true
\`\`\`

## 10. Multi-Environment Management

Manage multiple environments with proper configuration and promotion strategies.

\`\`\`yaml
# environments/base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../manifests

commonLabels:
  app: my-app

---
# environments/staging/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../base

namePrefix: staging-

replicas:
- name: my-app
  count: 1

configMapGenerator:
- name: app-config
  behavior: merge
  literals:
  - LOG_LEVEL=DEBUG
  - ENVIRONMENT=staging

---
# environments/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../base

namePrefix: prod-

replicas:
- name: my-app
  count: 5

configMapGenerator:
- name: app-config
  behavior: merge
  literals:
  - LOG_LEVEL=INFO
  - ENVIRONMENT=production

images:
- name: my-registry/my-app
  newTag: v1.0.0

---
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-app-k8s
    targetRevision: HEAD
    path: environments/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
\`\`\`

## Checklist

- [ ] Configure deployments with proper resource limits and health checks
- [ ] Set up services and ingress for networking and load balancing
- [ ] Manage configuration and secrets securely
- [ ] Implement persistent storage for stateful applications
- [ ] Configure autoscaling and resource management
- [ ] Implement proper security controls and RBAC
- [ ] Set up comprehensive monitoring and alerting
- [ ] Integrate with CI/CD pipelines for automated deployments
- [ ] Implement backup and disaster recovery strategies
- [ ] Use Kustomize or Helm for multi-environment management
- [ ] Follow Kubernetes naming conventions and labeling standards
- [ ] Implement network policies for security
- [ ] Use pod disruption budgets for high availability
- [ ] Monitor resource usage and optimize for cost
- [ ] Regularly update and patch container images and Kubernetes components`,
	applicationMode: "intelligent",

}