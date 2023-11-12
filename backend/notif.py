from firebase_admin import initialize_app, firestore
from flask import Flask, request, jsonify
from scraper import navigate_to_element, find_element_by_xpath
from gmail import send_email
import os
import pathlib
from flask_cors import CORS

os.system('playwright install --with-deps chromium')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] =  str(pathlib.Path().resolve()) + "/cred.json"
app = initialize_app()
db = firestore.client(app)

top_level_collection = "Users"

app = Flask(__name__)

@app.route('/healthz', methods=['GET'])
def health():
    return "", 200

@app.route('/api/create-notif', methods=['POST'])
def create_notif():
    # Get JSON data from the request
    data = request.get_json()
    email_collection_ref = db.collection(top_level_collection).document("Users").collection(data["email"])
    doc_ref = email_collection_ref.document()
    
    initial_text = navigate_to_element(data["url"], data["clicks"], data["final_xpath"])
    data_to_merge = {
        "name": data["name"],
        "url": data["url"],
        "clicks": data["clicks"],
        "final_xpath": data["final_xpath"],
        "text": initial_text
    }
    doc_ref.set(data_to_merge)
    return data

@app.route('/api/check-notifs', methods=['GET'])
def check_notifs():
    collections  = db.collection("Users").document("Users").collections()

    for collection in collections:
        email_documents = collection.stream()
        for email_document in email_documents:
            email_document_data = email_document.to_dict();
            initial_text = email_document_data["text"]
            new_text = navigate_to_element(email_document_data["url"], email_document_data["clicks"], email_document_data["final_xpath"])
            if new_text != initial_text:
                send_email(email_document_data["name"], email_document_data["url"], collection.id, initial_text, new_text)
                document_ref = collection.document(email_document.id)
                document_ref.update({"text": new_text})
    return {}

@app.route('/api/delete-notif', methods=['DELETE'])
def delete_notif():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    collection = db.collection("Users").document("Users").collection(email)
    email_documents = collection.stream()
    for email_document in email_documents:
        email_document_data = email_document.to_dict();
        if (email_document_data["name"] == name):
            email_document.reference.delete()
    return {"deleted": name}

@app.route('/api/get-notifs', methods=['GET'])
def get_notifs():
    data = request.get_json()
    email = data["email"]
    collection = db.collection("Users").document("Users").collection(email)
    email_data = []
    for email_document in collection.stream():
        email_document_data = email_document.to_dict()
        email_data.append(email_document_data)
    return email_data

    
    
    


    
    
if __name__ == '__main__':
    app.run(debug=True)