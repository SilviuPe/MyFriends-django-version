var friend_button_list = document.querySelectorAll('.button_friend');
document.querySelector('.chat_section').style.display = 'none';
var friend_username_list = document.querySelectorAll('.username_friend');
var choose_file_button = document.querySelector('.choose_file');
var input_file = document.getElementById('fileInput');
var file_name = document.querySelector('.file_name');

choose_file_button.addEventListener('click', () => {
    input_file.click();
});


input_file.addEventListener('change', () => {
    file_name.innerHTML = input_file.files.length > 0 ? input_file.files[0].name: "Choose File";
});


var messages_length = 0;

class Message {
    constructor(sender,message,date,id,message_type) {
        this.sender = sender;
        this.message = message;
        this.date = date;
        this.id = id;
        this.message_type = message_type;
    }

    CustomMessage() {
        this.content = document.createElement('div');
        let message_element = document.createElement('p');
        let sender_text = document.createElement('SPAN');
        let sender_content = document.createTextNode(this.sender + ': ');

        sender_text.appendChild(sender_content);
        sender_text.style.fontWeight = "bold";
        sender_text.style.color = "black";

        message_element.className = "message_element_js"

        this.content.className = "message_container";
        message_element.appendChild(sender_text);

        if (this.message_type === "text") {
            message_element.innerHTML += this.message;
        }
        else {
            let br_tag = document.createElement('br');
            br_tag.style.display = "block";
            br_tag.style.marginBottom = "0em";
            message_element.appendChild(br_tag);

            if (this.message_type === "image/png") {
                
                let image = document.createElement('img');
                image.src = this.message;
                image.className = "message_type_image";
                message_element.appendChild(image)

                this.content.appendChild(message_element);
            }
            else {
                let file_name = this.message.split('/')[this.message.split('/').length - 1]
                let download_file_button = document.createElement('button');
                download_file_button.className = "download_file_button";
                download_file_button.innerHTML = file_name + '<i style = "margin-left:6px;"class="fas fa-file-download"></i>';
                /* let icon_button = document.createElement('i');
                icon_button.className = "fas fa-file-download";
                download_file_button.appendChild(icon_button); */

                download_file_button.addEventListener('click', () => {
                    fetch(this.message)
                        .then(response => response.blob())
                        .then(blob => {
                            const objectURL = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = objectURL;
                            a.download = file_name;
                            a.textContent = 'Download File';
                            a.click();
                            URL.revokeObjectURL(objectURL);
                        })
                });
                message_element.appendChild(download_file_button);
            }

        }

        // ADD DATE AND DELETE BUTTON
        let br_tag = document.createElement('br')
        br_tag.style.display = "block";
        br_tag.style.marginBottom = "0em";
        message_element.appendChild(br_tag);
        let date_span = document.createElement('SPAN');
        date_span.appendChild(document.createTextNode(this.date));
        date_span.style.fontSize = "7px";
        message_element.appendChild(date_span);
        // Initiate button
        let delete_button = new CustomButton(
            "delete",delete_message, this.content);
        delete_button.InitiateButton(this.id);
        this.content.appendChild(message_element);
        if(this.sender === my_username)
            this.content.appendChild(delete_button.button);
        return this.content;
    }

}

function delete_message(id,message) {

    var newHTTP = new XMLHttpRequest()
    newHTTP.onload = function() {
    }
    newHTTP.open('GET','http://localhost:3000/chat/delete_message?id=' + id);
    newHTTP.send();
    console.log(message);
    message.remove();
}

class CustomButton {
    constructor(text,callback,message = NaN){  
        this.text = text;
        this.callback = callback;
        this.message = message;
    }

    InitiateButton(parameter) {
        this.button = document.createElement('button');
        this.button.textContent = this.text;
        this.button.className = "delete_button"
        this.button.addEventListener('click', () => {
            this.button.style.backgroundColor = "red";
            this.callback(parameter,this.message);
        });
    }
}

