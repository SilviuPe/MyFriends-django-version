from django.urls import path, include 
from . import views

app_name = 'chat'

urlpatterns = [
    path('',views.dashboard, name = "dashboard"),
    path('dashboard/',views.dashboard, name = "dashboard"),
    path('logout/', views.logout),
    path('profile/', views.profile, name = "profile"),
    path('change_email', views.change_email, name = "change email"),
    path('change_password', views.change_password, name = "change password"),
    path('friends', views.friends, name = "friends list"),
    path('notifications', views.notifications, name = "notifications list"),
    path('messages', views.messages, name = "Messages"), # Messages requested from AJAX
    path('send_message', views.send_message, name = "New Messages"), # Message sent with AJAX
    path('friend_request', views.friend_request_accept, name = "Friendship"),
    path('search/', views.search, name = "search"),
    path('add_friend/', views.friend_request_notification, name = "Friend Request"),
    path('delete_message', views.delete_message,name = "delete message"),
    path('upload_file', views.upload_file, name = "upload file")
]