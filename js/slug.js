/* 將書目 id 轉成靜態 SEO 檔名（與 rename_pages_seo.py 規則一致） */
window.GUJI_CAT_EN = {
  "易藏":"yi","儒藏":"ru","道藏":"dao","佛藏":"fo","子藏":"zi",
  "史藏":"shi","詩藏":"poetry","集藏":"collected","醫藏":"medicine","藝藏":"art"
};
window.GUJI_SUB_EN = {
  "易經":"yijing","術數":"shushu",
  "詩經":"shijing","尚書":"shangshu","禮經":"lijing","樂經":"yuejing",
  "春秋":"chunqiu","小學":"xiaoxue","四書":"sishu","五經總義":"wujing",
  "孝經":"xiaojing","語錄":"yulu","啟蒙蒙學":"mengxue","修身治家":"xiushen",
  "正統道藏洞神部":"dongzhen","正統道藏洞真部":"dongshen","正統道藏洞玄部":"dongxuan",
  "正統道藏正一部":"zhengyi","藏外":"zangwai","正統道藏太玄部":"taixuan",
  "正統道藏太平部":"taiping","正統道藏續道藏":"xudaozang","正統道藏太清部":"taiqing",
  "大藏經":"dazangjing","乾隆藏":"qianlong","續藏經":"xuzangjing","嘉興藏":"jiaxing",
  "筆記":"biji","類書":"leishu","雜論":"zalun","兵家":"bingjia","諸子":"zhuzi",
  "農家":"nongjia","法家":"fajia","演算法":"suanfa",
  "志存記錄":"zhicun","地理":"dili","職官":"zhiguan","別史":"bieshi",
  "傳記":"chuanji","詔令奏議":"zhaoling","政書":"zhengshu","載記":"zaiji",
  "正史":"zhengshi","編年":"biannian","紀事本末":"jishi","史評":"shiping",
  "目錄":"mulu","經世文編":"jingshi","四庫雜史":"siku",
  "劇曲":"juqu","詞集":"ciji","詩集":"shiji","對聯":"duilian",
  "楚辭":"chuci","漢賦":"hanfu",
  "別集":"bieji","小說":"xiaoshuo","詩話":"shihua","詞話":"cihua",
  "話本":"huaben","演義":"yanyi","總集":"zongji","文評":"wenping","寶卷":"baojuan",
  "未分類":"unclassified",
  "草木鳥獸蟲魚":"birds-beasts","飲饌":"yinzhuan","繪畫":"huihua","書法":"shufa",
  "武術":"wushu","器物":"qiwu","音樂":"yinyue","綜合":"zonghe","篆刻":"zhuanke"
};
window.gujiSlug = function(b){
  var num = (b.id||"").split("-").pop();
  var ce = window.GUJI_CAT_EN[b.cat] || "book";
  var se = window.GUJI_SUB_EN[b.sub] || "classical";
  return "pages/" + ce + "-" + se + "-" + num + ".html";
};

/* 由目前頁面深度決定相對前綴（root=空、pages/=../、categories/=../） */
window.gujiBase = function(){
  var p = location.pathname.replace(/\\/g,"/");
  if(p.indexOf("/pages/")>-1 || /\/pages\/[^/]+\.html$/.test(p)) return "../";
  if(p.indexOf("/categories/")>-1 || /\/categories\/[^/]+\.html$/.test(p)) return "../";
  return "";
};

/* 將 cat id（中文或英文）＋子類名轉成靜態分類 URL */
window.gujiCatUrl = function(catId, subName){
  var EN2CAT = {};
  for(var zh in window.GUJI_CAT_EN){ EN2CAT[window.GUJI_CAT_EN[zh]] = zh; }
  var catZh = window.GUJI_CAT_EN[catId] ? catId : (EN2CAT[catId] || "");
  var ce = window.GUJI_CAT_EN[catZh] || catId;
  var base = window.gujiBase();
  if(subName){
    var se = window.GUJI_SUB_EN[subName] || "classical";
    return base + "categories/cat-" + ce + "-" + se + ".html";
  }
  return base + "categories/cat-" + ce + ".html";
};
