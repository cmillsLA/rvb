define([
  'jquery',
  'underscore',
  'backbone',
	'bootstrap',
	'jquery.ui',
	'jquery.validate',
	'highcharts',
	'views/dashboard/index',
	'views/mortgage/index',
	'views/amortization/index'
], function($, _, Backbone, Bootstrap, ui, Validate, Highcharts, dashboardView, mortgageView, amortizationView) {
		
		var AppRouter = Backbone.Router.extend({
			
				el: $("#page"),

        routes: {
						'amortization':'showAmortization',
            'mortgage': 'showMortgage',
						'index': 'showDashboard',
            '*actions': 'defaultAction'
        },
				
				resetNav: function(n) {
					$('.nav li').removeClass('active');
					$('#' + n).addClass('active');
				},
				
				showAmortization: function() {
          this.changePage(amortizationView);
					this.resetNav('navAmortization');
        },
				
				showMortgage: function() {
          this.changePage(mortgageView);
					this.resetNav('navMortgage');
        },
				
				showDashboard: function() {
          this.changePage(dashboardView);
					this.resetNav('navDashboard');
        },
    
        defaultAction: function(actions) {
					this.changePage(dashboardView);
					this.resetNav('navDashboard');
        },
    
        changePage: function(page) {
        	$(this.el).html($(page.el));
        }

    });

    var initialize = function() {
      var app_router = new AppRouter;
      Backbone.history.start();
    };
    
    return {
        initialize: initialize
    };
});
