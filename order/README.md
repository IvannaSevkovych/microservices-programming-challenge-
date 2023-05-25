## Build the image
```
docker build . -t order
```

## Run the image
```
docker run --name order -p 8092:5000 -d order
```
