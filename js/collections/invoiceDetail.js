define([
  'jquery',
  'underscore',
  'backbone',
  'models/client'
], function($, _, Backbone, clientModel){
  var invoiceCollection = Backbone.Collection.extend({

    model: clientModel,

		/*url: function() {
			var clientId = $storage('clientId').get();
			return '/controllers/invoiceDetail.php?clientId=' + clientId + '&invoiceNum=5665';
		},*/

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

  return new invoiceCollection;
});