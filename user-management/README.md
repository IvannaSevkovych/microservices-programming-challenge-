## Build the image
```
docker build . -t user-management
```

## Run the image
```
docker run --name user-management -p 8090:8090 -d user-management
```
