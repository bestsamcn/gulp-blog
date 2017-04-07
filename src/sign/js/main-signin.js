@@include('../../lib/jquery/dist/jquery.min.js')
@@include('../../lib/bootstrap/dist/js/bootstrap.min.js')
@@include('./index.js')
require(['jquery', 'plus'], function($, P){
    console.log(P(2,12));
})