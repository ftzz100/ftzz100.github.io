//lazyload
$(".content-wrap img").each(function(){
    $(this).attr("class", "lazy");
    $(this).attr("data-src", $(this).attr("src"));
    $(this).removeAttr("src");
    //$(this).wrap("<div class=\"lazy-wrapper\"></div>").wrap("<thefigure></thefigure>").wrap("<a href='#'></a>");
    $(this).wrap("<div class=\"lazy-wrapper\"></div>").wrap("<thefigure></thefigure>");
    //$(this).wrap("<div class=\"lazy-wrapper\"></div>");
});

$(document).ready(function(){
var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
});
})


var pjax_hrefBlank = function(){
    //href
    //console.log("href")
    var ass = document.getElementsByTagName("a");

    for(let i=0; i < ass.length; i++){
        //console.log(as.length)
        //if(ass[i].href && ass[i].target && ass[i].getAttribute("rel")){
        if(ass[i].href && ass[i].target){
            
            
            ass[i].addEventListener("click",function(){
                //console.log(ass[i])
                href = ass[i].href;
                open(href,"_blank",'noopener=yes,noreferrer=yes');
            })
            /*
            ass[i].onclick = function(){
                
                href = ass[i].href;
                //open(href,"_blank",'noopener=yes,noreferrer=yes,nofollow=yes'); 貌似还不支持nofollow？
                open(href,"_blank",'noopener=yes,noreferrer=yes');
                //open(href,"_blank")
            }*/
        }
    }
}


