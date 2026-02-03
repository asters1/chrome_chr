// ==UserScript==
// @name         github镜像
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将页面中所有https://github.com 替换为https://ggh.wisteria.cf
// @match       https://ggh.wisteria.cf/*
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';


    // 目标替换的 URL
    const oldUrl = 'https://github.com';
    const newUrl = 'https://ggh.wisteria.cf';
function replace_download_url() {

         // 获取所有class含mt-3的div
         const mt3Divs = document.querySelectorAll('div.mt-3');
         mt3Divs.forEach((div, index) => {
             // 获取当前div下的所有a标签
             const links = div.querySelectorAll('a.Truncate');
             console.log(`第${index+1}个mt-3的div下的a标签：`);
             links.forEach((link, linkIndex) => {
                 let old_href=link.getAttribute("href")
                 const is_new_url = old_href?.startsWith('https://wisteria.cf'); // 判断是否以https://开头（?.避免null报错）
                if(!is_new_url){
                link.setAttribute('href', "https://wisteria.cf/https://github.com"+old_href); // 直接设置新href
                }




             });
         });
     }
    // 替换函数
    function replaceUrls(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.includes(oldUrl)) {
                node.textContent = node.textContent.replace(new RegExp(oldUrl, 'g'), newUrl);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 处理属性
            const attributes = ['href', 'src', 'data-src', 'action'];
            attributes.forEach(attr => {
                if (node.hasAttribute(attr)) {
                    const attrValue = node.getAttribute(attr);
                    if (attrValue.includes(oldUrl)) {
                        node.setAttribute(attr, attrValue.replace(new RegExp(oldUrl, 'g'), newUrl));
                    }
                }
            });

            // 处理 style 属性
            if (node.hasAttribute('style')) {
                const styleValue = node.getAttribute('style');
                if (styleValue.includes(oldUrl)) {
                    node.setAttribute('style', styleValue.replace(new RegExp(oldUrl, 'g'), newUrl));
                }
            }

            // 递归处理子节点
            for (let child of node.childNodes) {
                replaceUrls(child);
            }
        }
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceUrls(node);
                replace_download_url()
            });
        });
    });

    // 初始替换
    replaceUrls(document.body);
    replace_download_url()

    // 开始监听 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听 AJAX 内容加载（如果需要）
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            setTimeout(() => {
                replaceUrls(document.body);
                replace_download_url()
            }, 100);
        });
        return originalOpen.apply(this, arguments);
    };
})();