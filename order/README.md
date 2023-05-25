## Build the image
```
docker build . -t order
```

## Run the image
```
docker run --name order -p 5000:5000 -d order
```
