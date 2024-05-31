---
title: "Microservices Architecture comparison"
subtitle: "Event Driven vs Request Driven architecture"
date: "2024-05-12"
---

"Microservices architecture (often shortened to microservices) refers to an architectural style for developing applications. Microservices allow a large application to be separated into smaller independent parts, with each part having its own realm of responsibility. To serve a single user request, a microservices-based application can call on many internal microservices to compose its response." --- https://cloud.google.com/

Why microservices?
- Monolithic application testing and deployment is tough as the entire application has to be tested even if change is in only a single service.
- Scaling monolithic application means in a distributed server entire application has to be scaled as it resides in a single build file leading to more server costs.
- Instead we should only scale the service which is generating higher traffic and not the entire application. - this can be done in a microservice architecture
- Services are coupled leading to increased chances of failure if even one service fails.
Now Microservices do solve the above problems to a great extent but maintaining different services together does add to the complexity of the overall application.

## Request Driven architecture

This architecture operates on a request-response model. The client initiates the request, while the server processes it and sends a response. It's synchronous, meaning the client typically waits for a response.
![images/](/images/cs.jpg)

This architecture is simpler and easier to understand because of the predictable flow of the program.
But in this approach the client and server are more coupled and this might affect fault tolerance. Also a proper rate limiting mechanism must be present on the server to prevent DDOS attacks. In case the server is faced with too many requests then a circuit breaker should 
be present and send an error response to the client.


### Event Driven architecture

In Event-Driven architecture the services can process requests independently ensuring better faut tolerance in the entire system.
It follows asynchronous handling of the request/response. Dashed line below shows publishing to the event queue and dotted lines show subscribing to the event queue to consume the asynchronous response from it.
![images/](/images/eda.jpg)

In the event driven architecture the registration requests are published by the registration client in the registration requests event queue and the registration processing service subscribes to this queue. 
The registration processing service after completing the processing publishes the registraiton completed events to the registration completed event queue which is subscribed to by the registraiotn client.

In event driven architecture the registration client can still publish registration requests even when the registration process service is down whereas in the request driven system the registration client will face constant failure till the registration process service is down unless handled explicitly by sending error response.

Event driven architecture is particularly useful in requests that require multiple services to be used in a stepwise manner in order to complete the intent of the request and the client does not need an urgent response.
For example - consider the whatsapp messaging service - Here one user sends a message, then this user does not wait for the response from other user but is guaranteed that their message was sent to the desired recipient.
Similiarly when the recipient user reads the message, then the sender sees the blue tick to the message sent.

So EDA helps in decoupling microservices, fault tolerant system (one microservice can still perform if other fails), dependency inversion (i.e the publisher does not need to know about who the subscribers and we can add as many subscribers as we want without the publisher knowing).


### Thank You


