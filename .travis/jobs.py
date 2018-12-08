import urllib3.request, urllib.request
import requests as req
import os
import json
import feedparser
import datetime
import markdown2
from bs4 import BeautifulSoup as Soup

def user_repos():
    url = "https://api.github.com/users/haideralipunjabi/repos"
    url2 = "https://api.github.com/orgs/hackesta/repos"
    response = req.get(url, auth=(os.environ.get('GITHUB_USERNAME'), os.environ.get('GH_TOKEN')))
    response2 = req.get(url2, auth=(os.environ.get('GITHUB_USERNAME'), os.environ.get('GH_TOKEN')))
    data = json.loads(response.text)
    data = data + json.loads(response2.text)
    for repo in data:
        response = req.get(repo['contributors_url'], auth=(os.environ.get('GITHUB_USERNAME'), os.environ.get('GH_TOKEN')))
        rdata = json.loads(response.text)
        for user in rdata:
            if user['login'] == os.environ.get('GITHUB_USERNAME'):
                repo['commits'] = user['contributions']

    print(json.dumps(data),file=open('data/user_repos.json',"w"))

def closed_projects():
    url = "https://hackesta.org/api/projects/?format=json"
    response = req.get(url)
    print(response.text,file=open('data/closed_projects.json',"w"))

def instagram():
    url = "https://instagram.com/haideralipunjabi/?__a=1"
    response = req.get(url)
    print(response.text,file=open('data/instagram.json',"w"))

def hackesta_projects():
    url = "https://api.github.com/orgs/hackesta/repos"
    response = req.get(url, auth=(os.environ.get('GITHUB_USERNAME'), os.environ.get('GH_TOKEN')))
    print(response.text,file=open('data/hackesta_repos.json',"w"))

def websites():
    url = "https://hackesta.org/api/websites/?format=json"
    response = req.get(url)
    print(response.text,file=open('data/websites.json',"w"))

def fpx_photographs():
    # userid = '8734325'
    # url = "https://api.500px.com/v1/photos?feature=user&user_id=%s&page=1&image_size[]=3&image_size[]=6&rpp=100&consumer_key=" + os.environ.get('FHPX_CON_KEY')
    # response = req.get(url % userid)
    # print(response.text,file=open('data/fpx_photographs.json','w'))
    url = "https://500px.com/search.rss?q=haideralipunjabi&page=%s"
    page = 1
    photos = []
    more_photos = True
    while(more_photos):
        feed = feedparser.parse(url % page)
        if(feed.entries.__len__() < 20):
            more_photos = False
        else:
            page += 1
        for entry in feed.entries:
            photo = {}
            photo['title'] = entry.title
            photo['link'] = entry.link
            photo['url'] = entry.media_content[0]['url']
            photo['thumbnail'] = entry.media_thumbnail[0]['url']
            photo['published'] = entry.published
            photos.append(photo)
    photos.sort(key=lambda item:datetime.datetime.strptime(item['published'], "%a, %d %b %Y %H:%M:%S %z"), reverse=True)
    jsonData = json.dumps(photos)
    print(jsonData,file=open('data/fpx_photographs.json','w'))
def fpx_user():
    userid = '8734325'
    url ="https://api.500px.com/v1/users/%s/?consumer_key=" + os.environ.get('FHPX_CON_KEY')
    response = req.get(url % userid)
    print(response.text, file=open('data/fpx_user.json','w'))


user_repos()
closed_projects()
instagram()
hackesta_projects()
websites()
fpx_photographs()
# fpx_user()
