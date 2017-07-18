require.config({
    baseUrl:'/',
    paths:{
        vendor:'assets/js/vendor',
        CONFIG:'assets/js/config'
    }
});
define(['vendor', 'CONFIG'], function(vendor, CONFIG){
    var $ = vendor.$;
    var Q = vendor.q;
    var $$ = vendor.$$;
    $.support.cors = true;
    var $loading = $('#loading');
    var $http = function(type, url, params, isLoading, isToast){
        var defer = Q.defer();
        var _obj = {
            type:type || 'get',
            dataType:'json',
            data:params,
            xhrField:{
                withGredentials:true
            },
            url:CONFIG.ROOT_API+url,
            beforeSend:function(){
                isLoading&& $loading && $loading.show();
            },
            success:function(res){

                if(res.retCode !== 0){
                    return (isToast && $$.alertInfo(res.msg || '未知错误'));
                }
                defer.resolve(res);
            },
            error:function(){
                $$.alertInfo('异常');
            },
            complete:function(){
                isLoading &&　$loading && $loading.hide();
            }
        }
        $.ajax(_obj);
        return defer.promise;
    }

    //接口列表
    var obj = {};

    obj.getArticleList = function(params){
        return $http('get', '/article/getList', params, true);
    }
    obj.login = function(params){
        return $http('post', '/admin/login', params, true);
    }
    obj.getDiffArticle = function(params){
        return $http('get', '/article/getDiffArticle', params, true);
    }
    obj.getCommentList = function(params){
        return $http('get', '/comment/getList', params, true);
    }
    return obj;
});
