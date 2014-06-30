define([
    'jquery',
    'underscore',
    'backbone',
		'jquery.ui',
		'jquery.validate',
    'text!templates/amortization/index.html'
], function($, _, Backbone, jui, Validate, getResults, template) {
    var amortizationView = Backbone.View.extend({

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
    return new amortizationView;
});