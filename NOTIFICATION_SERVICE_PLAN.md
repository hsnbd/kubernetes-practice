# Notification Service - High-Level Overview

## Architecture

Fully event-driven notification system using **Go + Kafka + Channel Workers**

```
┌─────────────┐
│ Todo API    │──┐
│ Ads Manager │  │
│ Auth Events │  │  Produce events
└─────────────┘  │
                 ▼
         ┌──────────────┐         ┌──────────────────────┐         ┌─────────────────┐
         │    Kafka     │────────▶│  Notification API    │────────▶│     Kafka       │
         │ Topic:       │         │  (Event Processor)   │         │ Channel Topics: │
         │ app.events   │         │  - Consume events    │         │ - notify.email  │
         └──────────────┘         │  - Check prefs       │         │ - notify.push   │
                                  │  - Render templates  │         │ - notify.webhook│
                                  │  - Route to channels │         │ - notify.inapp  │
                                  └──────────────────────┘         └─────────────────┘
                                           │                                 │
                                           │                                 │
                                           ▼                                 ▼
                                  ┌─────────────────┐              ┌──────────────────┐
                                  │   PostgreSQL    │              │ Channel Workers  │
                                  │  - preferences  │              │  - Email Worker  │
                                  │  - templates    │              │  - Push Worker   │
                                  │  - history      │◀─────────────│  - Webhook Worker│
                                  └─────────────────┘              │  - InApp Worker  │
                                                                   └──────────────────┘
                                                                            │
                                                                            ▼
                                                                   ┌──────────────────┐
                                                                   │  External APIs   │
                                                                   │  - SendGrid      │
                                                                   │  - Firebase FCM  │
                                                                   │  - HTTP Webhooks │
                                                                   └──────────────────┘
```

**Event Flow:**
1. **Todo API** produces events to `app.events` topic (todo_created, todo_shared, etc.)
2. **Notification API** consumes from `app.events`, applies business logic (preferences, templates)
3. **Notification API** produces channel-specific messages to `notify.*` topics
4. **Channel Workers** consume from their respective topics and deliver notifications

## Components

### 1. **Notification API (Event Processor)**
- **Kafka consumer** - consumes from `app.events` topic
- **Business logic** - checks user preferences, renders templates
- **Kafka producer** - publishes to channel-specific topics (`notify.*`)
- REST endpoints: `/api/preferences`, `/api/history` (for frontend)
- JWT authentication (shared with todo-api)

### 2. **Kafka Message Broker**
- **Input topic**: `app.events` - raw events from all services (todo_created, user_registered, etc.)
- **Output topics**: `notify.email`, `notify.push`, `notify.webhook`, `notify.inapp`
- Fully decouples services - no HTTP dependencies between microservices
- Enables independent worker scaling
- Persists messages for reliability and replay capability

### 3. **Channel Workers (4 Go Services)**
- **Email Worker**: SendGrid/SMTP integration, retry logic
- **Push Worker**: Firebase Cloud Messaging (FCM), device token management
- **Webhook Worker**: HTTP POST with HMAC signatures
- **In-App Worker**: Database writes, real-time UI notifications

### 4. **PostgreSQL Database**
- `notification_preferences` - user settings per channel/event
- `notification_templates` - message templates
- `notification_history` - delivery tracking
- `push_tokens` - device registration

### 5. **Frontend Integration (React)**
- Bell icon with unread count
- Notification dropdown panel
- Preferences settings page (matrix UI)

## Event Triggers

- **Todo Created/Updated/Completed** → Notify user
- **Todo Shared** → Notify recipient
- **User Registered/Login** → Welcome/security alerts
- **Scheduled Reminders** → Cron job for due dates

## Key Features

✅ **Multi-channel**: Email, Push, Webhook, In-app  
✅ **User preferences**: Granular control per event type × channel  
✅ **Message templates**: Variable substitution  
✅ **Delivery tracking**: Status history  
✅ **Retry logic**: Exponential backoff  
✅ **Horizontal scaling**: Independent worker scaling  
✅ **Future-ready**: Protobuf support in Go

## Implementation Phases

### Phase 1: Infrastructure (Database + Kafka)
1. Add PostgreSQL schema (`05-notifications-schema.sql`)
2. Deploy Zookeeper StatefulSet with 1Gi PVC
3. Deploy Kafka StatefulSet with 5Gi PVC
4. Create Kafka topics via auto-creation
Event Processor
5. Go service with Gin framework (for REST endpoints only)
6. **Kafka consumer** - consume from `app.events` topic
7. **Kafka producer** - produce to channel-specific topics
8. Business logic: preference checking, template rendering
9. REST endpoints for `/api/preferences`, `/api/history` (frontend use only)
10. JWT auth middleware (shared secret)
9. Kubernetes deployment with 2 replicas
1. Email worker (SendGrid/SMTP) - consumes from `notify.email`
12. Push worker (Firebase FCM) - consumes from `notify.push`
13. Webhook worker (HMAC signatures) - consumes from `notify.webhook`
14. In-app worker (DB writes) - consumes from `notify.inapp`
15. Kubernetes deployments for each worker

