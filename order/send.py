import pika
import time

def send():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit-mq'))
    channel = connection.channel()

    channel.queue_declare(queue='hello')

    channel.basic_publish(exchange='',
                        routing_key='hello', # queue name
                        body='Hello World!')
    if connection:
        print(" [x] Sent 'Hello World!'")

    connection.close()

if __name__ == '__main__':
    not_sent = True
    while not_sent:
        try:
            send()
            # we get here if send was successful
            not_sent = False
        except pika.exceptions.AMQPConnectionError:
            print('Retry in 2 seconds')
            time.sleep(2)
