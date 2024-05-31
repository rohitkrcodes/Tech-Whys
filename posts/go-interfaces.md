---
title: "Go Interfaces"
subtitle: "Dependency Injection with Go interfaces"
date: "2024-04-29"
---

An interface type is defined as a set of method signatures.
A value of interface type can hold any value that implements those methods. So an interface specifies abstract methods in terms of methods.
Concrete types offer methods that satisfy the interface.

```bash
// interface
type Shape interface {
  area() float32
}

 // struct to implement interface
type Rectangle struct {
  length, breadth float32
}

// use struct to implement area() of interface
func (r Rectangle) area() float32 {
  return r.length * r.breadth
}

// access method of the interface
func calculate(s Shape) {
  fmt.Println("Area:", s.area())
}

// main function
func main() {
 
  // assigns value to struct members
  rect := Rectangle{7, 4}

  // call calculate() with struct variable rect
  calculate(rect)       // Output- Area: 28
}
```

As seen above we have a Shape interface and a Rectangle struct that implements its area() method. Inside the calcualte function we can call the area method corresponding to the implementation of the Rectangle struct when we pass the rect object as parameter to the calculate function.

### Dependency Injection
Go interfaces are particularly helpful in using Dependency injection principle. The Dependency Injection principle allows our business logic to be decoupled from the other dependencies (like database, logger etc). This allows flexibility when changing our dependencies (eg - changing from one database to another etc.). Also it helps in 'Test-Driven-Development' - as we can always create a mock interface for any of our dependency and pass onto the business logic.

Let us see an example of an application which has a logger dependency and we use a logger interface as shown below 

```bash
type logger interface {
	log(msg string)
}
```

Let us have two different types of logger to choose from as shown below

```bash
type consolelogger struct{}

type filelogger struct{}
```

Now let us make both the above structs to implement the logger interface

```bash
func (c *consolelogger) log(msg string) {
	fmt.Println("message from consolelogger:", msg)
}

func (f *filelogger) log(msg string) {
	fmt.Println("message filelogger:", msg)
}
```

Let us create the apiService that uses the logger dependency in the main app

```bash
type apiService struct {
	logger logger
}

func NewApiService(l logger) *apiService {
	return &apiService{
		logger: l,
	}
}
```

And let us create a get receiver method for the apiService to use the log message of the logger dependency.

```bash
func (a *apiService) get(msg string) {
	a.logger.log(msg)
}
```

Now in the main app we can create a new api service instance with a logger dependency of our choice as shown below

```bash
logger1 := &consolelogger{}     
api := NewApiService(logger1)   // We choose the consolelogger struct type
api.get("hello console")
```

```bash
message from consolelogger: hello console
```

Now we can change our logger dependency by just passing a different logger dependency as shown below

```bash
logger2 := &filelogger{}     
api := NewApiService(logger2)   // We choose the filelogger struct type
api.get("hello file")
```

```bash
message filelogger: hello file
```

This is how easy dependency injection is with go interfaces.

### Thank You