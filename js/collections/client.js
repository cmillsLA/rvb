define([
  'jquery',
  'underscore',
  'backbone',
  'models/client'
], function($, _, Backbone, clientModel){
  var clientCollection = Backbone.Collection.extend({

    model: clientModel,

    url: '/data/client.json',

    initialize: function() {
    },

    sync: function(method, model, options) {
				// local cache
        //console.log('importResults sync');
        options.timeout = 10000;
        //options.dataType = "jsonp";
				options.dataType = "json";
        return Backbone.sync(method, model, options);
    },

    parse: function(response) {
			
        if (typeof response.client !== 'undefined') {
            this.result = response.client;
						//console.log(this.result);
        }

        return this.result;
    }

  });

  return new clientCollection;
});