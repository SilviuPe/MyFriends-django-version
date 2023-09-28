addFriends = document.querySelectorAll('.addFriend');
console.log(addFriends)
Array.from(addFriends).forEach(function(button) {
    console.log(button)
    button.addEventListener('click', function() {
        console.log(button.classList)
    })
});