friend_list = document.querySelectorAll('.button_friend');
document.querySelector('.chat_section').style.display = 'none';
var messages_length = 0;

class Message {
    constructor(sender,message,date) {
        this.sender = sender;
        this.message = message;
        this.date = date;
    }

    CustomMessage() {
        this.message_element = document.createElement('p');
        this.sender_text = document.createElement('SPAN');
        this.sender_content = document.createTextNode(this.sender + ': ');
        this.sender_text.appendChild(this.sender_content);
        this.sender_text.style.fontWeight = "bold";
        this.sender_text.style.color = "black";
        this.message_element.style.fontSize = "12px";
        this.message_element.style.color = "white";
        this.message_element.appendChild(this.sender_text);
        this.message_element.style.color = "rgb(170,170,170)";
        this.message_element.innerHTML += this.message;
        this.br_tag = document.createElement('br')
        this.br_tag.style.display = "block";
        this.br_tag.style.marginBottom = "0em";
        this.message_element.appendChild(this.br_tag);
        this.date_span = document.createElement('SPAN');
        this.date_span.appendChild(document.createTextNode(this.date));
        this.date_span.style.fontSize = "7px";
        this.message_element.appendChild(this.date_span);
        return this.message_element;
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
        else messages_length = response.length;
        var messages_list = [];
        var messages = JSON.parse(response);
        message_page = document.querySelector('.message_page');
        message_page.innerHTML = "";
        // Take every data (sender,receiver,date) that needed from response to create a message element 
        // and append it to a list
        Object.keys(messages).forEach(function(key) {
            sender = messages[key];
            Object.keys(sender).forEach(function(message) {
                var paragraph = new Message(key,message,sender[message]);
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
            message_page.appendChild(messages_list[i].message_element);
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
console.log(true);
console.log(false);
Array.from(friend_list).forEach(function(ele) {
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
},1000);


// send new messages to users 
text_area = document.querySelector('.text_input');
send_message_button = document.querySelector('.send_message_button');
message_page = document.querySelector('.message_page')
send_message_button.addEventListener('click', function() {
    text = text_area.value;
    if (text.replace(" ","") === "") return;
    send_message(last_message_opened,text);
    text_area.value = "";
});