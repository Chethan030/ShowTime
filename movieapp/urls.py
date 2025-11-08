

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import *
from rest_framework.routers import DefaultRouter
router=DefaultRouter()
router.register(r'users',UserView,basename='users_name')
router.register(r'movies',MoviewViews,basename='moviews')

urlpatterns=[
    path('me/',Loged_user.as_view()),
    path('token/',TokenObtainPairView.as_view())
]+router.urls