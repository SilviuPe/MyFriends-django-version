var notifications = document.querySelectorAll('.notification');
for(let i = 0; i < notifications.length; i++) {
    var p_element = notifications[i].children[0];
    var type = p_element.querySelector('.type').innerHTML;
    if (type === "Friend Request") {
        var accept_friend_button = notifications[i].children[1];
        console.log(accept_friend_button)
        accept_friend_button.addEventListener('click', function() {
            var newHTTP = new XMLHttpRequest();
            newHTTP.onload = function() {
                notifications[i].remove();
            }
            notification_id = notifications[i].classList[1]
            newHTTP.open("GET", "http://localhost:3000/chat/friend_request?notification_id=" + notification_id + "&accepted=true" )
            newHTTP.send();
        })
        var decline_friend_button = notifications[i].children[2];
        console.log(decline_friend_button);
        decline_friend_button.addEventListener('click', function() {
            var newHTTP = new XMLHttpRequest();
            newHTTP.onload = function() {
                notifications[i].remove();
            }
            notification_id = notifications[i].classList[1]
            newHTTP.open("GET", "http://localhost:3000/chat/friend_request?notification_id=" + notification_id + "&accepted=false" )
            newHTTP.send();
        })
}
}   