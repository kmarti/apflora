'use strict';

var _ = require('underscore')
    , $ = require('jquery')
    , domReady = require('domready')
    //, Router = require('./router')
    ;

module.exports = {
    init: function() {
        //console.log('app.js running');
        var self = window.app = this;
        //this.router = new Router();
        // wait for document ready to render our main view
        // this ensures the document has a body, etc.
        domReady(function () {

            // init our main view
            /*var mainView = self.view = new MainView({
             model: me,
             el: document.body
             });

             // ...and render it
             mainView.render();*/

            // listen for new pages from the router
            //self.router.on('newPage', mainView.setPage, mainView);

            // we have what we need, we can now start our router and show the appropriate page
            //self.router.history.start({pushState: true, root: '/'});
        });
    }
};

module.exports.init();