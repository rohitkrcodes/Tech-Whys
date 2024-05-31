---
title: "Row Database vs Column Database"
subtitle: "Comparison between row and column based databases"
date: "2024-03-24"
---

In this post I will talk about the difference between row-based database and column-based database.

#### Row Databases
Row database stores all data related to one row together in disk and memory. It is optimized for reading and writing individual rows efficiently. It is good for OLTP operations and is the de-facto way of storing data.
Examples include PostgreSQL, MySQL etc.

#### Column Databases
It stores all data related to a column together in disk and memory. It is oprimised for reading and computing columns efficiently.
It is good for OLAP operations and used in data analytics where column aggregation is common.
One disadvantage is that writing rows of data can be slow.
Writes of individual rows in column database is difficult because for each row entry there needs to be change of block memory, 
therefore it is recommended to do batch write of row entries where row entries are chunkified into their columns and written in batches to the column database.
Examples include CassandraDB, BigQuery, Snowflake etc.


### Thank You
