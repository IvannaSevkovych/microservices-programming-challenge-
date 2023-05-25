## Build the image
```
docker build . -t product-catalog
```

## Run the image
```
docker run --name product-catalog -p 8091:3000 -d product-catalog
```
