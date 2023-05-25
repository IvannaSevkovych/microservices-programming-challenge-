from flask import Flask, jsonify, request
app = Flask(__name__)

orders = [{"id": 1, "userId": 1, "productIds": [1, 2]}, {"id": 2, "userId": 2, "productIds": [2, 3]}]

@app.route("/orders", methods=['GET'])
def get_orders():
    if not orders:
        return 'No orders found', 404
    return jsonify(orders), 200

@app.route('/orders', methods=['POST'])
def add_order():
    orders.append(request.get_json())
    if not orders:
        return 'No order added', 400
    return orders, 201

@app.route("/orders/<int:id>", methods=['GET'])
def get_order_by_id(id):
    requestedOrder = next((order for order in orders if order["id"] == id), None)

    if not requestedOrder:
        return 'order with id ' + str(id) + ' was not found', 404

    return jsonify(requestedOrder), 200

@app.route("/orders/<int:id>", methods=['PUT'])
def put_order_by_id(id):
    requestedOrder = next((order for order in orders if order["id"] == id), None)
    if not requestedOrder:
        return 'Order with id ' + str(id) + ' was not found', 400

    orders[orders.index(requestedOrder)] = request.get_json()
    return 'Order with id ' + str(id) + ' was updated', 200
