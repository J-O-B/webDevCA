import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from newspaper import Article
from textblob import TextBlob
from bs4 import BeautifulSoup
from datetime import date
from email.message import EmailMessage
import smtplib
import nltk
import requests
import json

today = date.today()
today = today.strftime("%d/%m/%Y")

nltk.download('punkt')

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={"/news": {"origins": "*"},
                            "/email": {"origins": '*'}})

class status(Resource):
    def get(self):
        try:
            return {'data': 'Running',"endpoints": ['/news']}
        except(error):
            return {'data': error}

class News(Resource):
    def get(self):
        # check for when updated
        match = 0
        with open('news.json', 'r', encoding='utf-8') as f:
            oldData = json.load(f)
            f.close()
        for i in oldData:
            news_date = i['Date']
            if news_date == today:
                match = match + 1        
        if match != 0:
            print('alreadygotnews', len(oldData))
            # already got the news with todays date, dont scrape again, return news
            to_return = []
            
            if len(oldData) > 8:
                for i in range(len(oldData)-1, len(oldData) - 9, -1):
                    print(i)
                    to_return.append(oldData[i])
            else:
                to_return = oldData
            return jsonify(to_return)

        else:
            print('gettingNews')
            # no updated news for today, scrape new stories
            url = 'https://thehackernews.com'
            head = {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            }
            s = requests.Session()
            r = s.get(url, headers=head)
            soup = BeautifulSoup(r.text, 'html.parser')
            urls = []
            for i in soup.findAll('a', class_='story-link', href=True):
                try:
                    data = {}
                    data['url'] = i['href']
                    data['img'] = i.find('img')['data-src']
                    urls.append(data)
                except Exception as e:
                    pass
            save = []
            for i in urls:
                target = i['url']
                img = i['img']

                article = Article(target)
                article.download()
                article.parse()
                article.nlp()
                this_data = {
                    'Title': article.title,
                    'Author': article.authors[0],
                    'Summary': article.summary,
                    'Text': article.text,
                    'Date': today,
                    'Url': target,
                    'Img': img
                }
                save.append(this_data)
            
            filter = []
            try:
                with open('news.json', 'r', encoding='utf-8') as f:
                    news = json.loads(f)
                    f.close()
                for i in news:
                    filter.append(i)

                for i in save:
                    title = i['Title']
                    notDuplicate = False
                    for item in news:
                        comTitle = item['Title']
                        if title == comTitle:
                            notDuplicate = True
                    if notDuplicate:
                        filter.append(i)
            except:
                filter = save

            # save the news
            with open('news.json', 'w', encoding='utf-8') as f:
                json.dump(filter, f, indent=4)
                f.close()
            to_return=[]
            if len(filter) > 8:
                for i in range(len(filter)-1, len(filter) - 9, -1):
                    print(i)
                    to_return.append(filter[i])
            else:
                to_return = filter
            return jsonify(filter)

class Email(Resource):
    def get(self):
        # name=fname lname&email=abc@abc.com&subject=hello world&message=hello&time=09/08/2014, 2:35:56 AM
        try:
            user_name = request.args['name']
            user_email = request.args['email']
            user_subject = request.args['subject']
            user_message = request.args['message']
            user_time = request.args['time']
            data = {
                'User': str(user_name),
                'Email': str(user_email),
                'Subject': str(user_subject),
                'Message': str(user_message),
                'Time': str(user_time)
            }
        except Exception:
            return 'Invalid Credentials'
        
        try:
            # Environment
            my_email = os.environ.get('EMAIL')
            my_pass = os.environ.get('PASSWORD')
            admin_email = os.environ.get('ADMIN')
        except Exception:
            return 'Environment Error'
        
        try:
            # To customer
            confirmation = f'Good day {data["User"]},\n Thank you for your enquiry sent from our website. We will respond to you with an answer in the coming days.\n\nRegards,\nSecureX Team'
            message = EmailMessage()
            message.set_content(confirmation)

            message['Subject'] = "Confirmation Email - SecureX"
            message['From'] = my_email
            message['To'] = user_email

            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.login(my_email, my_pass)
            server.send_message(message)
            server.quit()
            # To Admin
            admin_message = f"""
    A new message was sent from SecureX, a customer named {data['Name']} sent the following:\n
    From: {data['Email']},\n
    At: {data['Time']}
    Subject: {data['Subject']},\n
    Message: {data['Message']}.\n\n
    Please Respond To This Customer When You Can.
                    """
            message.set_content(admin_message)
            message['Subject'] = "Contact Form - SecureX"
            message['From'] = my_email
            message['To'] = admin_email
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.login(my_email, my_pass)
            server.send_message(message)
            server.quit()
            return 'Message Sent'

        except Exception:
            # Email Confirmation failed
            return 'An Error Occurred & A Notice Has Been Sent To The Administrator'

api.add_resource(status, '/', endpoint='home')
api.add_resource(News, '/news', endpoint='news')
api.add_resource(Email, '/email', endpoint='email')


if __name__ == '__main__':
    app.run(debug=False)