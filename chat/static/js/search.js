addFriends = document.querySelectorAll('.addFriend');
console.log(addFriends)
Array.from(addFriends).forEach(function(button) {
    console.log(button)
    button.addEventListener('click', function() {
        var username = button.classList[3];
        var newHTTPRequest = new XMLHttpRequest()
        newHTTPRequest.onload = function() {
            button.remove()
        }
        newHTTPRequest.open('GET', "http://localhost:3000/chat/add_friend?username=" + username + "&friend_request_sent=true");
        newHTTPRequest.send();
    })
});
deleteFriendRequest = document.querySelectorAll('.deleteFriend');
Array.from(deleteFriendRequest).forEach(function(button) {
    button.addEventListener('click', function() {        
        var username = button.classList[3];
        var newHTTPRequest = new XMLHttpRequest()
        newHTTPRequest.onload = function() {
            button.remove()
        }
        newHTTPRequest.open('GET', "http://localhost:3000/chat/add_friend?username=" + username + "&friend_request_sent=false");
        newHTTPRequest.send();
    })
})