# 🚀 TinyURL - Distributed URL Shortener System

A scalable URL shortener built using distributed system principles with Node.js, Cassandra, Redis, and Zookeeper.

---

## 🧩 Architecture Diagram

![Architecture](./assets/architecture.png)

---

## 🎯 Why This Project?

This project demonstrates real-world distributed system concepts:

* Horizontal scaling
* Distributed ID generation
* Caching strategies
* Database design for high throughput systems
* Fault tolerance and trade-offs

Built to simulate production-grade system design similar to URL shortening services.

---

## 📌 Features

* 🔗 Generate short URLs
* ⚡ Fast redirection with Redis caching
* 📦 Distributed ID generation using Zookeeper
* 🧠 Tunable consistency (Cassandra QUORUM)
* 🔄 Load balancing using Nginx
* 🐳 Fully containerized using Docker

---

## 💡 Highlights

* Multiple app instances using Docker scaling
* Zookeeper-based range allocation (no duplicate IDs)
* Cassandra QUORUM consistency for reliability
* Redis caching for low latency reads

---

## 🏗️ Architecture

### Components

* App Layer → Node.js (multiple instances)
* Cache Layer → Redis
* Database → Cassandra
* Coordination → Zookeeper
* Load Balancer → Nginx
* Containerization → Docker

---

## 🔄 System Flow

### 🔹 URL Shortening

1. Client sends long URL (`POST /shorten`)
2. App fetches ID range from Zookeeper
3. Generates unique ID locally
4. Stores mapping in Cassandra
5. Returns short URL

---

### 🔹 URL Redirection

1. User hits short URL (`GET /redirect/:code`)
2. Check Redis cache
3. If hit → return immediately
4. If miss → fetch from Cassandra
5. Cache result in Redis
6. Redirect to original URL

---

## 🧠 API Endpoints

### Health Check

```http
GET /
```

---

### Create Short URL

```http
POST /shorten
```

---

### Redirect

```http
GET /redirect/:code
```

---

### Zookeeper Counter

```http
GET /zoo
```

---

### Allocate Range

```http
GET /zoo/id
```

---

## 🧠 Database Design (Cassandra)

### url_by_id

```sql
id bigint PRIMARY KEY,
short_code text,
long_url text,
created_at timestamp
```

---

### url_by_short_code

```sql
short_code text PRIMARY KEY,
id bigint,
long_url text,
created_at timestamp
```

---

## ⚖️ Consistency Strategy

```js
queryOptions: {
  consistency: cassandra.types.consistencies.quorum
}
```

### Why QUORUM?

* Strong consistency
* Handles node failure
* Balanced performance

---

## ⚡ Caching Strategy

* Redis for fast reads
* Reduces Cassandra load
* Improves latency

---

## 🔥 Scalability

* Horizontal scaling supported
* Multiple app instances (`--scale app=3`)
* Stateless architecture

---

## ⚠️ Trade-offs

* Range loss possible on node crash
* Zookeeper dependency
* Eventual consistency in distributed setup

---

## 📁 Project Structure

```
src/
  controllers/
  services/
  db/
  config/
routes/
docker-compose.yml
nginx.conf
README.md
```

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Cassandra
* Redis
* Zookeeper
* Nginx
* Docker

---

## ▶️ Run the Project

```bash
docker-compose up --build --scale app=3
```

---

## 🔐 Security

* `.env` is not committed
* Secrets are ignored via `.gitignore`

---

## 🚀 Future Improvements

* Snowflake ID generation
* Rate limiting
* Analytics system
* Multi-region deployment

---

## 👨‍💻 Author

Akash Kumar
