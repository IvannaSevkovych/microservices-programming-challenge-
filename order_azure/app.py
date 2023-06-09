from flask import Flask, jsonify, request
import requests
import psycopg2
import os

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

    # Product service configuration
    PRODUCT_SERVICE_URL = os.getenv('PRODUCT_SERVICE_URL')

    # Retrieve data from the request's JSON payload
    data = request.get_json()
    requested_product_ids = data['productIds']
    requested_user_id = data['userId']

    # Make a GET request to the product service API
    product_validation_response = requests.get(f"{PRODUCT_SERVICE_URL}/api/products")

    # Check if the response is successful and all productIds are found
    product_validated = False
    if product_validation_response.status_code == 200:
        products = product_validation_response.json()

        # Extract the _id values from the products
        product_service_product_ids = [product["_id"] for product in products]

        # Check if all productIds are found
        if set(requested_product_ids).issubset(set(product_service_product_ids)):
            product_validated = True
    else:
        return 'No products found', 404

    # User service configuration
    USER_SERVICE_URL = os.getenv('USER_SERVICE_URL')

    # Make a GET request to the user service API
    user_validation_response = requests.get(f"{USER_SERVICE_URL}/users")

    # Check if the response is successful and all productIds are found
    user_validated = False
    if user_validation_response.status_code == 200:
        users = user_validation_response.json()

        for user in users:
            if user.get("id") == requested_user_id:
                user_validated = True
                break
    else:
        return 'No users found', 404

    if user_validated and product_validated:
        conn = get_db()
        cur = conn.cursor()

        try:
            # Insert data into the database
            cur.execute(
                "INSERT INTO orders (id, userId, productIds) VALUES (%s, %s, %s)",
                (data['id'], data['userId'], data['productIds'])
            )

            # Commit the transaction
            conn.commit()

            # Return a success message
            return jsonify({'message': 'Data inserted successfully'}), 200
        except Exception as e:
            # Rollback the transaction in case of any error
            conn.rollback()

            # Return an error message
            return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
        finally:
            # Close the cursor and connection
            cur.close()
            conn.close()
    else:
        return jsonify({'message': 'Validation failed', 'product_validated': product_validated, 'user_validated': user_validated}), 400

@app.route("/orders/<int:id>", methods=['GET'])
def get_order_by_id(id):
    conn = get_db()
    cur = conn.cursor()

    # Execute an SQL query
    cur.execute("SELECT * FROM orders WHERE id=%s", (id,))

    # Fetch all rows from the result set
    row = cur.fetchone()

    # Close the cursor
    cur.close()
    conn.close()

    if not row:
        return f'No order with {id} found', 404
    return jsonify(row), 200

@app.route("/orders/<int:id>", methods=['PUT'])
def put_order_by_id(id):
    conn = get_db()
    cur = conn.cursor()
    req_body=request.get_json()

    # Execute an SQL query
    cur.execute("UPDATE orders SET id=%s, userId=%s, productIds=%s WHERE id=%s", (req_body['id'], req_body['userId'], req_body['productIds'], id))
    # Commit the transaction
    conn.commit()
    rows_affected = cur.rowcount

    # Close the cursor
    cur.close()
    conn.close()

    if rows_affected==0:
        return f'Order with id {id} was not found', 404
    else:
        return f'Order with id {id} was updated', 200
