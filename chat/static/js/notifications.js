notifications = document.querySelectorAll('.notification');
for(let i = 0; i < notifications.length; i++) {
    p_element = notifications[i].children[0];
    type = p_element.querySelector('.type').innerHTML;
    if (type === "Friend Request") {
        accept_friend_button = notifications[i].children[1];
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
}
}   