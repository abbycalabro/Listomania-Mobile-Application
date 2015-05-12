import webapp2
from google.appengine.api import oauth

app = webapp2.WSGIApplication([
	('/index', 'list.List'),
], debug=True)

app.router.add(webapp2.Route('/item', 'item.Item'))
app.router.add(webapp2.Route('/item/<id:[0-9]+><:/?>', 'item.Item'))
app.router.add(webapp2.Route(r'/list', 'list.List'))
app.router.add(webapp2.Route(r'/list/<id:[0-9]+><:/?>', 'list.List'))
app.router.add(webapp2.Route(r'/list/<lid:[0-9]+>/item/<iid:[0-9]+><:/?>', 'list.ListItems')) 
