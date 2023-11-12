
from firebase_admin import initialize_app, firestore
from flask import Flask, request, jsonify
from scraper import navigate_to_element, find_element_by_xpath
import os
import pathlib


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] =  str(pathlib.Path().resolve()) + "/cred.json"
app = initialize_app()
db = firestore.client(app)

top_level_collection = "Users"

app = Flask(__name__)

@app.route('/api/create-notif', methods=['POST'])
def create_notif():
    # Get JSON data from the request
    data = request.get_json()
    email_collection_ref = db.collection(top_level_collection).document("Users").collection(data["email"])
    doc_ref = email_collection_ref.document()
    
    initial_text = navigate_to_element(data["url"], data["clicks"], data["final xpath"])
    data_to_merge = {
        "url": data["url"],
        "clicks": data["clicks"],
        "final xpath": data["final xpath"],
        "text": initial_text
    }
    doc_ref.set(data_to_merge)
    return data

@app.route('/api/check-notifs', methods=['GET'])
def check_notifs():
    collections  = db.collection("Users").document("Users").collections()
    # Users -> Documents (Emails) -> Collection (Email) -> Multiple Documents, need to access click for each

    for collection in collections:
        email_documents = collection.stream()
        for email_document in email_documents:
            email_document_data = email_document.to_dict();
            initial_text = email_document_data["text"]
            new_text = navigate_to_element(email_document_data["url"], email_document_data["clicks"], email_document_data["final xpath"])
            if new_text != initial_text:
                print("there's been a change")
            else:
                print("no change, all good")
    return {}
    
    
if __name__ == '__main__':
    app.run(debug=True)