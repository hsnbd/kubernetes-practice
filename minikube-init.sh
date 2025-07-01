kubectl config use-context minikube

if minikube status | grep -q "Running"; then
  echo "Minikube is already running."
else
  echo "Minikube is not running. Starting Minikube..."
  minikube start
fi

minikube addons enable metrics-server

minikube dashboard