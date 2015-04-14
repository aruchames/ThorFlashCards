from django.conf.urls import patterns, include, url
from thor_backend import views

urlpatterns = patterns('thor_backend.views',
  url(r'^o/$', include('oauth2_provider.urls', namespace='ouath2_provider')),
)