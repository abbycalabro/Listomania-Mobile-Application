import webapp2
from google.appengine.ext import ndb
import db_models
import json

class Item(webapp2.RequestHandler):
	def post(self):
		self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
                self.response.headers.add_header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                self.response.headers.add_header("Access-Control-Allow-Origin", "*")
                self.response.headers.add_header('Content-Type', 'application/json')	
		
		if 'application/json' not in self.request.accept:
			self.response.status = 406
			self.response.status_message = "API only supports application/json MIME type"
			return
		new_item = db_models.Item()
		name = self.request.get('name', default_value=None)
		
		quantity = self.request.get('quantity', default_value='1')
		if quantity.isdigit():
			quantity = int(quantity)
		else:
			self.response.write("Error: quantity must be an int")
			return

		checked = self.request.get('checked')
		if checked == "True" or checked == "true":
			checked = True
		elif checked == "False" or checked == "false":
			checked = False
		else:
			checked = False

		#required, return error if absent
		if name:
			new_item.name = name
		else:
			self.response.status = 400
			self.response.status_message = "Invalid Request, item name required"
			return
		#optional, no error if absent
		if quantity:
			new_item.quantity = quantity
			
		new_item.checked = checked

		key = new_item.put()
		out = new_item.to_dict()
		self.response.write(json.dumps(out))
		return

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
                        out = ndb.Key(db_models.Item, int(kwargs['id'])).get().to_dict()
                        self.response.write(json.dumps(out))
                else:
			q = db_models.Item.query()
                        names = q.fetch()
                        keys = q.fetch(keys_only=True);
			quantities = q.fetch()

                        results = { 'names' : [x.name for x in names]}
                        mykeys = { 'keys' : [x.id() for x in keys]}
			myquantities = { 'quantities' : [x.quantity for x in quantities]}

                        results.update(mykeys);
			results.update(myquantities);
                        
			
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
			#delete item
			item_key = ndb.Key(db_models.Item, int(kwargs['id']))
			item_key.delete()
			#delete item key from associated list/s
			lists_containing_item = db_models.List.query(db_models.List.items == item_key)
			for current_list in lists_containing_item:
				current_list.items.remove(item_key)
				current_list.put()

		else:
                        q = db_models.Item.query()
                        keys = q.fetch(keys_only=True)

