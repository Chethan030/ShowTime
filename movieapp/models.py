from django.db import models
from django.contrib.auth.models import User


class Moview(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_relaton')
    movie_types=(('Movie','movie'),
                 ('Shows','shows'))
    Title=models.CharField(max_length=200)
    Type=models.CharField(choices=movie_types,max_length=200)
    Director=models.CharField(max_length=200)
    Budget=models.CharField(max_length=200)
    Location=models.CharField(max_length=200)
    Duration=models.CharField(max_length=30)
    year=models.DateField(auto_now_add=False)

    def __str__(self):
        return f'{self.Title}-----------{self.id}'



