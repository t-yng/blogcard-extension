(function(global){
  // ES6のクラス構文を利用するために、strictモードで実行
  'use strict'
  
  function changeMessageAreas(records) {
    const nodeArray = records
      .map(record => Array.apply(null, record.addedNodes)) // NodeListをArrayに変換
      .reduce((a,b) => a.concat(b))

    nodeArray.forEach(node => {
      const text = $(node).find('pre').text()
      const pattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
      if(text.match(pattern)) {
        const url = text.match(pattern)[0]
        console.log(url)
        getBlogCard(url)
          .then((html) => {
            $(node).find('.chatTimeLineMessageArea').append(html)
            console.log(html)
          })
      }
    })
  }

  // DOMの監視を開始する
  function startMonitorDom(){
    // DOMの監視をするノードを取得
    var timeline = document.getElementById("_timeLine")
    var options = {childList: true, subtree: true}

    // メッセージ一覧のDOMの監視を開始
    var timelineMo = new MutationObserver(changeMessageAreas)
    timelineMo.observe(timeline, options)
  }

  $(document).ready(() => {
    startMonitorDom()
  })

  // 引数で指定したURLのブログカードを取得
  const getBlogCard = function(url) {
    return new Promise((resolve) => {
      $.getJSON('https://blogcard-generator.herokuapp.com/generator.php', {
        url: url
      })
      .done((data) => {
        if(data) {
          const result = data.html
          resolve(result)
        }
      })
    })
  }


})(this)