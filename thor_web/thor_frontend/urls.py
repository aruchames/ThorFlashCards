from django.conf.urls import patterns, url
from thor_frontend import views

urlpatterns = patterns('thor_frontend.views',
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login, name='login'),
    url(r'^register/$', views.register, name='register'),
    url(r'^logout/$', views.logout, name='logout'),

    url(r'^', views.error404, name='error404'),
)


handler404 = 'mysite.views.error404'
