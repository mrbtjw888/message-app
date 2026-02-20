
API:

Message:
GET    /api/message                     (global feed, cursor)
POST   /api/message                     (auth)
GET    /api/message/:id
DELETE /api/message/:id                 (owner only)

Likes:
POST   /api/message/:id/like            (auth)
DELETE /api/message/:id/like            (owner only)
GET    /api/users/:username/liked       (cursor)

Users
GET    /api/users/:username             (public profile)
GET    /api/users/:username/messages    (cursor)


---


Client routes:

/							index / feed
/:username					user profile
/:username/status/:id		message
/:username/liked			liked message
/login						login page
/sign-up 					sign in page
/account					account page


Feature:

1.User sign up / sign in / delete account
2.User + guest can view messages
3.Profile page (user’s messages)
4.Post message
5.Like message


DONE:

POST   /api/message
GET    /api/message/:id
DELETE /api/message/:id


POST   /api/message/:id/like
DELETE /api/message/:id/like  
GET    /api/users/:username/liked


GET    /api/users/:username
GET    /api/users/:username/messages
