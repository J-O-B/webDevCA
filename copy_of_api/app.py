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
import ssl
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
            return {'data': {'status': 'Server Is Running & All Looks Good!', 'endpoints': {'home': '/', 'news':'/news', 'email': '/email', 'all_news': '/all'}}}
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
        
        feedback = ''
        # Environment
        my_email = os.environ.get('EMAIL')
        my_pass = os.environ.get('PASSWORD')

        confirmation = f'Good day {data["User"]},\n Thank you for your enquiry sent at {data["Time"]}. We will respond to you with an answer in the coming days. A copy of your message:\n\nFrom: {data["User"]}\nTo: SecureX Team\nSubject: {data["Subject"]}\n\nMessage: {data["Message"]}\n\n\nRegards,\nSecureX Team'
        
        smpt_server = 'smtp.gmail.com'
        port = 587
        sender_email = my_email
        receiver_email = user_email
        password = my_pass
        message = confirmation


        context = ssl.create_default_context()

        try:
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.ehlo_or_helo_if_needed()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message)
            server.close()
            return 'Thank You For Your Message! A Copy Has Been Sent To Your Email For Your Records. We Will Be In Contact Soon.'
        except Exception as e:
            return 'There was an error sending your message. Please try again later.'
        
      

class All(Resource):
    def get(self):
        data = ''
        with open('news.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            f.close()
        return data

api.add_resource(status, '/', endpoint='home')
api.add_resource(News, '/news', endpoint='news')
api.add_resource(Email, '/email', endpoint='email')
api.add_resource(All, '/all', endpoint='all')


if __name__ == '__main__':
    app.run(debug=False)