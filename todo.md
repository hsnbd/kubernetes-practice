# ✅ Kubernetes Practice Checklist

This checklist helps you build hands-on skills from Kubernetes basics to advanced topics.

---

## 🌱 1. Kubernetes Fundamentals
- [ ] Understand what Kubernetes is and what problems it solves
- [ ] Learn Kubernetes architecture: control plane vs. worker nodes
- [ ] Install a local cluster (Minikube, Kind, or k3d)
- [ ] Install and configure `kubectl`
- [ ] Understand the Kubernetes API and `kubectl explain`

---

## 📦 2. Core API Primitives
- [ ] Create and manage Pods with YAML
- [ ] Use ReplicaSets and Deployments
- [ ] Understand DaemonSets and StatefulSets
- [ ] Create Jobs and CronJobs
- [ ] Use labels and selectors for grouping and filtering resources

---

## 🛠️ 3. Configuration and Secrets
- [ ] Use ConfigMaps to inject configuration
- [ ] Use Secrets for sensitive data
- [ ] Mount ConfigMaps and Secrets as volumes
- [ ] Inject environment variables from ConfigMaps/Secrets

---

## 🔌 4. Networking and Services
- [ ] Understand ClusterIP, NodePort, and LoadBalancer types
- [ ] Use `kubectl port-forward` to debug services
- [ ] Create and test Ingress resources
- [ ] Set up and test Ingress controllers (e.g., NGINX Ingress)
- [ ] Understand how DNS and Service discovery work

---

## ⚙️ 5. Scheduling and Resource Management
- [ ] Set resource requests and limits (CPU/memory)
- [ ] Configure liveness, readiness, and startup probes
- [ ] Use affinity and anti-affinity rules
- [ ] Use taints, tolerations, and node selectors

---

## 💾 6. Storage Management
- [ ] Understand Volumes and how they are attached to Pods
- [ ] Use PersistentVolumes (PV) and PersistentVolumeClaims (PVC)
- [ ] Explore StorageClasses and dynamic provisioning
- [ ] Use volume types like `emptyDir`, `hostPath`, and `configMap`

---

## 🕵️ 7. Observability and Debugging
- [ ] Use `kubectl logs`, `describe`, and `exec` for debugging
- [ ] Use `kubectl get events` to troubleshoot issues
- [ ] Install metrics-server and use `kubectl top`
- [ ] Use ephemeral containers for debugging
- [ ] Enable audit logs and review logs from the control plane

---

## 🔐 8. Security and RBAC
- [ ] Understand Role, ClusterRole, RoleBinding, ClusterRoleBinding
- [ ] Create and assign ServiceAccounts
- [ ] Use SecurityContexts and PodSecurityPolicies (or Pod Security Standards)
- [ ] Apply NetworkPolicies to restrict traffic

---

## 📦 9. Helm and Advanced Packaging
- [ ] Install and use Helm to deploy charts
- [ ] Understand Helm values and templating
- [ ] Create and package your own Helm chart
- [ ] Use chart dependencies and `requirements.yaml`

---

## 🚀 10. GitOps and CI/CD Integration
- [ ] Set up GitOps with ArgoCD or Flux
- [ ] Use `kubectl apply` or Helm in GitHub Actions/GitLab CI
- [ ] Automate deployment pipelines to your cluster
- [ ] Use Kustomize for environment-specific overlays

---

## 🧰 11. Useful Tools
- [ ] Use `k9s` for terminal-based cluster interaction
- [ ] Use `lens` for GUI-based cluster management
- [ ] Explore `kubectx`/`kubens` for context switching
- [ ] Use `stern` for tailing logs across pods

---

## 🧪 12. Practice Projects
- [ ] Deploy a multi-tier web app (frontend + backend + DB)
- [ ] Deploy Prometheus + Grafana for monitoring
- [ ] Deploy an app with horizontal pod autoscaling
- [ ] Configure canary/blue-green deployments
- [ ] Simulate a node failure and observe pod rescheduling

---

## 📚 Resources
- [ ] [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [ ] [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
- [ ] [Learn Kubernetes on Katacoda](https://katacoda.com/courses/kubernetes)
- [ ] [Kubernetes Up & Running](https://www.oreilly.com/library/view/kubernetes-up-and/9781491935675/)

