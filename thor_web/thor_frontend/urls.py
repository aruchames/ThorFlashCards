from django.conf.urls import patterns, url
from thor_frontend import views

urlpatterns = patterns('thor_frontend.views',
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login, name='login'),
)
