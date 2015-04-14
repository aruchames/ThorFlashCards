# ThorFlashCards 
Flash card website and chrome extension to create flash cards directly from text on a webpage and view them later on the homepage

# Local setup instructions
Install virtualenv, python >= 2.7.1, and pip on your local machine. DO NOT pip install django. 

First setup your virtualenv. Virtualenv essentially creates a virtual environment for your python, isolating
this app from other apps that you may want to develop.
```
virtualenv env
```

Activate your virtualenv

```
source env/bin/activate
```

You should see your prompt change from

```
whatever/
```
to

```
(env)whatever/
``` 

Now run 

```
pip install -r requirements.txt
```

You are now ready to run django scripts!


#This Week's goals:

03/22 
buy domain; set up webserver; familiarize with Django, Angular/jQuery/React, Bootstrap, AWS/Digital Ocean; Nginx; Chrome extension

03/29
set up website backend services (including API access, authentication, basic flashcard functionalities)
front end not necessarily pretty by this point (bare bones meaning iterate through one set of flashcards)

04/08 (Next meeting with Moretti)

1. We need to set up the Database. ASAP. If that's not set up soon our forward progress will be greatly impeded. This is definitely Mike's thing.

2. We need to have the login and registration page down. Today Andrews edited the login to be a login button rather than login page, but we still need to do a few things with redirection from there, and we need the database set up in order to set up the Registration page. 

3. Simultaneous with the registration, but after setting up the database, we need to make our chrome extension communicate with the database.

4. We also need to have at least one user that can login and see a deck of cards that we've created. So in order to do that we will need a registration page done to add users. We can't worry about this goal until the database is up.

=======
2. We need to have the login and registration page down. Today Andrews edited the login to be a login button rather than login page, but we still need to do a few thin\
gs with redirection from there, and we need the database set up in order to set up the Registration page.

3. Simultaneous with the registration, but after setting up the database, we need to make our chrome extension communicate with the database.

4. We also need to have at least one user that can login and see a deck of cards that we've created. So in order to do that we will need a registration page done to ad\
d users. We can't worry about this goal until the database is up.


04/17

We have a lot to do this week. It's getting close to crunch time. We need a flash card interface by the end of the week, and we need the API that Mike is working on by the end of the week. The plugin has made substantial progress, translate functionality will be added by Wednesday and as soon as the API is ready we can start with the database plugin interaction. Also login bugs need to be fixed so that we can start pressing on. If we have all these things done at the end of this week, I think we'll be in a pretty good place to make this project really good, so please put your all in this week. 