function load_messages(response, updateing = false) {
    {
        /* updateing it's used for updateing the messages in real time 
        comparing the last message length with a new one (if they are equal it means there aren't new message)
        updateing === TRUE => load_message function it's used in updateing messages state  
        updateing === FALSE => new messages page was requested 
        (if there aren't any exceptions this function must be executed) */


        if (messages_length === response.length && updateing) return;
        else if (messages_length > response.length) {
            messages_length = response.length;
            return;
        }
        else messages_length = response.length;
        var messages_list = [];
        var senders = JSON.parse(response);
        message_page = document.querySelector('.message_page');
        message_page.innerHTML = "";
        //var top_message = document.createElement('p');
        //top_message.innerHTML = "chat with " + last_message_opened
        //message_page.appendChild(top_message); 
        // Take every data (sender,receiver,date) that needed from response to create a message element 
        // and append it to a list
        Object.keys(senders).forEach(function(key) {
            var messages = senders[key];
            console.log(messages,"###",key);
            Object.keys(messages).forEach(function(message) {
                message_info = messages[message];
                var paragraph = new Message(key,message,message_info['date'],message_info['id'],message_info['type']);
                new_message = paragraph.CustomMessage();
                messages_list.push(paragraph);
            })
        })



        // Compare dates from messages to display in right order 
        for(let i = 0; i < messages_list.length; i++) {
            for(let h = i+1; h < messages_list.length; h++) {
                timeI = messages_list[i].date.split(' ')[3];
                dateI = new Date(messages_list[i].date.split(' ')[1] + ' ' + timeI);
                timeH = messages_list[h].date.split(' ')[3];
                dateH = new Date(messages_list[h].date.split(' ')[1] + ' ' + timeH);
                if(dateI > dateH)
                {
                    var auxmessage = messages_list[i];
                    messages_list[i] = messages_list[h];
                    messages_list[h] = auxmessage;
                }
                
            }
        }

        // Append messages in right order to the page 
        for(let i = 0; i < messages_list.length; i++) {
            message_page.appendChild(messages_list[i].content);
        }
        message_page.scrollTop = message_page.scrollHeight;
    }
}

/*
var date = sender[message].split(' ');
var dateTimeStr = date[1] + " " + date[3];
var dateTime = new Date(dateTimeStr);
*/


var last_message_opened = "";

function send_message(receiver,message) {
    newHTTP = new XMLHttpRequest();
    newHTTP.onload = function() {
        message_page = document.querySelector('.message_page');
        message_page.innerHTML = ""
        request_messages(receiver);
    }
    newHTTP.open("GET","http://localhost:3000/chat/send_message?receiver_username=" + receiver + "&message=" + message)
    newHTTP.send()
}


function request_messages(from_who,updateing = false) {
    // updateing it's used for updateing the messages in real time 
    if(from_who === "") return;
    var  newHTTP = new XMLHttpRequest();
    // When the request is received from server
    newHTTP.onload = function() {
        load_messages(this.response,updateing);
    }

    newHTTP.open("GET","http://localhost:3000/chat/messages?receiver_username=" + from_who); // open that request
    newHTTP.send(); // send the request with aditioan data
}
Array.from(friend_button_list).forEach(function(ele) {
    //console.log(ele)
    ele.addEventListener('click', function() {
        chat = document.querySelector('.chat_section');
        message_page = document.querySelector('.message_page');
        request_messages(ele.name);
        chat_display = chat.style.display;

        // CASE WHEN CHAT IS NOT DISPLAYED
        if (chat_display == "none") {
            chat.style.display = "block";
            message_page.innerHTML = '';
            let new_message_warning = ele.querySelector('.new_message');
            console.log(new_message_warning)
            if (new_message_warning) {
                new_message_warning.remove();
            }
        }
        // CASE WHEN CHAT IS DISPLAYED BUT THE CONVERSATION HAD CHANGED
        else if (last_message_opened != ele.name) {
            message_page.innerHTML = '';
        }
        // CASE WHEN WE WANT TO CLOSE THE CHAT (CLICK ON THE FRIEND BUTTON THAT YOU'RE CHATTING WITH)
        else if (last_message_opened == ele.name) {
            chat.style.display = "none";
            last_message_opened = "";
            return;
        }
        last_message_opened = ele.name;
    });
});


// requesting new message 
const interval_for_messages = setInterval(function () {
    request_messages(last_message_opened,true);
},500);


text_area = document.querySelector('.text_input');
send_message_button = document.querySelector('.send_message_button');
message_page = document.querySelector('.message_page')
send_message_button.addEventListener('click', function() {
    text = text_area.value;
    if (text.replace(" ","") === "" && input_file.files.length === 0) return;
    if (text.replace(" ","") !== "")
        send_message(last_message_opened,text);
    text_area.value = "";
    if (input_file.files.length > 0) {
        let input_receiver_username = document.getElementById('input_receiver_username');
        input_receiver_username.value = last_message_opened;
        console.log(input_receiver_username.value);
        let FileForm = document.getElementById('FileForm');
        var formData = new FormData(FileForm);
        var new_http = new XMLHttpRequest();
        console.log(formData);
        new_http.onload = () => {
            file_name.innerHTML = "no file";
            input_file.value = null;
        }
        new_http.open('POST', 'http://localhost:3000/chat/upload_file', true);
        new_http.send(formData);
    }
});

text_area.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        send_message_button.click();
        text_area.value = "";
        //let new_text_area = text_area;
        //let text_area_parent = text_area.parentNode;
        //new_text_area.value -= "\n"
        //text_area.remove();
        //text_area_parent.appendChild(new_text_area);
    }
});