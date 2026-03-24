# Webhook-Driven Task Processing Pipeline

## 
This project is a simplified event-driven system (similar to Zapier).

It allows users to:
- Receive webhooks via unique URLs
- Process incoming data using different actions
- Deliver processed results to multiple subscribers

The system is designed using asynchronous job processing with a worker.

---

## Architecture

The system consists of:

1. **App (API Server)**
   - Handles HTTP requests
   - Creates pipelines
   - Receives webhooks
   - Stores jobs in the database

2. **Worker**
   - Polls for pending jobs
   - Processes payloads
   - Sends results to subscribers
   - Handles retries

3. **Database (PostgreSQL)**
   - Stores pipelines, jobs, subscribers, delivery attempts

---

## Tech Stack

- TypeScript
- Node.js (Express)
- PostgreSQL
- Drizzle ORM
- Docker & Docker Compose

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RandJudeh/webhook-pipeline-final-project.git
cd webhook-pipeline-final-project
```
### 2. run the project 
```bash
docker compose up -d --build
```
### 3. Run database migrations
```bash
docker compose exec app npx drizzle-kit migrate
```
### API Documentation

Base URL: http://localhost:3000

### Pipelines

### 1. Create Pipeline POST /pipelines { “name”: “Orders Pipeline”,“sourceSlug”: “orders”, “actionType”: “uppercase” }

Example: 
```bash
curl -X POST http://localhost:3000/pipelines
-H “Content-Type: application/json”
-d ‘{ “name”: “Orders Pipeline”, “sourceSlug”: “orders”, “actionType”:
“uppercase” }’
```

### 2.Get All Pipelines GET /pipelines

Example: 
```bash
curl http://localhost:3000/pipelines
```
### 3.Get Pipeline By ID GET /pipelines/:id
Example: 
```bash
curl http://localhost:3000/pipelines/
```
### 4.Update Pipeline PUT /pipelines/:id

Example: 
```bash 
curl -X PUT http://localhost:3000/pipelines/
-H “Content-Type: application/json”
-d ‘{ “name”: “Updated Orders Pipeline”, “sourceSlug”: “orders”,
“actionType”: “word_count” }’
```
### 5. Delete Pipeline DELETE /pipelines/:id

Example: 
```bash
curl -X DELETE http://localhost:3000/pipelines/
```
### Subscribers

### 1.Add Subscriber POST /subscribers { “pipelineId”: “”, “targetUrl”:“https://webhook.site/your-url” }

Example:
```bash
 curl -X POST http://localhost:3000/subscribers
-H “Content-Type: application/json”
-d ‘{ “pipelineId”: “”, “targetUrl”: “https://webhook.site/your-url” }’
```
### 2.Get All Subscribers GET /subscribers

Example: 
```bash
curl http://localhost:3000/subscribers
```
### 3. Get Subscribers By Pipeline GET /subscribers?pipelineId=

Example: 
```bash 
curl “http://localhost:3000/subscribers?pipelineId=”
```
### Webhooks 
### 1.Send Webhook POST /webhooks/:sourceSlug

Example: 
```bash
curl -X POST http://localhost:3000/webhooks/orders
-H “Content-Type: application/json”
-d ‘{“message”:“hello world”}’
```
- Jobs
### 1.Get All Jobs GET /jobs

Example: 
```bash
curl http://localhost:3000/jobs
```
### 2.Get Job By ID GET /jobs/:id

Example: 
```bash
curl http://localhost:3000/jobs/
```
### Delivery Attempts

### 1.Get All Delivery Attempts GET /delivery-attempts

Example: 
```bash
curl http://localhost:3000/delivery-attempts
```

### 2.Get Delivery Attempts By Job GET /delivery-attempts?jobId=

Example:
```bash
 curl “http://localhost:3000/delivery-attempts?jobId=”
```

### Job Processing Flow
- Webhook received
- Job created with status PENDING
- Worker picks the job
- Job status → PROCESSING
- Payload processed
- Sent to subscribers
- Delivery attempts recorded
- Job marked:
   → COMPLETED 
   → FAILED 


### Supported Actions
- add_timestamp
- uppercase
- reverse
- word_count

## Database Tables
- pipelines
- jobs
- subscribers
- delivery_attempts
- Docker Services
   - app → API server
   - worker → background processor
   - db → PostgreSQL

### Development Tips
   - View worker logs:
   - docker compose logs -f worker
   - Reset database:
   - docker compose down -v

### Notes
   - Jobs are processed asynchronously
   - Each subscriber has retry logic (3 attempts)
   - Failures are recorded in delivery_attempts

