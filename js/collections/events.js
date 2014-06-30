define([
  'jquery',
  'underscore',
  'backbone',
  'models/events'
], function($, _, Backbone, eventsModel){
  var eventsCollection = Backbone.Collection.extend({

    model: eventsModel,

    url: 'http://api.dexknows.com/dexcloud/eventful/events?what=music&where=Los+Angeles&date=Future&type=eventsearch&sortby=date',

    initialize: function() {
        this.fetch();
    },

    sync: function(method, model, options) {
        options.timeout = 10000;
        options.dataType = "jsonp";
        return Backbone.sync(method, model, options);
    },

    parse: function(response) {

        if (typeof response.buckets !== 'undefined') {
            this.result = response.buckets[0].result;
        }

        return this.result;
    }

  });

  return new eventsCollection;
});