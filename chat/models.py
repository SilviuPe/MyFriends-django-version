from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import AbstractUser
from time import localtime, strftime


from datetime import date


class AvatarModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar_id = models.CharField(max_length=100, default = 'url("http://localhost:3000/static/chat/empty.png")')
    
    def __str__(self) -> str:
        return self.user.username
    
    
class Friendship(models.Model):
    creator = models.ForeignKey(User, related_name = "friendship_creator_set", on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name="friend_set", on_delete=models.CASCADE)
    id = models.AutoField(primary_key=True)
    
    def __str__(self):
        return f"{self.creator} with {self.following}"  
    

class Message(models.Model):
    sender = models.ForeignKey(User, related_name = "message_sender_set", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="receiver_set", on_delete=models.CASCADE)
    message_type = models.CharField(max_length=20, default= "text")
    message = models.CharField(max_length=400, default= "None")
    time = models.TimeField(auto_now_add=True)  
    date = models.DateField(auto_now_add=True)
    seen = models.BooleanField(default = False)
    id = models.AutoField(primary_key=True)
    
    def __str__(self) -> str:
        if self.message_type == "text":
            return f"From {self.sender.username} to {self.receiver.username}: {self.message} "
        else:
            return f"From {self.sender.username} to {self.receiver.username}: {self.message.split('/')}"


class Notification(models.Model):
    user = models.ForeignKey(User, related_name= "user_notification", on_delete=models.CASCADE)
    user_from = models.ForeignKey(User, related_name= "user_notification_sender", on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=30, default= "None")
    seen = models.BooleanField(default=False)
    message = models.CharField(max_length=300, default= "None")
    id = models.AutoField(primary_key=True) 
    
    def __str__(self) -> str:
        return f"{self.notification_type} from {self.user_from.username}: {self.message}"
    
    
class Update(models.Model):
    creator = models.ForeignKey(User, related_name="user_creator", on_delete=models.CASCADE)
    title = models.CharField(max_length=50,default="Update")
    message = models.CharField(max_length=1000, default = str())
    image_or_video = models.CharField(max_length=50, default= str())
    id = models.AutoField(primary_key=True)
    