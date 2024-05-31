---
title: "Domain Driven Design: Part 3"
subtitle: "Microservices Architecture using Domain Driven Design"
date: "2024-04-27"
---

In this post I will talk about how we can design our microservice architecture using Domain Driven Design approach in software development.
The concept was given by Eric Evans in his book "Domain Driven Design".

In the early stage of our design we keep our model lean and define required associations to our entities.
Associations are key to identify the potential boundaries defining a bounded context that consisting of aggregate.
These are areas of the domain that exhibit high cohesion within the boundary and low coupling with other contexts.
And loose coupling and high cohesion are the key properties of a microservice architecture.

So we can say that a microservice is equivalent to a bounded context in Domain Driven Design.
With this we can allow domain experts and software professionals to work on individual services related to their domain.

The next thing is to determine how data is exchanged between microservices and how its kept consistent.
There will always be some relationship between different services. For eg - consider an ecommerce store - where we have an order service, shipping service and the account service. The order service will need and identifier for the accountID and shippingID in its database.
And since each microservice manage their own inpendent database, we cannot leverage foreign keys to manage this relationship.

So we link the different subdomains through the identifiers of its entities. And we know from part 1 that the identity of an entity is constant for its entire lifecycle, thus its a low maintenance relationship.
![images/](/images/ddd2.jpg)

Secondly the status has to be synchronized between the order and shipping service. For this we need to keep our services decoupled as well, so we have to do the data synchronization of the 'status' field in an asynchronous manner. We can do this using events. 
![images/](/images/ddd32.jpg) 
The shipping service publishes the status event to the event bus to which the order service subscribes to this topic.
So event driven systems minimize coupling between different services.

### Thank You
