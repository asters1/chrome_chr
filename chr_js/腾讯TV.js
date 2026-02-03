// ==UserScript==
// @name         腾讯TV
// @namespace    http://tampermonkey.net/
// @version      2026-01-30
// @description  try to take over the world!
// @author       You
// @match        https://v.qq.com/*

// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';
  //全局变量
    var SELECT_VIDEO_INDEX=0
const enterDblInterval = 300;
    let lastEnterTime = 0;
    let clickTimer = null;

    GM_addStyle(`
        #test_btn {
            position: fixed !important;
            z-index: 999999 !important;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: #e63946;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        #test_btn:hover { background: #d00000; }
        .glass-effect {


    border: 10px solid #e63946;

}

    `);
    function get_video_list(){
     var offset ={"left":0.0,"top":0.0}
             var video =[];
             var video_list=[];
         let i = 0;
   $(".screen-cover--pc").each(function(index, element) {
if( $(this).offset().top==offset.top){
//video_list.push(offset.top)
    video_list.push( i)
}else{
       if(video_list.length > 0){

video.push(video_list)
       }
    video_list=[];
//video_list.push( $(this).offset().top)
    video_list.push( i)

}
     offset = $(this).offset();

   // console.log("相对于文档的坐标 - X: " + offset.left + ", Y: " + offset.top);
i++

});
return video
    }
function select_by_index(index){
$('.poster-view__layer').removeClass('glass-effect');
  $('.poster-view__layer').eq(index).addClass('glass-effect');
 // 给所有.poster-view__layer添加tabindex="0"，支持聚焦
$('.poster-view__layer').attr('tabindex', 0);
         $('.poster-view__layer').eq(index).focus();
       document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function enter_x_cover(index){
let x_cover_id=$(".screen-cover--pc").eq(index).find(".item-info").eq(0).attr("dt-reusable-identifier")
let vide_html_url='https://v.qq.com/x/cover/'+x_cover_id+'.html'
window.location.href=vide_html_url
}



   //下一集
    function btn_next_u(){
document.querySelector('div.txp_btn.txp_btn_next_u').click()
    }



//=====
    document.addEventListener('keyup', e => {
            const this_url=window.location.href
    const hasCover = this_url.indexOf('/x/cover')!==-1
           if(hasCover){
  if ($(e.target).closest('#player-component').length && e.key === 's') {
    e.preventDefault();
      e.stopImmediatePropagation();

  }

       if ($(e.target).closest('#player-component').length && e.key === 'w') {
    e.preventDefault();
      e.stopImmediatePropagation();
alert("上键")
  }
           }
}, true);



 //=====
$(document).on('keydown', function(e) {
    const this_url=window.location.href
    const hasCover = this_url.indexOf('/x/cover')!==-1
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight','Enter'];
  if (arrowKeys.includes(e.key))   e.preventDefault();
        if (e.key === 'a') {
         e.preventDefault();
           const quanpin_text=document.querySelector('#player-component > div.plugin_ctrl_txp_bottom > div > div.txp_right_controls > div.txp_btn.txp_btn_fullscreen > div').textContent
         if(quanpin_text.indexOf('退出全屏')!==-1){
document.querySelector('div.txp_btn.txp_btn_fullscreen').click();
         }else{
 history.back();
         }

         }
    if(hasCover){
        if (e.key === 'w') {}
              if (e.key === 's') {
              btn_next_u()

              }

          if (e.key === 'm') {
              const aa=document.querySelector('#player-component')
              const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown',  bubbles: true,  cancelable: true });
              aa.focus()
          aa.dispatchEvent(keydownEvent)
          }
        if (e.key === 'n') {
              const aa=document.querySelector('#player-component')
              const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp',  bubbles: true,  cancelable: true });
              aa.focus()
          aa.dispatchEvent(keydownEvent)
          }
     if (e.key === 'Enter') {

const now=Date.now()
const isDbl = now - lastEnterTime <= enterDblInterval;
         if (isDbl) {
           clearTimeout(clickTimer);
             lastEnterTime = 0;
             //双击
document.querySelector('div.txp_btn.txp_btn_fullscreen').click();
         }else{
         lastEnterTime = now;
               clickTimer = setTimeout(() => {
                    lastEnterTime = 0;
                 //   alert('回车单击！');
                    document.querySelector('div.txp_btn.txp_btn_play').click();
                    }, enterDblInterval);
         }
   // alert("是cover")
}else{
  // alert("不是cover")
}
         //hascover判断结束
}


})
    $(document).on('keyup', function(e) {
            const this_url=window.location.href
    const hasCover = this_url.indexOf('/x/cover')!==-1
  const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight','Enter','s','w'];
  if (arrowKeys.includes(e.key)) e.preventDefault(); // 拦截默认行为
if(!hasCover){
    let res_list= get_video_list()
  let  video_row_length=res_list[0].length
  // 下键逻辑：选中的div成为activeElement后，滚动到视口居中
  if (e.key === 's') {
SELECT_VIDEO_INDEX=SELECT_VIDEO_INDEX+video_row_length
select_by_index(SELECT_VIDEO_INDEX)
  }

  if (e.key === 'w') {
SELECT_VIDEO_INDEX=SELECT_VIDEO_INDEX-video_row_length
           if(SELECT_VIDEO_INDEX<0){
      SELECT_VIDEO_INDEX=0
      }
select_by_index(SELECT_VIDEO_INDEX)
  }
  if (e.key === 'ArrowLeft') {
SELECT_VIDEO_INDEX=SELECT_VIDEO_INDEX-1
      if(SELECT_VIDEO_INDEX<0){
      SELECT_VIDEO_INDEX=0
      }
select_by_index(SELECT_VIDEO_INDEX)
  }
 if (e.key === 'ArrowRight') {

SELECT_VIDEO_INDEX=SELECT_VIDEO_INDEX+1
     select_by_index(SELECT_VIDEO_INDEX)
  }
        if (e.key === 'Enter') {
enter_x_cover(SELECT_VIDEO_INDEX)

}
    //下一行判断cover结束
}

})

$(window).on("load",function(){
select_by_index(0)
})



/*    var j=0
  const button = $('<button id="test_btn">测试按钮</button>');
     $('body').append(button)
     button.on('click', async () => {
var res_list=get_video_list()
//console.log(res_list)

select_by_index(j)
j++


     })
*/
})();