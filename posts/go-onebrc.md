---
title: "1 Billion Row Challenge in Go"
subtitle: "Using Go to solve the 1 billion row challenge in 10.2 seconds"
date: "2024-01-20"
---

In this post I will discuss my approach to solve the "One billion row challenge" in Go. 
"The One Billion Row Challenge (1BRC) is a fun exploration of how far modern Java can be pushed for aggregating one billion rows from a text file." -- although the challenge was originally for Java but later other programming languages jumped to it as well.
I was able to create a solution which takes ~10.2s to read, parse and calculate the results for 1bn lines on my Apple M1 (8-core CPU, 8GB RAM). 

#### About the challenge
Problem statement - A text file containing 1 billion rows of temperature values for several weather stations. Each row is of the format 
```
<string: station name>;<float: measurement>
```

Output: For each unique station, find the minimum, average and maximum temperature recorded and emit the final result in a file in station name’s alphabetical order with the format 
```
<station name>:<min>/<average>/<max>;<station name>:<min>/<average>/<max>
```

Note - The temperature value is within [-99.9, 99.9] range.

#### Simple Approach
Let us talk about the steps to solve this problem :-
* Reading the data
* Processing/Parsing the data
* Aggregating & writing the results to a file

The first and third are I/O operations and are generally considered slow. But processing/parsing the input and the associated memory allocations: splitting the input into station and temperature, maintain min,max and counts for each station temperature with a hash table. are usually the bottleneck. --- [more info here](https://benhoyt.com/writings/io-is-no-longer-the-bottleneck/)

In the first approach I will perform each of the three operations sequentially. This will serve as a baseline implementation.

Since we need to find the min,mean and max of temperature values for each weather stations we can create a struct of the following type

```bash
type stats struct{
    min, max, sum float64
	count         int64
}
```
A map of this struct can be used to store the stats for each weather station with the names of the weather stations acting as the key.
As seen above, I used count and sum as it will help in determining the mean and this way we do not need to store each temperature value for a station in a list corresponding to that station in the map. We can just use 'map[string]stats' with this approach reducing memory usage.

Then for reading the data we can use bufio's Scanner to read file contents line by line and process them to the stats hashmap. After the entire file is read and processed, we can write the output from the hashmap to a separate file.
This approach took ~ 1 min 19 seconds . 
The solution can be found [here]


#### Optimised Approach
Now we can create separate goroutines for reading and processing the data and thereby perform both concurrently.
Now we have two options - first is to create worker goroutines to process every read data; second is to use the fan-in-fan-out concurrency pattern.

In the first option - we can send every read line to a channel which can be consumed by worker goroutines where the data is processed. This will not improve performance much because the worker goroutines will have to do too many reads from the channel instead of doing processing, reducing their efficiency. We can improve this by sending the data in batches as this will improve worker goroutines efficiency as they spend more time processing data rather than interacting with channel.

In the second option we can use the fan-in-fan-out concurrenncy pattern. In this we can spin up separate goroutines for processing every chunk of data. For this we will need to send the data in chunks of some size (like 1 MB). This is because if we send data line by line then we will spin up too many goroutines. Also if we send very large chunksize then it will lead to more in-memory usage and there will be more time to spin goroutine as it will have to wait for the read of large chunk to complete.
So considerable chunksize (like 1 MB) can be read and processing goroutine corresponding to every chunk can be spun up.
Also we can spin one more goroutine to aggregate the data which will merge the results from the various processing goroutines.
This is a better option compared to the first optimised option because here we spin separate processing goroutine for every chunk and these gorutines are spending almost entire time processing data rather than interacting with channel, thereby increasing efficiency.
So we split the file into similar-sized chunks (one for each CPU core), spin up a thread (in Go, a goroutine) to process each chunk, and then merge the results at the end.
This pattern is called "Fan-in-Fan-Out concurrency" pattern.
![images/](/images/faninout.jpg)

But when we send the read chunk data to the processor goroutine, it has to take care of the fact that it is sending chunks ending with '\n'.
Otherwise the processor goroutine will have breakages in the data received which might give wrong answers in the final results map.
For this we can use the 'LastIndexByte' method of the bytes package. This way we just need to track the last occurring '\n' in the chunk rather than checking for '\n' for every line. 
Below is the implementation of the read goroutine

```bash
var wg sync.WaitGroup
buf := make([]byte, 1024*1024)
readStart := 0

go func() {
    for {
        n, err := file.Read(buf[readStart:])
        if err != nil && err != io.EOF {
            panic(err)
        }
        if readStart+n == 0 {
            break
        }
        // Copy the chunk to a new slice, as the
        // buffer will be reused in the next iteration.
        chunk := make([]byte, len(buf[:readStart+n]))
        copy(chunk, buf[:readStart+n])
        newline := bytes.LastIndexByte(chunk, '\n')
        if newline < 0 {
            break
        }
        remaining := chunk[newline+1:]
        chunk = chunk[:newline+1]

        // Spin up goroutine for every chunk
        wg.Add(1)
        go processChunk(chunk, resultsChan, &wg)

        readStart = copy(buf, remaining)
    }
    wg.Wait()
    close(resultsChan)
}()
```

The complete code can be found [here](https://github.com/rohitkrcodes/Go-OneBillionRowsChallenge/tree/main/optimised)
With this approach the time taken comes down to 12.52 seconds.

### Further Optimization 
We can use the "map[string]*stats" instead of "map[string]stats" i.e. use a map of stats pointer. Secondly we can use raw reading of the bytes instead of Scanner function. These two optimization bring down the time taken to ~ 10.2 seconds.

So this was my approach for solving the 1 billion row challenge
Check out the full implmentation [here](https://github.com/rohitkrcodes/Go-OneBillionRowsChallenge)

### Thank You



