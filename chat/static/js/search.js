function sendFriendRequest(button) {
    var username = button.classList[3];
    var newHTTPRequest = new XMLHttpRequest()
    newHTTPRequest.onload = function() {
        var parent_element = button.parentElement;
        button.remove();
        var new_button = document.createElement('button');
        new_button.innerHTML = "Delete Friend Request"
        new_button.classList.add('btn', 'btn-danger', 'deleteFriend', username);
        new_button.addEventListener('click', () => {
            deleteFriendRequest(new_button);
        })
        parent_element.appendChild(new_button);
    }
    newHTTPRequest.open('GET', "http://localhost:3000/chat/add_friend?username=" + username + "&friend_request_sent=true");
    newHTTPRequest.send();
}

function deleteFriendRequest(button) {
    var username = button.classList[3];
    var newHTTPRequest = new XMLHttpRequest()
    newHTTPRequest.onload = () => {
    var parent_element = button.parentElement;
        button.remove();
        var new_button = document.createElement('button');
        new_button.innerHTML = "Send Friend Request"
        new_button.classList.add('btn', 'btn-success', 'addFriend', username);
        new_button.addEventListener('click', () => {
            sendFriendRequest(new_button);
        });
        parent_element.appendChild(new_button);
    }
    newHTTPRequest.open('GET', "http://localhost:3000/chat/add_friend?username=" + username + "&friend_request_sent=false");
    newHTTPRequest.send();
}


var friendRequests_list = document.querySelectorAll('.addFriend');
Array.from(friendRequests_list).forEach(function(button) {
    button.addEventListener('click', () => {
        sendFriendRequest(button);
    })
});


var deleteFriendRequest_list = document.querySelectorAll('.deleteFriend');
Array.from(deleteFriendRequest_list).forEach(function(button) {
    button.addEventListener('click', function() {        
        deleteFriendRequest(button);
    })
})