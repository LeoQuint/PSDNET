# PSDnet Documentation.


#### Html Layout

##### index.html
	Contains everything. Entry point to the one page app.

###### navbar.html 
_This is held on index and is present in all pages._
	


###### ng-view


1. About
  * [3Pillars.html](app/public/views/About/3pillars.html)
  * [about.html](app/public/views/About/about.html)
  * [contact.html](app/public/views/About/contact.html)
2. Community
  * [community.html](app/public/views/Community/community.html)
  * [forum.html](app/public/views/Community/forum.html)
   `forum.html also uses [aPost.html](app/public/views/Community/aPost.html) inside a directive to display each posts.`
3. Dashboard
  * [profile.html](app/public/views/Dashboard/profile.html)
   `profile.html uses [chat.html](app/public/views/Mentorship/chat.html) has a directive for displaying live chat.`
4. Education
  * [education.html](app/public/views/Education/education.html)
  * [news.html](app/public/views/Education/news.html)
  * [podcasts.html](app/public/views/Education/podcasts.html)
  * [webinars.html](app/public/views/Education/webinars.html)
5. Featured
  * [featured.html](app/public/views/Featured/featured.html)
6. Mentorship
  * [mentorships.html](app/public/views/Mentorship/mentorships.html)
   `currently not included. Added inside profile.html.`
  * [signup.html](app/public/views/Mentorship/signup.html)
  * [training.html](app/public/views/Mentorship/training.html)
  * [mentor.html](app/public/views/Mentorship/mentor.html)
  * [evaluation.html](app/public/views/Mentorship/evaluation.html)

#### Modules Used

[angular-timeline](https://github.com/rpocklin/angular-timeline) for the timeline.

#### Content Manager

`Part of the admin dropdown menu available to authorized personel.`

##### Messages

`The messages objects hold all the text/nformation to be displayed and changed regularly.`


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
-ContentMangerModel
	Only one of this model stored in the DB. Contains an object for each pages we want to set
	messages and text in the content manager. 
```