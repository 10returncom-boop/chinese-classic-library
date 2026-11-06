/* ============================================================
   書庫目錄（十藏分類瀏覽 + 子類篩選 + 分頁 + 三種檢視：卡片/清單/樹狀）
   ============================================================ */
(function(){
  "use strict";
  var PER=9;
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function viewTabs(catId,sub,view){
    var tabs=[["card","卡片"],["list","清單"],["tree","樹狀"],["stats","統計"],["map","地圖"]];
    var v=tabs.map(function(t){
      var vk=t[0], lbl=t[1];
      var href="catalog.html?"+qs(catId,sub,1,vk);
      return '<button class="tab-btn'+(vk===view?" active":"")+'" onclick="location.href=\''+href+'\'">'+lbl+'</button>';
    }).join("");
    return '<div class="tabs" data-tabs><span style="font-size:13px;color:var(--text-soft);margin-right:6px;">檢視：</span>'+v+'</div>';
  }

  window.initCatalogPage = function(){
    var wrap=document.getElementById("catalog");
    if(!wrap) return;
    var params=new URLSearchParams(location.search);
    var catId=params.get("cat")||"";
    var sub=params.get("sub")||"";
    var page=parseInt(params.get("p")||"1",10)||1;
    var view=params.get("view")||"card";
    var books=window.gujiAllBooks();
    var cats=window.GUJI_CATS;

    var filtered=books;
    if(catId){ filtered=filtered.filter(function(b){return b.cat===catId;}); }
    if(sub){ filtered=filtered.filter(function(b){return b.sub===sub;}); }

    // 麵包屑
    var crumbs=[{text:"書庫目錄",url:"catalog.html"}];
    if(catId){ var c=window.gujiCatById(catId); if(c){ crumbs.push({text:c.name,url:gujiCatUrl(catId)}); } }
    if(sub){ crumbs.push(sub); }
    window.renderBreadcrumb(crumbs);

    // 子類篩選 chips
    var filterHtml='';
    if(catId){
      var cc=window.gujiCatById(catId);
      filterHtml='<div class="filters">'+
        '<button class="chip'+(sub?"":" active")+'" onclick="location.href=\'catalog.html?'+qs(catId,"",1,view)+'\'">全部 <span class="n">'+cc.count+'</span></button>';
      cc.subs.forEach(function(s){
        var act = (sub===s.name)?" active":"";
        filterHtml+='<button class="chip'+act+'" onclick="location.href=\'catalog.html?'+qs(catId,s.name,1,view)+'\'">'+esc(s.name)+' <span class="n">'+s.count+'</span></button>';
      });
      filterHtml+='</div>';
    } else {
      filterHtml='<div class="notice info">目前收錄 <b>'+books.length+'</b> 本代表性示意書目；完整 '+window.gujiTotal+' 部將於 TXT 匯入後上線。</div>';
    }

    // 十藏總覽網格（未指定藏別且為卡片/清單檢視時置頂）
    var gridHtml='';
    if(!catId && view!=="tree" && view!=="stats" && view!=="map"){
      gridHtml='<h2 class="sec">十藏分類</h2><div class="cat-grid">';
      cats.forEach(function(c){
        gridHtml+=
          '<a class="cat-card hover-lift" data-context data-page-url="'+gujiCatUrl(c.id)+'" href="'+gujiCatUrl(c.id)+'">'+
            '<div class="cname">'+esc(c.name)+'</div>'+
            '<div class="cnum">'+c.count+' 部</div>'+
            '<div class="cdesc">'+esc(c.desc)+'</div>'+
          '</a>';
      });
      gridHtml+='</div>';
    }

    // ---- 三種檢視內容 ----
    var bodyHtml='';
    if(view==="stats"){
      // 統計（原儀表板）：各藏部數 / 收藏比例 / 子類分布
      var statGrid=cats.map(function(c){
        return '<div class="stat-card hover-lift"><div class="num">'+c.count+'</div><div class="lbl">'+esc(c.name)+'</div></div>';
      }).join("");
      var maxC=Math.max.apply(null,cats.map(function(c){return c.count;}));
      var bars=cats.map(function(c){
        var pct=Math.round(c.count/window.gujiTotal*100);
        return '<div class="bar-row"><span class="bl">'+esc(c.name)+'</span>'+
          '<div class="bar-track"><div class="bar-fill" style="width:'+Math.round(c.count/maxC*100)+'%">'+pct+'%</div></div></div>';
      }).join("");
      var acc=cats.map(function(c){
        var tags=(c.subs||[]).map(function(s){return '<span class="tag">'+esc(s.name)+' '+s.count+'</span>';}).join("");
        return '<div class="acc-item"><div class="acc-head">'+esc(c.name)+'（'+c.count+' 部）<span class="arrow">›</span></div><div class="acc-body">'+tags+'</div></div>';
      }).join("");
      bodyHtml=
        '<div class="card"><h2 class="sec">各藏部數</h2><div class="stat-grid">'+statGrid+'</div></div>'+
        '<div class="card"><h2 class="sec">收藏比例</h2><div>'+bars+'</div>'+
          '<div style="font-size:12px;color:var(--text-soft);margin-top:8px;">佔比 = 各部數 ÷ 全庫 '+window.gujiTotal+' 部</div></div>'+
        '<div class="card"><h2 class="sec">子類分布（折疊）</h2><div>'+acc+'</div></div>';
    } else if(view==="map"){
      // 地圖（原網站地圖）：主要頁面 + 十藏分類
      var rows=[
        ["index.html","首頁","十藏入口、最新書目、主題標籤、開始探索"],
        ["catalog.html","書庫目錄","十藏與子類分類瀏覽、三種檢視、統計與地圖"],
        ["search.html","全文檢索","全庫關鍵字檢索"],
        ["pages/yi-yijing-5.html","線上閱讀","書籍詳情、章節目錄"],
        ["catalog.html?view=stats","儀表板","十藏統計（併入書庫目錄）"],
        ["catalog.html?view=map","網站地圖","全站結構一覽（併入書庫目錄）"],
        ["about.html","關於與訂閱","來源、授權、電子報、LINE、捐贈"]
      ].map(function(r){
        return '<tr><td><a href="'+r[0]+'">'+r[1]+'</a></td><td>'+r[2]+'</td></tr>';
      }).join("");
      var catRows=cats.map(function(c){
        return '<tr><td><a href="'+gujiCatUrl(c.id)+'">'+esc(c.name)+'</a></td><td>'+(c.subs||[]).length+'</td><td>'+c.count+'</td></tr>';
      }).join("");
      bodyHtml=
        '<div class="card"><h2 class="sec">主要頁面</h2><table class="data"><thead><tr><th>頁面</th><th>說明</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
        '<div class="card"><h2 class="sec">十藏分類</h2><table class="data"><thead><tr><th>藏別</th><th>子類數</th><th>部數</th></tr></thead><tbody>'+catRows+'</tbody></table></div>';
    } else if(view==="tree"){
      // 樹狀：十藏 → 子類 → 深層分部（遞迴）
      function renderSubs(subs, catId, leafPrefix){
        return (subs||[]).map(function(s){
          if(s.children && s.children.length){
            return '<div class="tree-node"><div class="tree-row">'+
              '<span class="tree-toggle closed"></span>'+
              '<a class="tree-label" href="'+gujiCatUrl(catId,s.name)+'&view=card">'+esc(s.name)+'</a>'+
              '<span class="tree-count">'+s.count+' 部</span></div>'+
              '<div class="tree-children">'+renderSubs(s.children,catId,true)+'</div></div>';
          }
          return '<div class="tree-node"><div class="tree-row">'+
            '<a class="tree-label" href="'+gujiCatUrl(catId,s.name)+'&view=card">'+esc(s.name)+'</a>'+
            '<span class="tree-count">'+s.count+' 部</span></div></div>';
        }).join("");
      }
      var tree='<div class="tree-view">';
      cats.forEach(function(c){
        tree+='<div class="tree-node open"><div class="tree-row">'+
          '<span class="tree-toggle closed"></span>'+
          '<a class="tree-label" href="'+gujiCatUrl(c.id)+'&view=card">'+esc(c.name)+'</a>'+
          '<span class="tree-count">'+c.count+' 部</span></div>'+
          '<div class="tree-children">'+renderSubs(c.subs,c.id,false)+'</div></div>';
      });
      tree+='</div>';
      bodyHtml=tree;
    } else if(view==="list"){
      // 清單：表格
      if(!filtered.length){ bodyHtml='<div class="empty">此分類暫無書目。</div>'; }
      else {
        bodyHtml='<table class="data" style="margin-bottom:16px;"><thead><tr><th>書名</th><th>作者</th><th>朝代</th><th>子類</th></tr></thead><tbody>';
        filtered.forEach(function(b){
          bodyHtml+='<tr><td><a href="'+window.gujiSlug(b)+'">'+esc(b.title)+'</a>'+(b.demo?' <span class="tag demo">示意</span>':"")+'</td>'+
            '<td>'+esc(b.author||"")+'</td><td>'+esc(b.dynasty||"")+'</td><td>'+esc(b.sub||"")+'</td></tr>';
        });
        bodyHtml+='</tbody></table>';
      }
    } else {
      // 卡片（預設）
      var total=filtered.length;
      var pages=Math.max(1,Math.ceil(total/PER));
      page=Math.min(page,pages);
      var start=(page-1)*PER;
      var slice=filtered.slice(start,start+PER);
      if(!slice.length){ bodyHtml='<div class="empty">此分類暫無書目。</div>'; }
      slice.forEach(function(b){
        bodyHtml+=
          '<div class="book-item hover-lift" data-context data-page-url="'+window.gujiSlug(b)+'">'+
            '<div class="b-cover">'+esc(b.title.slice(0,2))+'</div>'+
            '<div class="b-main">'+
              '<a class="b-title" href="'+window.gujiSlug(b)+'">'+esc(b.title)+(b.demo?' <span class="tag demo">示意</span>':"")+'</a>'+
              '<div class="b-meta">'+(b.author||"")+' · '+(b.dynasty||"")+'</div>'+
              '<div class="b-desc">'+esc(b.desc||"")+'</div>'+
            '</div>'+
          '</div>';
      });
      // 分頁導航（精簡：首頁、目前頁±2、末頁，其餘省略）
      if(pages>1){
        bodyHtml+='<div class="pagination"><span class="info">第 '+page+' / '+pages+' 頁 · 共 '+total+' 筆</span>';
        if(page>1){ bodyHtml+='<button onclick="location.href=\'catalog.html?'+qs(catId,sub,page-1,view)+'\'">‹ 上一頁</button>'; }
        var win=[], lo=Math.max(1,page-2), hi=Math.min(pages,page+2);
        if(lo>1){ win.push(1); if(lo>2) win.push("…"); }
        for(var i=lo;i<=hi;i++){ win.push(i); }
        if(hi<pages){ if(hi<pages-1) win.push("…"); win.push(pages); }
        win.forEach(function(n){
          if(n==="…"){ bodyHtml+='<span class="page-num" style="cursor:default;">…</span>'; }
          else { bodyHtml+='<button class="page-num'+(n===page?" active":"")+'" onclick="location.href=\'catalog.html?'+qs(catId,sub,n,view)+'\'">'+n+'</button>'; }
        });
        if(page<pages){ bodyHtml+='<button onclick="location.href=\'catalog.html?'+qs(catId,sub,page+1,view)+'\'">下一頁 ›</button>'; }
        bodyHtml+='</div>';
      }
    }

    wrap.innerHTML =
      '<h1 class="page-title">'+(catId&&window.gujiCatById(catId)?window.gujiCatById(catId).full:"書庫目錄")+'</h1>'+
      '<div class="page-sub">共 '+filtered.length+' 筆書目'+(catId?'':'（十藏全庫 '+window.gujiTotal+' 部）')+'</div>'+
      gridHtml+filterHtml+viewTabs(catId,sub,view)+bodyHtml;

    // 樹狀檢視需初始化摺疊
    if(view==="tree" && window.gujiTree){ window.gujiTree(); }
  };

  function qs(catId,sub,page,view){
    var p=[];
    if(catId) p.push("cat="+encodeURIComponent(catId));
    if(sub) p.push("sub="+encodeURIComponent(sub));
    if(page>1) p.push("p="+page);
    if(view&&view!=="card") p.push("view="+view);
    return p.join("&");
  }
})();
