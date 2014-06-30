define([
    'jquery',
    'underscore',
    'backbone',
		'jquery.validate',
    'text!templates/mortgage/index.html'
], function($, _, Backbone, Validate, template) {
    var mortgageView = Backbone.View.extend({

        initialize: function() {
          $(this.el).html(template);
					this.render();
        },
				
				events: {
				},

        render: function() {
        	return this;
        }
    
    });
    return new mortgageView;
});