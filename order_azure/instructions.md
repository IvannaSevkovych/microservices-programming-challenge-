**1. Create Container registry in Azure**

**2. Build the image**

```docker build . -t hello-demo```

**3. Login to azure server**

docker login xxxgregistry.azurecr.io

**4. Tag image**

docker tag hello-demo xxxregistry.azurecr.io/hello-demo

**5. Push tagged image to azure**

docker push xxxregistry.azurecr.io/hello-demo
