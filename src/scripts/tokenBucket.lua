local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])
if not ttl then
    return 0
end
ttl = math.floor(ttl)

local data = redis.call("GET", key)

local tokens
local lastRefill

if not data then
    tokens = capacity - 1
    lastRefill = now
else
    local parsed = cjson.decode(data)
    tokens = tonumber(parsed.tokens)
    lastRefill = tonumber(parsed.lastRefill)

    local timeDiff = (now - lastRefill) / 1000
    local refill = math.floor(timeDiff * refillRate)

    if refill > 0 then
        tokens = math.min(capacity, tokens + refill)
        lastRefill = now
    end

    if tokens > 0 then
        tokens = tokens - 1
    else
        return 0
    end
end

local newData = cjson.encode({
    tokens = tokens,
    lastRefill = lastRefill
})

redis.call("SET", key, newData, "EX", ttl)

return 1