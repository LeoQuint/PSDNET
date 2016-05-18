# PSDnet Documentation.
`Just started`

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
```