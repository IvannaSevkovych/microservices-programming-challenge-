from flask import Flask, jsonify, request
app = Flask(__name__)

orders = [{"id": 1, "userId": 1, "productIds": [1, 2]}, {"id": 2, "userId": 2, "productIds": [2, 3]}]

def findRequestedOrder(id):
   return next((order for order in orders if order["id"] == id), None)

@app.route("/orders", methods=['GET'])
def get_orders():
    if not orders:
        return 'No orders found', 404
    return jsonify(orders), 200

@app.route('/orders', methods=['POST'])
def add_order():
    if not orders:
        return 'No order added', 400
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
