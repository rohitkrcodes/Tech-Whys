---
title: "Domain Driven Design: Part 1"
subtitle: Introduction to Domain Driven Design"
date: "2024-04-20"
---

In this post I will talk about Domain Driven Design approach in software development.
The concept was given by Eric Evans in his book "Domain Driven Design".
The primary focus of this approach is to break down an application to smaller domains that are of interest to various stakeholders in the application.

A domain is a subject of a software system that serves a specific purpose in an application.

Domain Model
It is a simplified and structured abstraction that maps everything of interest in the domain. 
A domain has to be binding in the following areas :
- Ubiqutous Language
- Distil Knowledge
- Share Understanding

eg - if cart is used as a term then shopping list, trolley  etc are not allowed.

Design Phases :-
- Tactical Design - Focus on low level details
- Strategic Design - focus on the bigger picture


#### Entity
An Entity represents a subject with a well defined identity and lifecycle
It needs to have a unique identifier as two entities cannot be considered equal based on their properties. eg - two names cannot be considered as being same user entity.
During the lifecycle of the entity its state might change while its thread continues but the id remains same.

#### Value Object
A value-object represents an element of the model with no conceptual identity.
Two Value-Objects are equal if their properties are equal. eg - two addresses can be considered same if they have same properties.
Value-Objects can be used as a property inside an entity. eg - address inside user entity, so if a user is deleted its associated address is deleted as well.

#### Service
A service is a stateless operation which stands alone in the model wihout any association and utilises various entities to perform a particular operation.
For eg - Order service, payment service etc are examples of services

#### Associations
An association represents a relationship between two objects.
For-eg : Consider an e-commerce store. A product can be associated to multiple orders and an order can have multiple products.
But to suit our domain requriements of order service we can create an order-item property which includes multiple products.
And now an order-item can be associated to only one order.
This gives us a better and simpler model to work with.

#### Aggregates
Aggregates are a group of closely related entities.
This simplifies the model as now allowing references only to the aggregate root instead of entities. This guarantess sanity of the entire aggregate as a whole and prevents us from doing multiple validation checks before any operation on an entity comprising the aggregate.
Also it also helps maintain the rule that "Entities should encapsulate behaviour" and thus the behaviour of an entity is not altered by any service because now a service interacts with an entity via the aggegrate.


#### Factories 
Used by service to create instance of aggregate.
eg - In Order service we can create a factory method to generate an instance of new OrderItem

#### Repository
Used to retrieve particular instances of our entities.
Avoids crowding of methods in the entities. We can create an Order repository instead to fetch orderByID, account etc

#### Strategic Design :-
Decompose our Model into disticnt sub-models by creating bounded contexts.
Within bounded contexts we are able to continuosly build,test and optimmize the model from other contexts.
eg - accountManagemnt, Orderservice, Billing, Shipment etc.
This also defines the competencies of a microservice.
Associations also exist between bounded contexts and they can become complex very quickly.
To address this issue we can create a context map where we document the points of contact between different models.


### Thank You