function pjax_photoswipe(){
    var initPhotoSwipeFromDOM = function(gallerySelector) {
        //console.log('pjax_photoswipe')
        // parse slide data (url, title, size ...) from DOM elements 
        // (children of gallerySelector)
        var parseThumbnailElements = function(el) {
            //var thumbElements = el.childNodes,
            
            var thumbElements = el.getElementsByTagName('img')
            
            var numNodes = thumbElements.length,
                items = []
                //imageEl,
                //linkEl,
                //size,
                //item;
           
           
            
            for(var i = 0; i < numNodes; i++) {
    
                imageEl = thumbElements[i]; // <figure> element
                //console.log(imageEl.naturalWidth, imageEl.naturalHeight)
                // include only element nodes 
                if(imageEl.nodeType !== 1) {
                    continue;
                }
    
                src = imageEl.getAttribute('src'); // <a> element
                
                //size = linkEl.getAttribute('data-size').split('x');
    
                // create slide object
                item = {
                    src: src,
                    //w: parseInt(size[0], 10),
                    //h: parseInt(size[1], 10)
                    w: imageEl.naturalWidth,
                    h: imageEl.naturalHeight
                   
                };
    
                // if(figureEl.children.length > 1) {
                //     // <figcaption> content
                //     item.title = figureEl.children[1].innerHTML; 
                // }
    
                // if(linkEl.children.length > 0) {
                //     // <img> thumbnail element, retrieving thumbnail url
                //     item.msrc = linkEl.children[0].getAttribute('src');
                // } 
    
                item.el = imageEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }
    
            return items;
        };
    
        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };
    
        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function(e) {
            
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
    
            var eTarget = e.target || e.srcElement;
    
            // find root element of slide
            var clickedListItem = closest(eTarget, function(el) {
                //return (el.tagName && el.tagName.toUpperCase() === 'THEFIGURE');
                return (el.tagName && el.tagName.toUpperCase() === 'IMG');
            });
            if(!clickedListItem) {
                return;
            }
            
            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            //var clickedGallery = clickedListItem.parentNode,
            //var clickedGallery = clickedListItem.getElementsByClassName("post-body")
            var clickedGallery = galleryElements[0]
                //childNodes = clickedListItem.parentNode.childNodes,
                //var childNodes = clickedGallery.getElementsByTagName('thefigure'),
                var childNodes = clickedGallery.getElementsByTagName('img'),
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;
                //console.log(childNodes)
            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) { 
                    continue; 
                }
    
                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }
    
            
    
            if(index >= 0) {
                //alert(index)
                // open PhotoSwipe if valid index found
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };
    
        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
            params = {};

            if(hash.length < 5) {
                return params;
            }
    
            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');  
                if(pair.length < 2) {
                    continue;
                }           
                params[pair[0]] = pair[1];
            }
    
            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }
    
            return params;
        };
    
        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;
            
            items = parseThumbnailElements(galleryElement);
            
            options = {
    
                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                //index: 0,
                showHideOpacity: true,
                loadingIndicatorDelay: 1000,
                // Buttons/elements
                closeEl:true,
                captionEl: true,
                fullscreenEl: false,
                zoomEl: false,
                shareEl: false,
                counterEl: false,
                arrowEl: false,
                preloaderEl: false,
                //preload: [1,3],
                showAnimationDuration: 0,
                hideAnimationDuration: 0,
                closeOnScroll: true,
                history: false, //禁止页面hash
                loop: false,
                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    //var thumbnail = items[index].el.getElementsByTagName('img')[0] // find thumbnail
                    var thumbnail = items[index].el // find thumbnail
                    //console.log(thumbnail)
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect(); 
                      
                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                }
    
            };
    
            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }
           
            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }
            
            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }
            //console.log(options)
            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            
            gallery.init(); 
            //添加pjax的处理
            
            /*
            gallery.listen('close', function() { 
                //close之后马上将url上的#后面参数去掉，防止跳转触发pjax

                var pathname = location.pathname;
                //var state = {url: pathname}
                history.pushState( null, null, pathname); 
                //history.replaceState( null, null, pathname); 
                //关闭后又有#参数，所以还是要在处理url，防止影响其他图片放大
                setTimeout(function(){
                    history.replaceState( null, null, pathname);
                },100)
            });
            
            gallery.listen('mouseUsed', function() {
                //console.log("open")
                //var pathname = location.pathname;
                //history.pushState( null, null, pathname); 
             });

             */
        };
    
        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll( gallerySelector );
        
        for(var i = 0, l = galleryElements.length; i < l; i++) {
            
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }
    
        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        
        if(hashData.pid && hashData.gid) {
            //alert("uuu")
            //避免刷新页面时根据参数自动放大图片
            //openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
        }
      };
    
    //alert(123)
    initPhotoSwipeFromDOM('.post-body');
}

