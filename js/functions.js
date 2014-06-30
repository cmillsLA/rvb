// HTML5 Local Storage
if(window.Storage && window.JSON) {
  window.$storage = function(key) {
    return {
      set: function(value) {
        return localStorage.setItem(key, JSON.stringify(value));
      },

      get: function() {
        var item = localStorage.getItem(key);
        if (item) {
          return JSON.parse(item);
        }
      }
    };
  };
}