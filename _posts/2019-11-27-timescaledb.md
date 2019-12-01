---
title: "Postgres - TimescaleDB"
tags: [database, postgres]
reference:
  - title: 
    link:
---

* TOC 
{:toc}


# Install and run

<pre><code class="bash">
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=1234 timescale/timescaledb:latest-pg9.6
</code></pre>

<pre><code class="perl">
psql -h localhost -U postgres
</code></pre>

## Создание и настройка

<pre><code class="perl">
CREATE database tutorial;

CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE conditions (
    time        TIMESTAMPTZ       NOT NULL,
    location    TEXT              NOT NULL,
    temperature DOUBLE PRECISION  NULL
);

SELECT create_hypertable('conditions', 'time');

</code></pre>

### tutorial nyc 
<a href="https://docs.timescale.com/latest/tutorials/tutorial-hello-nyc">hello-nyc</a>
<pre><code class="perl">
create database nyc_data;
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
</code></pre>

<pre><code class="perl">
psql -U postgres -d nyc_data -h localhost -X < nyc_data.sql
</code></pre>

<pre><code class="perl">
PGPASSWORD=ai73v2ey3mqtgmwh psql -h tsdb-2468e8cb-orlov-a36f.a.timescaledb.io -p 26913 -U tsdbadmin -d nyc_data -c "\COPY rides FROM nyc_data_rides.csv CSV"
psql -U postgres -d nyc_data -h localhost -c "\COPY rides FROM nyc_data_rides.csv CSV"
</code></pre>

### Выборка

<pre><code class="perl">
SELECT date_trunc('day', pickup_datetime) as day, avg(fare_amount)
FROM rides
WHERE passenger_count > 1 AND pickup_datetime < '2016-01-08'
GROUP BY day ORDER BY day;
</code></pre>


