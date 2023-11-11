from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/post_example', methods=['POST'])
def post_example():
    # Get JSON data from the request
    data = request.get_json()

    # Assuming the JSON data has a 'message' field
    message = data.get('message', 'No message provided')

    # You can perform any processing with the data here
    # For example, you might want to transform the message
    processed_message = message.upper()

    # Return a JSON response
    return jsonify({'processed_message': processed_message})

if __name__ == '__main__':
    app.run(debug=True)