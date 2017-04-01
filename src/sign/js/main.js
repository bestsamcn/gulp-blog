@@include('dist/lib/jquery/dist/jquery.min.js')
@@include('dist/lib/bootstrap/dist/js/bootstrap.min.js')
@@include('dist/sign/js/index.js')
require(['jquery', 'plus'], function($, P){
    console.log(P(2,12));
})