# 🚀 TinyURL - Distributed URL Shortener System

**Latest Release:** v1.0.0
👉 [View Release](https://github.com/AkashFullStackDev/tinyurl-system-design/releases/tag/v1.0.0)

Built to demonstrate real-world distributed system design concepts (similar to TinyURL/Bitly).

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

   * Cache hit → return immediately
   * Cache miss → fetch from Cassandra
3. Cache result in Redis
4. Redirect to original URL

---

## 🧠 API Endpoints

### Health Check

```http
GET /
```

### Create Short URL

```http
POST /shorten
```

### Redirect

```http
GET /redirect/:code
```

### Zookeeper Counter

```http
GET /zoo
```

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
* Handles node failures
* Balanced latency vs reliability

---

## ⚡ Caching Strategy

* Redis used for fast reads
* Reduces Cassandra load
* Improves response latency

---

## 🔥 Scalability

* Horizontal scaling supported
* Multiple app instances (`--scale app=3`)
* Stateless architecture enables easy scaling

---

## 📈 How This System Handles Scale

* Stateless app instances allow horizontal scaling
* Redis reduces database load for frequent reads
* Cassandra handles high write throughput
* Zookeeper prevents ID collisions across nodes
* Nginx distributes traffic efficiently

---

## ⚠️ Trade-offs

* Range loss possible on node crash (accepted for uniqueness)
* Dependency on Zookeeper for ID allocation
* Eventual consistency in distributed setup

---

## 🛡️ Failure Handling

* App node failure → No data loss (stateless design)
* Cassandra node failure → Handled via replication
* Redis failure → Cache miss fallback to DB
* Zookeeper failure → New ID allocation pauses (existing nodes continue)

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

* Node.js → Application layer
* Express.js → API handling
* Cassandra → Distributed database (high write scalability)
* Redis → Caching layer (low latency reads)
* Zookeeper → Distributed coordination (ID range allocation)
* Nginx → Load balancing
* Docker → Containerization

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

* Snowflake-based ID generation
* Rate limiting
* Analytics system (click tracking)
* Multi-region deployment
* Zookeeper clustering

---

## 📦 Version

Current stable release: **v1.0.0**

---

## 👨‍💻 Author

Akash Kumar
