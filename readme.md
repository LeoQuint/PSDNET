# PSDnet Documentation.


#### Html Layout

##### index.html
	Contains everything. Entry point to the one page app.

###### navbar.html 
_This is held on index and is present in all pages._
	


###### ng-view


1. About
  * [3Pillars.html](app/public/views/about/3Pillars.html)
  * about.html
  * contact.html
2. Community
  * community.html
  * forum.html
   `forum.html also uses aPost.html inside a directive to display each posts.`
3. Dashboard
  * profile.html
   `profile.html uses chat.html has a directive for displaying live chat.`
4. Education
  * education.html
  * news.html
  * podcasts.html
  * webinars.html
5. Featured
  * featured.html
6. Mentorship
  * training.html
  * timeline.html
   `currently not included. Added inside profile.html.`
  * signup.html
  * mentorships.html
  * mentor.html
  * evaluation.html

#### Modules Used

[angular-timeline](https://github.com/rpocklin/angular-timeline) for the timeline.

#### Resources

`Resources folder located in app/public.`

   Contains any resources that needs to be loaded on demand NOT from the database. Currently Messages folder is used to store json objects representing all communication for the current page displayed. When loaded it can be access inside html using {{ messages }}.




#### Models

```
-cm_Messages
	Used to hold messages and page content. Loaded by the page controller.
-cSearchable
	Custom model created with every instance of a searchable object. Instead of searching 
	every type of objects, we search all cSearchable ones and retrieve the reference. For 
	instance when we create a post on the forum we also create a cSearchable object with 
	the post reference and searchable data. 
-userProfile
	Holds all user information of a user. User privileges are also stored in userProfile.
-tl_event
	Used to create the timeline on the profile page. This is *part* of userProfile document
	as an array. Each event will represent a task, upcoming important date, past meetings, 
	conversation with mentor and other.
```