import sendgrid
import os
from dotenv import load_dotenv
from sendgrid.helpers.mail import Mail, Email, To, Content
import yagmail

# Load environment variables from the .env file
load_dotenv()

def send_email(name, url, email, initial_text, final_text):
    body = "Hi there! There's been an update at " + name + ". It's changed from \"" + initial_text + "\" to \"" + final_text + "\"\nHere's the url: " + url
    yag = yagmail.SMTP('notifme.llc@gmail.com', os.getenv('password'))
    yag.send(email, "Notifme", body)


    
    
    