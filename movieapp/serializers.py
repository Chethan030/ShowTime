

from rest_framework import serializers

from .models import *
from django.contrib.auth.models import User

class UserSerial(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','password']
        extra_kwargs={'password':{'write_only':True}}
    

    def create(self, validated_data):
        try:
            password=self.validated_data.pop('password')
            user=User(**validated_data)
            user.set_password(password)
            user.save()    
            return user
        except Exception as e:
            raise serializers.ValidationError(e)

    
class MovieSerial(serializers.ModelSerializer):
    class Meta:
        model = Moview
        fields = ['id', 'user', 'Type', 'Title', 'Director', 'Budget', 'Location', 'Duration', 'year']
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            validated_data['user']=user
            return super().create(validated_data)
        except Exception:
            raise serializers.ValidationError('You mush login first to perform a action')
        

