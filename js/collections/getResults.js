define([
  'jquery',
  'underscore',
  'backbone',
  'models/get'
], function($, _, Backbone, getModel){
  var resultsCollection = Backbone.Collection.extend({

    model: getModel,

		/*url: function() {
			var clientId = $storage('clientId').get();
			return '/controllers/invoiceDetail.php?clientId=' + clientId + '&invoiceNum=5665';
		},*/

    initialize: function() {
    },

    sync: function(method, model, options) {
        options.timeout = 10000;
				options.dataType = "xml";
        return Backbone.sync(method, model, options);
    },

    parse: function(response) {
			
				console.log(response);
			
				var response = response.childNodes[0].innerHTML;
			
        if (typeof response !== 'undefined') {
            this.result = response;
        }
				console.log(this.result.toJSON());
        return this.result;
    }

  });

  return new resultsCollection;
});