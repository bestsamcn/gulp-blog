//the config below only for development
require.config({
    baseUrl: '/',
    paths: {
        evt: 'home/js/index',
        vendor: 'assets/js/vendor',
        API: 'assets/js/service',
        CONFIG: 'assets/js/config'
    }
});

require(['evt', 'vendor', 'API', 'CONFIG'], function(E, vendor, API, CONFIG) {
    var $ = vendor.$,
        Q = vendor.q,
        $$ = vendor.$$;
        template = vendor.template;
    var pageIndex = 1, pageSize = 5, isMore = true, articleList = [];
    var isMoreBtn = $('#more-btn'), moreTit = $('#more-tit');
    var obj = {
        getArticle:function(index){
            var that = this;
            API.getArticleList({
                pageIndex: index,
                pageSize: pageSize
            }).then(function(res) {
                if(pageIndex * pageSize < res.total){
                    isMore = true;
                    isMoreBtn.show();
                    moreTit.hide();
                }else{
                    isMore = false;
                    isMoreBtn.hide();
                    moreTit.show();
                }
                if(res.data.length == 0) pageIndex --;
                articleList = articleList.concat(res.data);
                var _html = template('index-article-tpl',{articleList: articleList, CONFIG:CONFIG});
                $('#index-article-vm').html(_html);
                that.setSidebarScroll();
            });
        },
        loadMoreArticle:function(){
            var that = this;
            var more = function(){
                pageIndex++;
                that.getArticle(pageIndex);
            }
            isMoreBtn.on('click', more);
        },
        getCateList:function(){
            API.getDiffArticle({type:1}).then(function(res){
                var _html = template('index-category-tpl', {categoryList:res.data});
                $('#index-category-vm').html(_html);
            });
        },
        getRankList:function(){
            var that = this;
            var getLatestArticle = function(){

                var defer = Q.defer();
                API.getArticleList({pageIndex:1, pageSize:4}).then(function(res){
                    defer.resolve({latestList: res.data});
                });
                return defer.promise;
            }
            var getHotestArticle = function(obj){
                var defer = Q.defer();
                API.getArticleList({type:1, pageIndex:1, pageSize:4}).then(function(res){
                    obj.hotList = res.data;
                    defer.resolve(obj);
                });
                return defer.promise;
            }
            var getReadList = function(obj){
                var defer = Q.defer();
                API.getArticleList({type:2, pageIndex:1, pageSize:4}).then(function(res){
                    obj.readList = res.data;
                    defer.resolve(obj);
                });
                return defer.promise;
            }
            var getCommentList = function(obj){
                API.getCommentList({pageIndex:1, pageSize:4}).then(function(res){
                    obj.commentList = res.data;
                    obj.CONFIG = CONFIG;
                    var _html = template('index-rank-tpl', obj);
                    $('#index-rank-vm').html(_html);
                    that.setRankSlider();
                });
            }
            getLatestArticle().then(getHotestArticle).then(getReadList).then(getCommentList);
        },
        setRankSlider:function(){
            var navList = $('#rank-nav').find('a');
            var vm = $('#index-rank-vm').children('.popular');
            var prevIndex = 0;
            navList.each(function(index, item){
                $(item).on('click', function(){
                    $(this).addClass('active').siblings().removeClass('active');
                    vm.eq(prevIndex).removeClass('bounceInRight').addClass('animated bounceOutLeft');
                    vm.eq(index).show().removeClass('bounceOutLeft').addClass('bounceInRight')
                    prevIndex = index;
                });
            });
        },
        setTagList:function(){
            API.getDiffArticle({type:2}).then(function(res){
                var _html = template('index-tag-tpl', {tagList: res.data});
                $('#index-tag-vm').html(_html);
            });
        },
        setSidebarScroll:function(){
            var _body = document.documentElement;
             el = $('#sidebar')[0];
            var _pNode = el.parentNode;
            // return
            el.slideBar = function(){
                //滚动的极限距离
                var h = parseInt(_pNode.offsetHeight) - parseInt(el.offsetHeight)-20;
                var mainOffsetTop = parseInt(_pNode.offseTop);
                var mainHeight = parseInt(_pNode.offsetHeight);
                var slideBarHeight =  parseInt(el.offsetHeight) - 40 ;
                var slideBarIntOffsetTop = 20;
                var slideFunc = function() {
                    var scrollTop = parseInt(_body.scrollTop);
                    var slideBarOffsetTop = parseInt(el.offsetTop);
                    var slideBarTop  = parseInt(el.style.top) || 0;

                    //如果侧边栏和主体只差小于侧边栏的原始offsetTop就不滚动
                    if(parseInt(h) < slideBarIntOffsetTop){
                        return false;
                    }
                    // var aniDistant=Math.min( ( Math.max( ( -mainOffsetTop, ( scrollTop - slideBarOffsetTop + slideBarTop)))), (mainHeight - slideBarHeight ) );
                    var aniDistant= Math.min(  scrollTop , (mainHeight - slideBarHeight ) );
                    //
                    if (aniDistant > h) {
                        aniDistant = h
                    };
                    if (parseInt(_body.scrollTop) > slideBarIntOffsetTop ) {
                        $$.moveStart(el, {'top':aniDistant});
                    } else {
                        $$.moveStart(el, {'top':10});
                    }
                }
                window.addEventListener('scroll', slideFunc);
                document.addEventListener('resize', slideFunc);
            }
            setTimeout(function(){
                el.slideBar()
            }, 500)
        },
        backTop:function(){
            var nScrollTop;
            var el = $('#go-top')[0]
            var elClass=el.className;
            el.temp = function(){
                nScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (nScrollTop > 800) {
                    el.className="go-top-btn show";
                } else {
                    el.className="go-top-btn"
                }
            }
            window.addEventListener('scroll', el.temp);
            window.addEventListener('resize', el.temp);
            $$.toScrollHeight(0, el);
        },
        init: function() {
            this.getArticle(1);
            this.loadMoreArticle();
            this.getCateList();
            this.getRankList();
            this.setTagList();
            this.setSidebarScroll();
            this.backTop();
        }
    }
    obj.init();
});
