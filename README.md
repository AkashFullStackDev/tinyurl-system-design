# 🚀 TinyURL - Distributed URL Shortener System

A scalable URL shortener built using distributed system principles with Node.js, Cassandra, Redis, and Zookeeper.

---

## 📌 Features

* 🔗 Generate short URLs
* ⚡ Fast redirection with Redis caching
* 📦 Distributed ID generation using Zookeeper
* 🧠 Tunable consistency (Cassandra QUORUM)
* 🔄 Load balancing using Nginx
* 🐳 Fully containerized (Docker)

---

## 🏗️ Architecture

### Components

* **App Layer** → Node.js (multiple instances)
* **Cache Layer** → Redis
* **Database** → Cassandra (distributed)
* **Coordination** → Zookeeper (ID range allocation)
* **Load Balancer** → Nginx
* **Orchestration** → Docker Compose

---

## 🔄 System Flow

### 🔹 URL Shortening

1. Client sends long URL (`POST /shorten`)
2. App fetches ID range from Zookeeper (if needed)
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

Response:

```text
Uptime: <seconds>, Host: <container-id>
```

---

### Create Short URL

```http
POST /shorten
```

---

### Redirect to Original URL

```http
GET /redirect/:code
```

---

### Zookeeper Counter Check

```http
GET /zoo
```

---

### Allocate ID Range

```http
GET /zoo/id
```

---

## 🧠 Database Design (Cassandra)

### Tables

#### 1️⃣ url_by_id

```sql
id bigint PRIMARY KEY,
short_code text,
long_url text,
created_at timestamp
```

---

#### 2️⃣ url_by_short_code

```sql
short_code text PRIMARY KEY,
id bigint,
long_url text,
created_at timestamp
```

---

## ⚖️ Consistency Strategy

Cassandra client configuration:

```js
queryOptions: {
  consistency: cassandra.types.consistencies.quorum
}
```

### 🔹 Meaning

* Read → QUORUM
* Write → QUORUM

### 🔹 Why QUORUM?

* ✅ Strong consistency
* ✅ Tolerates 1 node failure (RF=3)
* ⚖️ Balanced latency vs consistency

---

## 🧠 ID Generation Strategy

* Uses Zookeeper for **range allocation**
* Each node generates IDs locally
* Avoids duplicate IDs across distributed nodes

### Trade-off

* ⚠️ Range loss possible on node failure
* ✅ Guarantees uniqueness

---

## ⚡ Caching Strategy

* Redis used for fast reads
* Reduces load on Cassandra
* Ideal for hot URLs (viral traffic)

---

## 🔥 Scalability

* Horizontal scaling supported
* Multiple app instances (`--scale app=3`)
* Distributed DB (Cassandra cluster)
* Stateless app design

---

## ⚠️ Potential Bottlenecks

* Zookeeper (single instance)
* Hot partitions if cache misses occur
* Cassandra startup latency

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

* `.env` not committed
* Credentials kept outside repo
* Sensitive configs ignored via `.gitignore`

---

## 🚀 Future Improvements

* Replace Zookeeper with Snowflake ID generator
* Add rate limiting
* Add click analytics (with write sharding)
* Multi-region deployment
* Zookeeper clustering

---

## 👨‍💻 Author

Akash Kumar
