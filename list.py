import webapp2
from google.appengine.ext import ndb
import db_models
import json

class List(webapp2.RequestHandler):
	def post(self):
        	self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST")
        	self.response.headers.add_header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        	self.response.headers.add_header('Content-Type', 'application/json')	
		
		if 'application/json' not in self.request.accept:
                        self.response.set_status(406, "API only supports application/json MIME type")
                        self.response.write(self.response.status)
			return
		new_list = db_models.List()
		name = self.request.get('name', default_value=None)
		items = self.request.get('items[]', default_value=None)
		if name:
			new_list.name = name
		else:
			self.response.status = 400
			self.response.status_message = "Invalid Request, name required"
		if items:
			for item in items:
				new_list.items.append(ndb.Key(db_models.Item, int(item)))
		
		key = new_list.put()
		out = new_list.to_dict()
		self.response.write(json.dumps(out))
		#return
	
	def get(self, **kwargs):
        	self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        	self.response.headers.add_header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        	self.response.headers.add_header('Content-Type', 'application/json')	

		if 'application/json' not in self.request.accept:
                        self.response.set_status(406, "API only supports application/json MIME type")
                        self.response.write(self.response.status)
			return

		if 'id' in kwargs:	
                     	out = ndb.Key(db_models.List, int(kwargs['id'])).get().to_dict()
			self.response.write(json.dumps(out))

                else:
			q = db_models.List.query()
                        names = q.fetch()
			keys = q.fetch(keys_only=True);

			results = { 'names' : [x.name for x in names]}
			mykeys = { 'keys' : [x.id() for x in keys]}

			results.update(mykeys);
			self.response.write(json.dumps(results))

	def options(self, **kwargs):
                self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
                self.response.headers.add_header("Access-Control-Allow-Origin", "*")

        def delete(self, **kwargs):
                self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
                self.response.headers.add_header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                self.response.headers.add_header("Access-Control-Allow-Origin", "*")
                self.response.headers.add_header('Content-Type', 'application/json')

		if 'application/json' not in self.request.accept:
                        self.response.status = 406
                        self.response.status_message = "API only supports application/json MIME type"
                        return

                if 'id' in kwargs:
                        list_key = ndb.Key(db_models.List, int(kwargs['id']))
                        
			items_in_list = db_models.Item.query()
			item_keys = items_in_list.fetch(keys_only=True);

			#delete items in list
			for key in item_keys:
				key.delete()

			#delete list
			list_key.delete()



class ListItems(webapp2.RequestHandler):
	def options(self, **kwargs):
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        	self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	
	def get(self, **kwargs):
        	self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        	self.response.headers.add_header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        	self.response.headers.add_header('Content-Type', 'application/json')	

		if 'application/json' not in self.request.accept:
                        self.response.set_status(406, "API only supports application/json MIME type")
                        self.response.write(self.response.status)
			return

		if 'id' in kwargs:	
                     	out = ndb.Key(db_models.List, int(kwargs['id'])).get().to_dict()
			self.response.write(json.dumps(out))

                else:
			q = db_models.List.query()
                        names = q.fetch()
			keys = q.fetch(keys_only=True);

			results = { 'names' : [x.name for x in names]}
			mykeys = { 'keys' : [x.id() for x in keys]}

			results.update(mykeys);
			self.response.write(json.dumps(results))
	
	def put(self, **kwargs):
		self.response.headers.add_header("Content-Length", "0")	
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
		self.response.headers.add_header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
                self.response.headers.add_header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                self.response.headers.add_header('Content-Type', 'application/json')		
	
		if 'application/json' not in self.request.accept:
			self.response.status = 406
			self.response.status_message = "API only supports application/json MIME type"
		if 'lid' in kwargs:
			my_list = ndb.Key(db_models.List, int(kwargs['lid'])).get()
			if not my_list:
				self.response.status = 404
				self.response.status_message = "List Not Found"
				return
		if 'iid' in kwargs:
			item = ndb.Key(db_models.Item, int(kwargs['iid']))
			if not my_list:
				self.response.status = 404
				self.response.status_message = "Item Not Found"
				return
		if item not in my_list.items:
			my_list.items.append(item)
			my_list.put()
		self.response.write(json.dumps(my_list.to_dict()))
		return
