cd apps/frontend && docker build -t bakerhasanfn/kube-frontend:latest .



minikube image load bakerhasanfn/kube-frontend:latest




kubectl run kube-frontend --image=bakerhasanfn/kube-frontend:latest --image-pull-policy=Never --port=3000




kubectl expose pod kube-frontend --type=NodePort --port=300




minikube service kube-frontend