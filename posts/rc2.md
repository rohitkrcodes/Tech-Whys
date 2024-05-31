---
title: "Database Replication"
subtitle: "Comparison among database replication strategies"
date: "2024-03-27"
---

In this post I will talk about different types of database replication strategies.

#### Why we need Database Replication
- Greater Durability in the event of data loss
- Keep the system running even if some database machine goes down
- Keep data geographically close to users
- Comply with different data laws
- Serve read queries faster - because reads are much higher than writes in most of the applications

#### Types of Replication 
#### Leader-Follower Replication pattern
All writes are handled by leader.The backend server only cares to write to the leader db. The leader db is responsible for writing to the replicas asynchronously. There can be replication lag from the leader to the follower, therefore leader will have upto-date data whereas the follower might have some delay to get upto-date data.
To handle consostency during peak traffic, kafka clusters can be used.
eg - Most relational databases like MySQL, PostgreSQL


#### Leader-less Replication pattern
It consists of peer nodes, all of which accept reads and writes, hence no soingle pointof failure and a decentralised design allows better availablity. 
Although some nodes can have stale data. This alters consistency. So asynchronous bakcground jobs can be run to look for data differences amongst nodes and in most cases the client can figure out the latest data via fetching from an updated data and writes this latest data to the stale nodes. 
eg - Most non-relational databases like CassadraDB, DynamoDB


### Thank You
