function getParam(){
    var params = {};

    parameters = location.href.split('?');
    if (! parameters[1]){
	return params;
    }

    parameters[1].split('&').forEach(function(pair){
	pairs = pair.split('=');
	params[pairs[0]] = pairs[1];
    });

    return params;
}

$.ajaxSetup({
    mimeType: 'text/plain',
    dataType: 'text'
});

$(function(){
    var params = getParam();
    var page = params.page;

    $('.sidebar').append('<h2>最新ニュース30件</h2>');
    $('.sidebar').append('<ul></ul>');

    $.getJSON('articles/articles.json', function(articles){
	articles.forEach(function(entry){
	    $('.sidebar ul').append(
		'<li><a href="index.html?page='
		    + entry.name
		    + '" target="_top">'
		    + entry.title
		    + '<\/a><\/li>'
	    );
	});

	if (page){
	    var article = articles.filter(function(entry){return entry.name == page;})[0];
	    document.title = article.title.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'') + ' - MECHAZINE';

	    $('article').append('<section class="content"></section>');
	    $('article').append('<section class="related"></section>');
	    $('.related').append('<h2>関連記事</h2>');
	    $('.related').append('<ul></ul>');

	    $('.content').append(
		'<span class="date">2015年01月22日 13時00分00秒</span><h1 class="title">'
		    + article.title
		    + '</h1><figure class="thumb"><img src="images/'
		    + article.thumb
		    + '"></figure>'
	    );

	    $.get('articles/' + page + '.md', function(data){
		$('.content').append(marked(data));
		$('.content').append(
		    '<p><a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-count="none" data-hashtags="ビックリドッキリメカ">Tweet</a></p>'
		);

		!function(d, s, id){
		    var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
		    if (! d.getElementById(id)){
			js = d.createElement(s);
			js.id = id;
			js.src = p + '://platform.twitter.com/widgets.js';
			fjs.parentNode.insertBefore(js, fjs);
		    }
		}(document, 'script', 'twitter-wjs');
	    });

	    articles.forEach(function(entry){
		if (entry != article){
		    $('.related ul').append(
			'<li><a href="index.html?page='
			    + entry.name
			    + '" target="_blank">'
			    + entry.title
			    + '- MECHAZINE</a></li>'
		    );
		}
	    });
	}else{
	    document.title += ' - ' + articles[0].title.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');

	    $('article').append('<ul class="thumb"></ul>');

	    articles.forEach(function(entry){
		$('.thumb').append(
		    '<li><a href="index.html?page='
			+ entry.name
			+ '"><span class="date">2015年01月22日 13時00分00秒</span> <span class="tag">'
			+ entry.tag
			+ '</span><figure><img src="images/'
			+ entry.thumb
			+ '"></figure><h1 class="title">'
			+ entry.title
			+ '</h1></a></li>'
		);
	    });
	}
    });
});
