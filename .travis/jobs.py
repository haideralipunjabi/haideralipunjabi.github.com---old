import urllib3.request, urllib.request
import requests as req
import os
import json
import feedparser
import datetime
import markdown2
from bs4 import BeautifulSoup as Soup


def fpx_photographs():
    index = Soup(open("index.html",'r').read(),"lxml")
    photography = index.select_one('#ph-photography')
    url = "https://500px.com/search.rss?q=haideralipunjabi&page=%s"
    page = 1
    photos = []
    more_photos = True
    while(more_photos):
        feed = feedparser.parse(url % page)
        if(feed.entries.__len__() ==0):
            return
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
    photos.sort(key=lambda item:datetime.datetime.strptime(item['published'], "%a, %d %b %Y %H:%M:%S %z"), reverse=False)
    if(photos.__len__()>0):
        photography.clear()
    for photo in photos:
        html = Soup('<div class="col-2 col-4-medium col-6-small"><a href="%s" class="image fit"><img src="%s" alt="%s"></a></div>'%(photo['link'],photo['thumbnail'],photo['title']),"html.parser")
        photography.insert(0,html)
    print(index.prettify().replace('\\n','\n'),file=open("index.html",'w'))



fpx_photographs()
