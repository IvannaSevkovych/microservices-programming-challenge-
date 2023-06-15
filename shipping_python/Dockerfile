FROM python:3.10-slim-buster

WORKDIR /order

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8095

CMD [ "python3", "app.py" ]
