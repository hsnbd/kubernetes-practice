allow_k8s_contexts('docker-desktop')

# Build Docker images
docker_build(
    'todo-db',
    'apps/databases/pgsql',
    dockerfile='apps/databases/pgsql/Dockerfile',
)

docker_build(
    'todo-api',
    'apps/todo-api',
    dockerfile='apps/todo-api/Dockerfile',
    # Optional: Enable live_update for faster Go development
    # live_update=[
    #     sync('apps/todo-api', '/app'),
    #     run('go build -o main ./cmd/server', trigger=['**/*.go']),
    # ],
)

docker_build(
    'todo-web',
    'apps/todo-web',
    dockerfile='apps/todo-web/Dockerfile',
    # Optional: Enable live_update for faster React development
    # live_update=[
    #     sync('apps/todo-web/src', '/app/src'),
    # ],
)

docker_build(
    'ads-manager',
    'apps/ads-manager-py',
    dockerfile='apps/ads-manager-py/Dockerfile',
    # Optional: Enable live_update for faster Python development
    # live_update=[
    #     sync('apps/ads-manager-py/app', '/app/app'),
    # ],
)

# Load Kubernetes manifests
# Uncomment and adjust paths once you create your Kubernetes manifests
k8s_yaml('kuberaw/deployments/database-pgsql.yaml')
k8s_yaml('kuberaw/deployments/todo-api.yaml')
k8s_yaml('kuberaw/deployments/todo-web.yaml')
k8s_yaml('kuberaw/deployments/ads-manager-py.yaml')
# k8s_yaml('kuberaw/deployments/ingress.yaml')

# Port forwards (uncomment once k8s resources are deployed)
# k8s_resource('postgres', port_forwards='5432:5432')
# k8s_resource('todo-api', port_forwards='8080:8080')
k8s_resource('frontend', port_forwards='3000:80')