### Phase 4: Integration
16. **Add Kafka producer to todo-api** - produce events to `app.events`
17. **Add Kafka producer to ads-manager** - produce events to `app.events`
18. Scheduled reminder cron job (produces to `app.events`)
19. Frontend notification bell + panel
20. Scheduled reminder cron job
17. Frontend notification bell + panel
18. Preferences settings page
21. Health/readiness endpoints (all services)
22. Structured logging (JSON format)
23. Kafka consumer lag metrics
24. Event processing metrics (events/sec, processing time)
20. Structured logging
21. Kafka consumer lag metrics

## Technical Stack

- **Language**: Go 1.21
- **Framework**: Gin (HTTP), Kafka-Go (messaging)
- **Database**: PostgreSQL (shared with todo-api)
- **Message Broker**: Apache Kafka 7.5
- **Auth**: JWT (shared secret)
- **Deployment**: Kubernetes StatefulSets & Deployments
- **External Services**: SendGrid, Firebase FCM

##Fully Event-Driven Architecture**
- **Zero HTTP coupling**: Todo API doesn't know about Notification API
- **Non-blocking**: Todo creation doesn't wait for notification processing
- **Resilient**: Failed notifications retry automatically via Kafka
- **Scalable**: Add workers to handle load spikes independently
- **Replayable**: Can replay events from Kafka for debugging or reprocessingr email delivery
- Resilient: Failed notifications retry automatically
- Scalable: Add workers to handle load spikes

**Go Language**
- Matches existing todo-api patterns
- Two-Stage Kafka Architecture**
- **Stage 1**: `app.events` - centralized event bus for all application events
- **Stage 2**: `notify.*` - channel-specific topics after processing
- Benefits:
  - Single source of truth for all events
  - Notification API can be restarted without losing events
  - Workers consume only relevant messages (filtered by channel)
  - Independent scaling per channel
  - Clear monitoring and metrics per topic
- Workers consume only relevant messages
- Independent scaling per channel
- Clear monitoring and metrics per topic
- Easier debugging and troubleshooting

## Scaling Strategy

| Component | Development | Production |
|-----------|------------|------------|
| Kafka | 1 replica | 3 replicas, 6 partitions |
| Notification API | 1-2 replicas | 3-10 replicas (HPA on CPU 70%) |
| Email Worker | 1 replica | 2-5 replicas (highest volume) |
| Push Worker | 1 replica | 2-3 replicas |
| Webhook Worker | 1 replica | 1-2 replicas |
| In-App Worker | 1 replica | 1-2 replicas |

## Quick Start Commands

```bash
# 1. Apply database schema
kubectl exec -it database-pgsql-0 -- psql -U postgres -d todo_db -f /docker-entrypoint-initdb.d/05-notifications-schema.sql

# 2. Deploy Kafka infrastructure
kubectl apply -f kuberaw/deployments/zookeeper.yaml
kubectl apply -f kuberaw/deployments/kafka.yaml

# 3. Wait for Kafka to be ready
kubectl wait --for=condition=ready pod -l app=kafka --timeout=180s

# 4. Deploy notification service
kubectl apply -f kuberaw/deployments/notification-service.yaml

# 5. Deploy workers
kubectl apply -f kuberaw/deployments/notification-worker-email.yaml
kubectl apply -f kuberaw/deployments/notification-worker-push.yaml
kubecProduce test event to Kafka (simulate todo-api)
kubectl exec -it kafka-0 -- kafka-console-producer.sh \
  --broker-list localhost:9092 \
  --topic app.events
# Then type:
# {"event_type":"todo_created","user_id":1,"data":{"todo_id":123,"title":"Test Todo"}}

# 8. Verify notification API consumed and routed the event
kubectl logs -f deployment/notification-service

# 9. Check channel-specific topics
kubectl exec -it kafka-0 -- kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic notify.inapp \
  --from-beginning

# 7. Test notification API
kubectl port-forward svc/notification-service 8080:8080
curl -X POST http://localhost:8080/api/notify \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "event_type": "todo_created", "data": {"title": "Test"}}'
```

## Next Steps

1. Review this high-level plan
2. Start with Phase 1 (Infrastructure)
3. Test each phase before moving forward
4. Monitor logs and metrics
5. Iterate and improve based on real usage
