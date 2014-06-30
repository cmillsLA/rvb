define([
  'jquery',
  'underscore',
  'backbone',
  'models/client'
], function($, _, Backbone, clientModel){
  var clientCollection = Backbone.Collection.extend({

    model: clientModel,

		url: function() {
			var clientId = $storage('clientId').get();
			return '/controllers/customerData.php?clientId=' + clientId;
		},

    initialize: function() {
    },

    sync: function(method, model, options) {
        options.timeout = 10000;
				options.dataType = "json";
        return Backbone.sync(method, model, options);
    },

    parse: function(response) {
			
        if (typeof response !== 'undefined') {
            this.result = response;
        }

        return this.result;
    }

  });

  return new clientCollection;
});