//photoswipe
  //"use strict";
  document.write('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
  //var initPhotoSwipeFromDOM=function(t){for(var e=[0,0],s=function(e){var s,i,a=[];return $(t+'[data-pswp-uid="'+$(e).attr("data-pswp-uid")+'"] img').each(function(){var t=$(this).get(0);s=[0,0];var e;e=null!==t.getAttribute("src")?t.getAttribute("src"):t.getAttribute("data-src"),i={src:e,w:parseInt(s[0],10),h:parseInt(s[1],10)},i.el=t,a.push(i)}),a},i=function(e){e=e||window.event,e.preventDefault?e.preventDefault():e.returnValue=!1;var s,i,n=e.target||e.srcElement,p=0;return $(n).parents().each(function(){$(this).attr("class")==t.substr(1)&&(i=$(this).attr("data-pswp-uid"))}),$(t+'[data-pswp-uid="'+i+'"] img').each(function(){$(this).get(0)===n&&(s=p),p++}),s>=0&&a(s,$(t+'[data-pswp-uid="'+i+'"]').get(0)),!1},a=function(t,i){var a,n,p,r=document.querySelectorAll(".pswp")[0];if(p=s(i),n={galleryUID:i.getAttribute("data-pswp-uid"),shareEl:!1,fullscreenEl:!1,loop:!1,getThumbBoundsFn:function(t){var e=p[t].el,s=window.pageYOffset||document.documentElement.scrollTop,i=e.getBoundingClientRect();return{x:i.left,y:i.top+s,w:i.width}}},n.index=parseInt(t,10),!isNaN(n.index)){a=new PhotoSwipe(r,PhotoSwipeUI_Default,p,n),a.init(),a.listen("gettingData",function(t,s){if(0==s.w||0==s.h){s.el.setAttribute("src",s.el.getAttribute("data-src"));var i=new Image;i.src=s.src,0!==i.width&&0!==i.height?(s.w=parseInt(i.width,10),s.h=parseInt(i.height,10),e[0]=parseInt(i.width,10),e[1]=parseInt(i.height,10)):(s.w=e[0],s.h=e[1])}}),a.listen("imageLoadComplete",function(t,s){var i=new Image;i.src=s.src;var n=!0;s.w==parseInt(i.width)&&s.h==parseInt(i.height)&&(n=!1),s.w=parseInt(i.width,10),s.h=parseInt(i.height,10),0!==i.width&&0!==i.height&&(e[0]=parseInt(i.width,10),e[1]=parseInt(i.height,10)),a.getCurrentIndex()==t&&n&&a.updateSize(!0)}),a.listen("afterChange",function(){o(a)});var o=function(t){var e=new Image;e.src=t.currItem.src,0!==e.width&&0!==e.height&&(t.currItem.w=parseInt(e.width,10),t.currItem.h=parseInt(e.height,10)),t.updateSize(!0)};o(a)}},n=document.querySelectorAll(t),p=0,r=n.length;p<r;p++)n[p].setAttribute("data-pswp-uid",p+1);$(t+" img").each(function(){$(this).parent().click(i)});var o=new RegExp("#&gid=[^s]*&pid=[^s]*");if(null!=window.location.href.match(o)){var d=new RegExp("#&gid=[^s]"),l=window.location.href.match(d).toString().replace("#&gid=","")-1;a(0,$(t).get(l))}};
 
// execute above function
//initPhotoSwipeFromDOM('.post-body');

function pjax_music(){
    //console.log("danqu&&songlist")
    let danqu = function(){
        const ap1 = new APlayer({
            container: document.getElementById('danqu'),
            lrcType: 3,
            mutex: true,
            volume: 0.5,
            audio: [{
                name: "光るなら",
                artist: "Goose house" ,
                url: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/hikarunara.mp3",
                cover: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/hikarunara.jpg",
                lrc: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/hikarunara.lrc",
                theme: '#FADFA3'
            }]
        });
        
    }

    var songlist = function(){
        const ap2 = new APlayer({
            container: document.getElementById('songlist'),
            listFolded: false,
            listMaxHeight: 90,
            lrcType: 3,
            mutex: true,
            volume: 0.5,
            audio: [{
                    name: "前前前世",
                    artist: "RADWIMPS",
                    url: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/yourname.mp3",
                    cover: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/yourname.jpg",
                    lrc: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/yourname.lrc",
                    theme: '#46718b'
                },    
                {
                    name: "光るなら",
                    artist: "Goose house",
                    url: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/hikarunara.mp3",
                    cover: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/hikarunara.jpg",
                    lrc: "https://cn-south-17-aplayer-46154810.oss.dogecdn.com/hikarunara.lrc",
                    theme: '#FADFA3'
                }]
        });
        
    }
    
    

    danqu();
    songlist();
    
}

var pjax_allfn = function(){
    //console.log(location.href)

    //音乐文章专用
    if(location.href.indexOf("aplayer") != -1){
        //console.log("loadaplayer");
        pjax_music(); //加载经典写法aplayer
        
        //console.log(aplayers)
        for(var i in aplayers){
            aplayers[i].list.index = undefined;
        }

        //console.log("loadmeting")
        loadMeting(); //加载metingjs写法
        
    }
    //图片放大
    pjax_photoswipe();

    //链接跳转
    //友情链接页面有js生成的href，需要先生成html再绑定跳转函数，所以延迟了一秒
    setTimeout(function(){
        pjax_hrefBlank();
    },1000);
    
}

// $(document).on('pjax:start', function () {
//     console.log("start")
//     if (window.aplayers) {
//         for (let i = 0; i < window.aplayers.length; i++) {
//             window.aplayers[i].destroy();
//         }
//         window.aplayers = [];
//     }
// });

document.addEventListener('pjax:complete', function () {
    //console.log("complete");
  
    //return false;
    // $(document).pjax('a[target!=_blank][rel!=group]', '#pjax-container', {
    //     fragment: '#pjax-container',
    //     timeout: 1000,
    // });
});

document.addEventListener('pjax:success', function () {
    //console.log("success");
    //console.log(typeof aplayers);
    
    
    pjax_allfn();

    
});

window.onload = function(){
    // pjax_photoswipe();
    // pjax_hrefBlank();
    // //音乐文章专用
    // if(location.href.indexOf("hexo-plugins") != -1){
    //     //console.log("loadaplayer");
    //     pjax_music(); //加载经典写法aplayer

    //     //console.log(aplayers)
        
    //     loadMeting(); //加载metingjs写法
    // }
    pjax_allfn();
    //loadMeting();
    
    var watchon = setTimeout(function(){
        
        //console.log(aplayers);
        if(aplayers.length == 1){
            //console.log("one")
            var miniaplayer = aplayers[0];
        }else if(aplayers.length > 1){
            //console.log(aplayers.length)
            //watchon
            for(var i=0; i < aplayers.length;i++){
                className = aplayers[i].container.className;
                if(className.indexOf("no-destroy") != -1){
                    var miniaplayer = aplayers[i];
                }
            }
        }
        
        //console.log(miniaplayer)
        container = miniaplayer.container;
        container.getElementsByClassName("aplayer-lrc")[0].setAttribute("class","aplayer-lrc aplayer-lrc-hide");
        //className = container.className;
        var bar = container.getElementsByClassName("aplayer-bar-wrap")[0]
        bar.addEventListener("click",function(){
            console.log('jtclick seeked');
        });
        

        // var switcher = container.getElementsByClassName("aplayer-miniswitcher")[0]
        // var aplayerbody = container.getElementsByClassName("aplayer-body")[0]
        // switcher.addEventListener("click",function(){
        //     console.log('switcher');
        //     aplayerbody.style.left = "0px";
        // });

        //miniaplayer.on('seeked', function (e) {
        miniaplayer.on('play', function (e) {
            //console.log('seeked');
            miniaplayer.lrc.show();
            miniaplayer.seek = function(){};
            
        });
        
        miniaplayer.on('pause', function (e) {
            miniaplayer.lrc.hide();
        });

        // miniaplayer.on('lrcshow', function (e) {
        //     alert(10)
        // });
        
        

       
    },3000)

    // setTimeout(function(){
    //     var switcher = document.querySelector(".aplayer-miniswitcher");
    //     console.log(switcher)
    //     switcher.addEventListener("click", function() {
    //         alert(1)
    //     });

    // },5000)
    
    // //$.getJSON("https://api.heycmm.cn/List/4870830656",function(data){
    //     data = {"cover":"https://p1.music.126.net/ZNyMQFhAW3ZiMNavPC9vWA==/109951164175153573.jpg?param=300y300","artist":"尹东星","name":"걱정말아요 그대(你不要担心)（翻自 李笛） ","url":"https://api.heycmm.cn/Mp3/1374287809"}
    //     const ap = new APlayer({
    //         container: document.getElementById('aplayer'),
    //         mini: false,
    //         autoplay: false,
    //         theme: '#FADFA3',
    //         loop: 'all',
    //         lrcType: 3,
    //         preload: 'auto',
    //         volume: 0.7,
    //         mutex: true,
    //         listFolded: true,
    //         audio: data
    //     });
    // //});
}