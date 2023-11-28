
# [GoodDeeds](https://www.heroku.com/)
## Team RARA
### Purpose and Functionality
GoodDeeds is a platform by which local citizens perform service for one another. Specifically, verified locals of the city can post and accept “deeds” to complete based on sector, difficulty, and time required. In exchange, they receive “kudos” which can then be exchanged for governmental benefits. Users are able to post and accept jobs and give feedback to each other, and our verification system ensures that kudos are rightfully exchanged.

### Deployment URL
https://gooddeeds-team-rara.herokuapp.com/

### Instructions to Run Locally:
In command line:
```console
$ npm i
$ npm run serve
```
In a separate shell:
```console
$ npm start
```
then you will find the application at `localhost:8080` in the browser

### Authorship:
* **Raul Campos**:
  * schemas
    * Feedback.js
  * src
    * Deed.vue
    * DeedList.vue
    * SignInForm.vue
    * SignOut.vue
    * Account.vue
  * models
    * user-controller.js
    * feedback-controller.js
  * routes
    * users.js
    * feedback.js
    * middleware.js
* **Raxel Gutierrez**:
  * models
    * user-controller.js
  * routes
    * session.js
    * middleware.js
  * views
    * App.vue
  * src
    * Deed.vue
    * CreedDeedForm.vue
    * Main.vue
    * Navbar.vue
    * UpdateDeed.vue
    * UpdateButton.vue
  * public
    * stylesheets
      * style.css
* **Angelica Castillejos**:
  * schema 
    *  Deed
    *  User
  * routes
    * deeds.js
    * middleware.js
  * models
    * deed-controller.js
    * difficultyLevels.js
  * components 
    * Map.vue 
    * MapMarker.vue 
    * Message.vue 
    * Profile.vue
    * DeedList.vue
    * DeleteButton.vue
  * views 
    * ErrorPage.vue
* **Ajay Arora**:
  * schema
    * User
    * Reward
  * routes
    * users.js
    * deeds.js
    * session.js
    * middleware.js
    * rewards.js
  * src:
    * Navbar.vue 
    * Profile.vue
    * Deed.vue
    * DeedList.vue
    * CreateDeedForm.vue
    * UserRewardList.vue
    * UserRewardListItem.vue
  * models
    * deed-controller.js
    * user-controller.js
    * reward-controller.js
