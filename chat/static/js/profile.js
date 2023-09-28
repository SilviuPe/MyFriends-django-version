var images_table = document.getElementById("images_for_avatar");
var avatarSelectorButton = document.querySelector('.avatar_selector');
var COLUMNS = 2;
var ROWS = 1;
var AVATAR_SELECTED = String();
var nameInit = document.getElementById('username_in').value;

function getImageUrl(row, column) {
    return STATIC_URL + `avatar${row}${column}.png' %}`;
}
let avatar = document.getElementsByClassName("avatar_image"); // Images for avatar (avatar11.png, avatar12.png etc...)

var avatarSelectorButton = document.querySelector('.avatar_selector'); // Selector button for avarat
var initialAvatar = avatarSelectorButton.style.backgroundImage; // The url for background image of selector button 
var imagesTable = document.getElementById('images_for_avatar'); // Table for the images 
/* Edit the size and attach an function to the images 
    function() => when pressing one of the avatar image background-image 
    url of the button selector change into that image  
*/
for(var i = 0; i < avatar.length; i++) {
    avatar[i].width = 40;
    avatar[i].height = 40;
    avatar[i].style.borderRadius = "100%";
    avatar[i].onclick = function() {
            AVATAR_SELECTED = this.src;
            avatarSelectorButton.style.backgroundImage = `url(${this.src})`
            avatarSelectorButton.classList.add('button_into_image');    
            avatarSelectorButton.innerHTML = "";
        }
    }


avatarSelectorButton.addEventListener('click', function() {
imagesTable.classList.toggle('show-table');
});

var save_changes_button = document.querySelector(".save_button");
var change_email = document.querySelector('.email_button');
var change_password = document.querySelector('.password_button');

change_email.onclick = function() {
    window.location.href = "/chat/change_email"
}
change_password.onclick = function() {
    window.location.href = "/chat/change_password"
}

save_changes_button.addEventListener('click', function() {
    var new_form = document.getElementById('profile_form');

    var username = document.getElementById('username_in');
    var avatar_url = document.querySelector('.avatar_selector').style.backgroundImage;
    if(username.value === '') {
        var errors_field = document.querySelector('.errors');
        document.querySelector('.success_message').replaceChildren();
        errors_field.innerHTML = "The username field cannot be empty."
        username.style.border = "solid 1px red";
        return;
    }
    if(nameInit !== username.value) {
        new_form.appendChild(username);
    }
    if(avatar_url !== initialAvatar) {
        var avatar_input = document.createElement('input');
        avatar_input.name = "avatar_url";
        avatar_input.setAttribute('value',avatar_url);
        new_form.appendChild(avatar_input); 
    }
    document.body.appendChild(new_form);
    new_form.submit();
});