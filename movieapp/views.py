from django.shortcuts import render
from rest_framework.response import Response
from .serializers import *
from .models import *
from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
class UserView(ModelViewSet):
    serializer_class=UserSerial
    # permission_classes=[IsAuthenticated]

    def get_queryset(self):
        userid=self.request.user.id
        return User.objects.filter(id=userid)
    
class MoviewViews(ModelViewSet):
    serializer_class=MovieSerial
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        user_id=self.request.user.id
        return Moview.objects.filter(user=user_id)

class Loged_user(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self,request):
        serializer=UserSerial(request.user)
        return Response(serializer.data)