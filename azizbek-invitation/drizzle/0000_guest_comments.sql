CREATE TABLE comments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 60),
 message TEXT NOT NULL CHECK(length(message) BETWEEN 3 AND 1000),
 request_id TEXT NOT NULL UNIQUE,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
