---
title: "Domain Driven Design: Part 2"
subtitle: "Aggregates in Domain Driven Design"
date: "2024-04-24"
---

In this post I will talk about 'Aggegates' and its role in Domain Driven Design approach in software development.
The concept was given by Eric Evans in his book "Domain Driven Design".

#### Definition
An Aggegate is a cluster of associated objects that we treat as a unit for the purpose of data changes.
Aggegates encapsulate data and enforce business rules to ensure its integrity.

Each Aggregate has a boundary that identifies its members, and the root of the aggregate. Root of the aggregate is the only member that outside objects are allowed to hold references to.


#### Example
Let us take the example of e-commerce store. Suppose we have a order and product class. Now one order can have mulitple products while one product can be associated to multiple orders. So we define another class 'OrderItem' which corresponds to individual products in a particular order.

```bash
type Order struct{
    ID string
    OrderItems []*OrderItem
    Weight float64  // < 100 kg
}

type OrderItem struct{
    ProductID string
    Quantity int32
    Weight float64
}

type Product struct{
    ID string
    Name string
    Weight float64
}

func (o *Order) addOrderItem(item *OrderItem) error{
    if o.Weight + item.Weight > 100.0{
        return fmt.Errorf("weight exceeded for order %s\n",o.ID)
    } 

    o.OrderItems = append(o.OrderItems,item)
    return nil
}
```

Now suppose the ecommerce store has a rule that no order can cross a weight limit. So we need to track the weight sum of an order by summing over the weights of its OrderItems. This logic can be put inside the Order class itself and thus prevents an order from crossing the weight limit. 

Now suppose we enable a public method for the OrderItem that can update its quantity. Then any 'xyz' service from outside can change the order's weight without passing through its weight-sum check because it can directly access the quantity method of OrderItem.
This is why any outside service should only access the aggregate and not bypass its business rules.
This ensures integrity of the order aggregate within its bounded context.

![images/](/images/ddd2.jpg)

Secondly this also optimizes the number of associations. Any outside service can access an aggregate resource only through its root i.e. service 'xyz' can access a product entity's data only via the order class in the present case. This optimizes the number of associations and validation checks and also maintains consistency across an aggregate. 


### Thank You
