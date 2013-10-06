Rack plan JS
======================
ラックプランを簡単に図化するためのJavaScriptライブラリです。  
XMLでラック情報を記述して、JSでCanvasを生成します。

必要ライブラリ
-------------
+ jQuery [http://jquery.com/](http://jquery.com/)
+ jCanvas [http://http://calebevans.me/projects/jcanvas/](http://http://calebevans.me/projects/jcanvas/)

推奨ライブラリ
-------------
+ Bootstrap [http://getbootstrap.com/](http://getbootstrap.com/)

使い方
------
### HTML ###
jQuery, jcanvasを読み込んだ後、rack.jsを読み込みます。  

	  <body>
	    <div class="container">
	      <div id="main" class="row">
	      </div>
	    </div>
	
	    <!-- place bottom  -->
	    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	    <script src="js/bootstrap.min.js"></script>
	    <script src="js/jcanvas.js"></script>
	    <script src="js/rack.js"></script>
	    <script type="text/javascript" defer>
	      Rackplan("#main", "example1.xml");
	    </script>
	  </body>

Rackplan()の呼び出し方は、
	Rackplan(_ターゲットdivのid_ , _XMLのPath_ , _挿入するdivのClass_ (Option) )
となっています。

 XML
------

XMLは、<racks> エンティティの中に、<rack>を複数定義できます。  
さらに、<rack> は <mount> と <net> を0個以上持つことが出来ます。

### XMLのサンプル ###

    <?xml version="1.0" encoding="UTF-8"?>
    <racks>
      <rack name="My rack (24U)" size="24">
        <mount offset="20" size="1" label="Switch" />
        <mount offset="15" size="1" label="PC1" />
        <mount offset="13" size="1" label="PC2" />
        <mount offset="11" size="1" label="PC3" />
        <mount offset="0" size="3" label="UPS 3000" />
     
        <net member="0,20,15,13,11" side="right" label="Power Line" color="red" />
        <net member="20,15,13,11" side="left" label="192.168.2.0/24" color="blue" />
        <net member="20" side="right" label="to Next Rack" />
      </rack>

      <rack name="My rack2 (24U)" size="24">
        <mount offset="0" size="3" label="UPS 3000" />
      </rack>
    </racks>


### rack ###
+   `name` :
    ラックの名前を定義します。必須項目。ユニークである必要があります。
+   `size` :
    ラックのU数を定義します。必須項目。

### mount ###
+   `offset` :
    マウント位置を定義します。必須項目。0〜U数-1までを指定します。
+   `size` :
    マウント機材のU数を定義します。必須項目。
+   `label` :
    ラベル文字列を定義します。
+   `color` :
    機材の色を定義します。
+   `label_color` :
    ラベル文字の色を定義します。

### net ###
+   `side` :
    ラック図の左右どちらに引くかを定義します。"left" or "right"。必須項目。
+   `member` :
    どの位置からラインを引くかを定義します。カンマ区切り。必須項目。
+   `label` :
    ラベル文字列を定義します。
+   `color` :
    ラインの色を定義します。

