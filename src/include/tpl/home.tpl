<!-- slider -->
<script type="text/html" id="index-banner-tpl">
    {{ each bannerList }}
      <div class="item">
        <img class="rsImg" src="{{ bannerUrl+$value.banner }}" alt="{{ $value.title }}" />
    </div>
    {{ /each }}
</script>


<!-- articleList -->
<script type="text/html" id="index-article-tpl">
    {{each articleList as item index}}
    <div class="{{(!!item.poster && !isMobile) ? 'item has-right' : 'item'}}" onclick="window.location.href='http://blog.bestsamcn.me/article/detail/{{item._id}}'">
        <div class="left">
            <div class="title">
                <h4 class="color-black">{{item.title}}</h4>
                <div class="info margin-top-10">
                    <span class="fa fa-comment">{{item.commentNum | transNum }} Comments</span>
                    <span class="fa fa-eye">{{item.readNum | transNum}} Views</span>
                    <span class="fa fa-tag">{{item.tag ? item.tag.name : 'null'}}</span>
                    <a href="javascript:;" class="{{item.isLiked ? 'fa fa-heart active' : 'fa fa-heart'}}">{{item.likeNum | transNum}}</a>
                </div>
            </div>
            <p class="preview">
                摘要: {{item.previewText | textEllipsis:50}}
            </p>
            <div class="bottom">
                <a href="javascript:;" class="more">{{item.category ? item.category.name :'我可能被删了'}}</a>
                <a class="fa fa-calendar more no-border color-gray">{{item.createTime | dateFormat:'yyyy-MM-dd'}}</a>
                {{if !!item.lastEditTime}}
                <a class="fa fa-edit more no-border color-gray">{{item.lastEditTime | dateFormat:'yyyy-MM-dd'}}</a>
                {{/if}}
            </div>
        </div>
        <!-- <div class="right" v-if="!!item.poster && isMobile"> -->
        {{if (!!item.poster && !isMobile)}}
        <div class="right">
            <div class="img">
                <img src="{{CONFIG.POSTER_URL}}/{{item.poster}}">
            </div>
        </div>
        {{/if}}
    </div>
    {{/each}}
</script>

<!-- category -->
<script type="text/html" id="index-category-tpl">
    {{each categoryList as item index}}
    <a href="javascript:;">
        <span class="name">{{(item._id && item._id.name)}}</span>
        <span class="number">({{item.total || 0}})</span>
    </a>
    {{/each}}
</script>

<!-- rank -->
<script type="text/html" id="index-rank-tpl">
    <div class="popular animated bounceInRight" style="display: block">
        {{each hotList as item index}}
        <a href="http://blog.bestsamcn.me/article/detail/{{item._id}}">
            <div class="img">
                <div class="img-box">
                    {{if !!item.poster}}
                    <img src="{{CONFIG.POSTER_URL}}/{{item.poster}}">
                    {{else}}
                    <span>{{item.title | textEllipsis:2}}</span>
                    {{/if}}
                </div>
            </div>
            <div class="text">
                <h4>{{item.title}}</h4>
                <p><i class="fa fa-calendar"></i>{{item.createTime | dateFormat:'yyyy-MM-dd'}}</p>
            </div>
        </a>
        {{/each}}
    </div>
    <div class="popular animated bounceOutLeft" style="display: none">
        {{each latestList as item index}}
        <a href="http://blog.bestsamcn.me/article/detail/{{item._id}}">
            <div class="img">
                <div class="img-box">
                    {{if !!item.poster}}
                    <img src="{{CONFIG.POSTER_URL}}/{{item.poster}}">
                    {{else}}
                    <span>{{item.title | textEllipsis:2}}</span>
                    {{/if}}
                </div>
            </div>
            <div class="text">
                <h4>{{item.title}}</h4>
                <p><i class="fa fa-calendar"></i>{{item.createTime | dateFormat:'yyyy-MM-dd'}}</p>
            </div>
        </a>
        {{/each}}
    </div>
    <div class="popular animated bounceOutLeft" style="display: none">
        {{each commentList as item index}}
        <a href="http://blog.bestsamcn.me/article/detail/{{item._id}}">
            <div class="img">
                <div class="img-box name">
                    <span>{{item.createLog.createName | textEllipsis:3}}</span>
                </div>
            </div>
            <div class="text">
                <h4>RE:{{item.parentComent ? item.parentComment.content : item.article.title}}</h4>
                <p><i class="fa fa-calendar"></i>{{item.createTime | dateFormat:'yyyy-MM-dd'}}</p>
            </div>
        </a>
        {{/each}}
    </div>
    <div class="popular animated bounceOutLeft" style="display: none">
        {{each readList as item index}}
        <a href="http://blog.bestsamcn.me/article/detail/{{item._id}}">
            <div class="img">
                <div class="img-box">
                    {{if !!item.poster}}
                    <img src="{{CONFIG.POSTER_URL}}/{{item.poster}}">
                    {{else}}
                    <span>{{item.title | textEllipsis:2}}</span>
                    {{/if}}
                </div>
            </div>
            <div class="text">
                <h4>{{item.title}}</h4>
                <p><i class="fa fa-calendar"></i>{{item.createTime | dateFormat:'yyyy-MM-dd'}}</p>
            </div>
        </a>
        {{/each}}
    </div>
</script>

<!-- tag -->
<script type="text/html" id="index-tag-tpl">
    {{each tagList as item index}}
    <a href="javascript:;" class="tag-item">
        <span>{{item._id && item._id.name}}</span>
    </a>
    {{/each}}
</script>
