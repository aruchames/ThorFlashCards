from django.conf.urls import patterns, include, url
from thor_backend import views

handler404 = views.error404

urlpatterns = patterns('thor_backend.views',
  url(r'^o/$', include('oauth2_provider.urls', namespace='ouath2_provider')),
  #url(r'^users/$', views.UserList.as_view()),
  #url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
  url(r'^users/me$', views.user_me),
  url(r'^decks/$', views.DeckList.as_view()),
  url(r'^decks/(?P<pk>[0-9]+)/$', views.DeckDetail.as_view()),
  url(r'^cards/$', views.create_card),
  url(r'^cards/(?P<pk>[0-9]+)/$', views.CardDetail.as_view()),
  url(r'^translate/(?P<query>.+)/$', views.translate),
)
