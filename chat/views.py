from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import AvatarModel
from .forms import ChangeEmailForm, ChangePasswordForm
from django.contrib.auth import authenticate
from django.shortcuts import redirect
from .models import Friendship, Message, Notification
from django.http import JsonResponse


import time
import json 


def dashboard(request):
    try:
        user = User.objects.get(username = request.session['username'])
        avatar_instance, create = AvatarModel.objects.get_or_create(user=user, defaults = {'avatar_id': 'url("http://localhost:3000/static/chat/empty.png")'})
        if request.session['username']: 
            return render(request, 'chat/chat_panel.html', context = {"avatar_id": avatar_instance.avatar_id[5:-2]})
    except Exception as e:
        print(e)
        return redirect('/login')



def logout(request):
    request.session.clear()
    return redirect('/')


def profile(request):
    rows_list = [
            ["empty.png"],
            ["avatar11.png","avatar12.png", "avatar13.png"],
            ["avatar21.png", "avatar22.png","avatar23.png"],
        ]
    avatar_instance = None
    user = None 
    try:
        user = User.objects.get(username = request.session['username'])
        avatar_instance = AvatarModel.objects.get(user=user)
    except:
        return render(request, 'register/login.html')
    
    if request.method == "GET":
        return render(request, 'profile/profile.html', context= {
            "rows_range" : rows_list,
            "avatar_url" : avatar_instance.avatar_id,
        })
        
    elif request.method == "POST":
        if 'avatar_url' in request.POST:
            avatar_instance.avatar_id = request.POST['avatar_url']
            avatar_instance.save()
        if 'username' in request.POST:
            user.username = request.POST['username']
            user.save()
            request.session['username'] = request.POST['username']
        return render(request, 'profile/profile.html', context= {
            "rows_range" : rows_list,
            "avatar_url" : avatar_instance.avatar_id,
            "success_saved_message" : "Your changes has been saved with success!"
        })
        
def change_email(request):
    change_email_form = ChangeEmailForm()
    if request.method == "GET":
        return render(request, 'chat/change_email.html', context = {"change_email_form" : change_email_form })
    elif request.method == "POST":
        if 'password_verify' in request.POST:
            user_verify = authenticate(request, username = request.session['username'], password = request.POST['password_verify'])
            if user_verify is not None:
                if 'new_email' in request.POST:
                    user = User.objects.get(username = request.session['username'])
                    if request.POST['new_email'] != user.email:
                        user.email = request.POST['new_email']
                        user.save()
                        success_message = "Your email has been changed with success!" 
                        return render(request,'chat/change_email.html',context = {"change_email_form" : change_email_form,
                                                                                  "success_message" : success_message
                                                                                  })
        return HttpResponse("ERROR")
    
def change_password(request):
    change_password_form = ChangePasswordForm()
    if request.method == "GET":
        return render(request, 'chat/change_password.html', context = {"password_form" : change_password_form })
    elif request.method == "POST":
        if 'old_password' in request.POST and 'new_password' in request.POST:
            user_verify = authenticate(request, username = request.session['username'], password = request.POST['old_password'])
            if user_verify is not None:
                user = User.objects.get(username = request.session['username'])
                user.set_password(request.POST['new_password'])
                user.save()
                success_message = "Your password has been changed with success!" 
                return render(request,'chat/change_password.html',context = {"password_form" : change_password_form,
                                                                            "success_message" : success_message
                                                                            })
        return HttpResponse("ERROR")
    
    
    
def friends(request):
    user = User.objects.get(username = request.session['username'])
    friends_list = Friendship.objects.filter(creator = user)
    friends_list_reverse = Friendship.objects.filter(following = user)
    print(friends_list)
    friend_dict = dict()
    for friend in friends_list:
        name = friend.following.username
        avatar = AvatarModel.objects.get(user = User.objects.get(username = name)).avatar_id
        friend_dict.update({name : avatar})
    if len(friend_dict) == 0:
        for friend in friends_list_reverse:
            name = friend.creator.username
            avatar = AvatarModel.objects.get(user = User.objects.get(username = name)).avatar_id
            friend_dict.update({name : avatar})
    return render(request, 'chat/friends.html', context = {'friend_list' : friend_dict})


def notifications(request):
    user = User.objects.get(username = request.session['username'])
    notifications = Notification.objects.filter(user = user)
    notifications_list = list()
    for n in notifications:
        new_list = (n.user_from.username, n.notification_type, n.message, n.seen, n.id)
        notifications_list.append(new_list)
    #print(notifications_list)
    return render(request, 'notification/notifications.html', 
                  context= {'notifications_list':notifications_list})


def messages(request):
    sender = User.objects.get(username = request.session['username'])
    receiver = User.objects.get(username = request.GET.get('receiver_username'))
    messages = Message.objects.filter(sender = sender, receiver = receiver)
    messages_from = Message.objects.filter(sender = receiver, receiver = sender)
    conversation = {
        sender.username : {
            
        },
        receiver.username : {
            
        }
    }
    for message in messages:
        conversation[sender.username].update({
            message.message :  f"On {str(message.date)} at {str(message.time).split('.')[0]}"
        })
    for message in messages_from:
        conversation[receiver.username].update({
            message.message : f"On {str(message.date)} at {str(message.time).split('.')[0]}"
        })
    return JsonResponse(conversation)

def send_message(request):
    sender = User.objects.get(username = request.session['username'])
    receiver = User.objects.get(username = request.GET.get('receiver_username'))
    new_message = Message()
    new_message.sender = sender 
    new_message.receiver = receiver
    new_message.message = request.GET.get('message')
    new_message.save()
    return HttpResponse("Message Succesfully Sended!");


def friend_request_accept(request):
    notification = Notification.objects.get(id = request.GET.get('notification_id'))
    if request.GET.get('accepted') == 'true':
        following = notification.user_from
        creator = notification.user 
        Friendship.objects.create(
            creator = creator,
            following = following
        )
        notification.delete()
        return HttpResponse("Friend Request Accepted")
    notification.delete()
    return HttpResponse("Friend Request Declined")


def search(request):
    query = set(request.GET.get('s').lower())
    users = User.objects.all()
    users_match = list()
    user_ = User.objects.get(username = request.session["username"])
    for user in users:
        similarity = len(query.intersection(set(user.username.lower()))) / len(query.union(set(user.username.lower())))
        if int(similarity*100) >= 50 and user != user_:
            friendship = Friendship.objects.filter(creator = user, following = user_)
            notification = Notification.objects.filter(user = user, user_from = user_, notification_type = "Friend Request")
            if not friendship:
                avatar = AvatarModel.objects.get(user = user)
                user_tuple = (user.username, avatar.avatar_id[5:-2],len(notification) > 0)
                users_match.append(user_tuple)
    print(users_match)
    return render(request, 'chat/search.html', context = {
        'users_match' : users_match
    })
    
    
def friend_request_notification(request):
    if request.GET.get('friend_request_sent') == "true":
        user = User.objects.get(username = request.GET.get('username'))
        user_from = User.objects.get(username = request.session['username'])
        Notification.objects.create(
            user = user,
            user_from = user_from,
            notification_type = "Friend Request",
            message = str()
        )
        return HttpResponse("Friend Request Sent")
    else:
        user = User.objects.get(username = request.GET.get('username'))
        user_from = User.objects.get(username = request.session['username'])
        notification = Notification.objects.get(
            user = user,
            user_from = user_from,
            notification_type = "Friend Request"
        )
        notification.delete()
        return HttpResponse("Friend Request Deleted")