require.config({

    paths: {
        jquery: 'libs/jquery/jquery-1.10.2.min',
        underscore: 'libs/underscore/underscore-1.5.1.min',
        backbone: 'libs/backbone/backbone-1.0.0.min',
				'bootstrap': 'libs/bootstrap/bootstrap-2.0.min',
				'jquery.ui': 'libs/jquery.ui/jquery-ui-1.10.3.custom.min',
				'jquery.validate': 'libs/validate/jquery.validate-1.11.1.min',
				'highcharts': 'libs/highcharts/highcharts-3.0.4.min',
        text: 'libs/require/text',
        templates: '../templates'
    },

    shim: {
        'underscore': {
            exports: "_"
        },
        'backbone': {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        },
				'bootstrap': {
            deps:['jquery']
        },
				'jquery.ui': {
            deps:['jquery']
        },
				'jquery.validate': {
            deps:['jquery']
        },
				'highcharts': {
            deps:['jquery']
        }
    }
  
});
  
require([
    'app'
], function(App) {
    $(function() {
        App.initialize();
    });
});