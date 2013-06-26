/**
 * Javascript functions related to Facebook features
 **/
 
function getFriendList(){
  var fdata;
  FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
    if (response.error) {
      alert(JSON.stringify(response.error));
    } else {
      var friends = document.getElementById('friends');
      fdata = response.data;
      response.data.forEach(function(item) {
        var d = document.createElement('div');
        d.innerHTML = "<img src=\"https://graph.facebook.com/" + item.id + "/picture\" />" + item.name;
        friends.appendChild(d);
     });
    }    
  });
}
      
function FBlogin() {
  FB.login(
    function(response) {
      if (response.authResponse) {
        alert("Welcome to FBFriendsApp");
      } else {
        alert('not logged in');
      }
    },
    { scope: "email" }
  );
}
