import pika
import time

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit-mq'))
    channel = connection.channel()

    channel.queue_declare(queue='hello')

    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)

    channel.basic_consume(queue='hello',
                        auto_ack=True,
                        on_message_callback=callback)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()



if __name__ == '__main__':
    not_receiving = True
    while not_receiving:
        try:
            main()
            # we get here if send was successful
            not_receiving = False
        except pika.exceptions.AMQPConnectionError:
            print('Retry receive in 2 seconds')
            time.sleep(2)
