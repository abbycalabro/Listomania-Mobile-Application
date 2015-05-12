from google.appengine.ext import ndb

class Model(ndb.Model):
	def to_dict(self):
		d = super(Model, self).to_dict()
		d['key'] = self.key.id()
		return d

class List(Model):
	name = ndb.StringProperty(required=True)
	items = ndb.KeyProperty(repeated=True)

	def to_dict(self):
		d = super(List, self).to_dict()
		d['items'] = [i.id() for i in d['items']]
		return d

class Item(Model):
	name = ndb.StringProperty(required=True)
	quantity = ndb.IntegerProperty()
	checked = ndb.BooleanProperty()

