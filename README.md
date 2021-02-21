# CovPals

CovPals is a website that was created to combat feelings of isolation faced by many individuals in lockdown. We pair people from all backgrounds to have a virtual bonding session! 

## Inspiration
Social distancing and quarantine measures implemented during the ongoing COVID-19 pandemic have resulted in widespread social isolation and poses a significant detriment to the mental health of people worldwide. Various research has shown that lockdown had a negative impact on people’s mental health so far ([here](https://pubmed.ncbi.nlm.nih.gov/32450416/), [here](https://link.springer.com/article/10.1007/s00415-020-10056-6)). Furthermore, social isolation has been known to cause lasting effects on the mental health of those who are isolating ([here](https://onlinelibrary.wiley.com/doi/full/10.1111/jocn.15290)). This project was created to allow individuals to meet and talk to new people, in an effort to reduce the toll of social isolation on their wellbeing.

## What it does
CovPals is a web application that allows users to meet a new friend online, and schedule meetings between them once a week to catalyze social interaction for anyone who is interested but may not have many people to talk to.

## Why we made it
To connect people through the internet and help fight the negative effects of social isolation on the mental wellbeing of the general public. We hope to improve connectivity through the internet with this project!

## How we built it
For the front end, we used React to create our views and forms. For the back end, we used Express, Nodejs, and MongoDB to store and access our database of users.

## Challenges we ran into
We ran into some issues while developing the backend as first, most of us had no experience with backend frameworks at all, meaning that a lot of time had to be spent learning them. Further, we also experienced some unexpected behaviour involving javascript promises and the asynchronous paradigm in javascript as a result of us needing to make API calls. This was also the first time we worked with the libraries and APIs used in this project, so getting accustomed to them in a timely manner was definitely challenging as well.

## What we learned
This was the first time most of our group members worked with Express and MongoDB as well as the APIs offered by Mailgun and Zoom. Most of us have also never worked with databases so learning how to make queries and mutating data was also a new learning experience. On the frontend, this was the first time any of us had used Material-UI.

## Tools & Libraries used
We utilized the Mailgun API to give our server the ability to automate sending emails to participants, and to notify them of their matches. Additionally, we leveraged the Zoom API to generate weekly meeting links for each matched pair of users.
