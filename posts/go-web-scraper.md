---
title: "Web Scraper in Go"
subtitle: "Building a web scraper backend using Go and PostgreSQL"
date: "2024-05-05"
---

Go has been gaining popularity in the developer community for its fast compilation, versatility, easy-to-use syntax, static & strongly-typed approach, easy concurrency usage (via goroutines and channels) and more...

In this blog post, let's build a web scraper that leverages some of Go's cool features like goroutines and combine it with the power of postgreSQL to create a complete backend web server with a database.

The web scraper we build will have the following features :-
* Each user can add a URL (to scrape its nested posts) to the database
* API key authentication mechanism for users 
* A Go scheduler to scrape the latest posts in the URL every 5 minutes and store them to the database

### Create a User 

When a request comes to create a new user then a new user is inserted to the database. 
The sql query also inserts a randomly generated 64 bit api key into the database. 
This api key is returned as response to the user. 

```bash
v1router.Post("/users", apiCfg.handlerCreateUser)
```
![images/](/images/api_key.jpg)

### Add a URL/feed

Now the user needs to be authenticated i.e. the user needs to possess an API key that they would have attained while signing up.
Disclaimer: This approach is minimal in terms of authentication and a more robust auth mechanism (like JWT) should be used in production. 

Now this is where Go closures has a good use case. We can use Go closures to setup the authentication middleware function.

```bash
v1router.Post("/feeds", apiCfg.middlewareAuth(apiCfg.handlerCreateFeed))
```

![images/](/images/auth.jpg)
As we can see above the middlewareAuth function returns an httpHandlerFunc function thereby matching to its signature parameters.
The returning function calls the handler function (which in this case will be 'handlerCreateFeed' method) which does contain the parameter 'user' all tied to a single apiConfig instance.


### Web scraping approach

We spawn a separate go routine from the main function. This goroutine is responsible to perform the web-scraping task.
![images/](/images/server.jpg)

The idea is to use the Go ticker channel, scheduled to send the time after every five minutes.
![images/](/images/scraper.jpg)

We have an infinite for loop that reads the 
data from the channel. So effectively the for loop iterates every five minutes. 

```bash
    ticker := time.NewTicker(timeBetweenRequests)
	for ; ; <-ticker.C {
		feeds, err := db.GetNextFeedsToFetch(
			context.Background(),
			int32(concurrency),
		)
```

Inside the for loop we get the next k urls to fetch from the
database based on their previous fetched time. This ensures that the feeds/urls that have never been fetched before are fetched first.
We can also limit the number of feeds we fetch based on our requirements. 
![images/](/images/nextfeeds.jpg)

After this we create a waitgroup to keep track of the number of spawned go-routines. And then we loop through the fetched urls. Inside this inner for loop we spawn separate go routines to scrape the different feeds.

```bash
        wg := &sync.WaitGroup{}
		for _, feed := range feeds {
			wg.Add(1)
			go scrapeFeed(db, wg, feed)
		}
		wg.Wait()
```

Also we insert each post that occurs in the feed to the database. 
We take care of the fact that each post entry in the database is that of a 
separate link/url.
![images/](/images/posts_table.jpg)


### Will there be race conditions?

Race conditions occur when different goroutines are operating on the same record in the database. In our case there is no issue when 
inserting the post record in the database as each post is a unique entry with unique url. But generally it is a good practice to use mutexes as safeguard or channels to avoid race conditions in database operations.


### Thank You

So finally we implemented the web scraper using Go and postgreSQL. This looks like a decent implementation and in future I look to improve on this with more features and better practices incorporated like using a more robust authentication mechanism, and incorporating unit tests.
Till then thank you for reading through and check out the git repo - https://github.com/rohitkrcodes/Go-Web-Scraper 

---

