from flask import Flask, jsonify, request
import requests
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure the database connection:
app.config['DATABASE'] = {
    'dbname': os.getenv('POSTGRES_DATABASE'),
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD'),
    'host': os.getenv('POSTGRES_HOST'),
    'port': os.getenv('POSTGRES_PORT')
}
def get_db():
    conn = psycopg2.connect(
        dbname=app.config['DATABASE']['dbname'],
        user=app.config['DATABASE']['user'],
        password=app.config['DATABASE']['password'],
        host=app.config['DATABASE']['host'],
        port=app.config['DATABASE']['port']
    )
    return conn

@app.route("/orders", methods=['GET'])
def get_orders():

    conn = get_db()
    cur = conn.cursor()

    # Execute an SQL query
    cur.execute('SELECT * FROM orders')

    # Fetch all rows from the result set
    rows = cur.fetchall()

    # Close the cursor
    cur.close()

    conn.close()

    if not rows:
        return 'No orders found', 404
    return jsonify(rows), 200


# TODO
@app.route('/orders', methods=['POST'])
def add_order():
    if not orders:
        return 'No order added', 400
    # check all products exist
    #TODO loop
    url = 'http://product-catalog/products/<TODO-id>'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        # Process the response data
        print(data)
    else:
        print('Error:', response.status_code)

    # check user exists
    orders.append(request.get_json())
    return orders, 201

@app.route("/orders/<int:id>", methods=['GET'])
def get_order_by_id(id):
    requestedOrder = findRequestedOrder(id)

    if not requestedOrder:
        return f'order with id {id} was not found', 404

    return jsonify(requestedOrder), 200

@app.route("/orders/<int:id>", methods=['PUT'])
def put_order_by_id(id):
    requestedOrder = findRequestedOrder(id)
    if not requestedOrder:
        return f'Order with id {id} was not found', 404

    orders[orders.index(requestedOrder)] = request.get_json()
    return f'Order with id {id} was updated', 200
