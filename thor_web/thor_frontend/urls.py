from django.conf.urls import patterns, url
from thor_frontend import views

handler404 = views.error404

urlpatterns = patterns('thor_frontend.views',
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login, name='login'),
    url(r'^register/$', views.register, name='register'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^about/$', views.about, name='about'),
    url(r'^decks/$', views.decks, name='deck_view'),
    url(r'^decks/create$', views.deck_create, name='deck_create'),
    url(r'^decks/(?P<deck_pk>[0-9]+)/$', views.deck_detail, name='deck_detail'),
)

