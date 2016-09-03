# smooth.js
一个简约的H5单页制作工具，它能够帮你快速制作移动端的H5单页页面，或者PPT演示文稿。

## 使用
-----------------

### 一、依赖与安装

smooth.js依赖zepto和手势库hammer.js，引入这两个库后再在HTML文档中引入smooth的js文件和css文件。

```html
    <link rel="stylesheet" href="./path/to/smooth.css">
    <script src="./path/to/smooth.js"></script>
```

或者你也可以通过AMD的方式引入：

```javascript

requirejs.config({
    paths: {
        'smooth': './path/to/smooth.js'
    }
})

require(['smooth'], function(Smooth){
    var smooth = new Smooth('.sm',[options])
})
```

### 二、HTML

要使用smooth.js制作页面，你的HTML文档必须具有如下的格式。

```html
<body>
	<main class="sm">
		<section class="stage" id="s-1" animate="rightIn">
            <div id="heading" class="bloc" now="now" animate="lightSpeedIn">
				<h1>smooth.js</h1>
			</div>
			<div class="bloc" id="intro" animate="rightInReverse">
				<h3>很轻的H5、PPT演示文稿制作工具</h3>
			</div>
			<div class="bloc" id="start" animate="fadeIn">
				<span>开始使用</span>
			</div>
		</section>
		<section class="stage" now="now" id="s-2" animate="rightIn">
            <!--whatever-->
        </section>
        <!--and more stages-->
    </main>
</body>
```
smooth将HTML页面分成若干个stage，一个stage指一个单页，每个stage又分为若干个bloc，一个bloc指代一个动画单元。CSS类名为`stage`的类名会被识别为一个stage，在`<element class="stage"/>`元素中，你可以声明stage的入场动画效果`animate`，smooth内置了一点点CSS动画效果，建议你引用其它动画库例如Animate.css。

stage的内部包含着bloc元素，bloc是指一个单页内部的动画单元，CSS类名为`bloc`的类名会被识别为一个`bloc`，在bloc的html元素上可以声明动画效果，运行时各个bloc依次依照动画效果进场。bloc还规定了一个名为`now`的`attribute`，设置了now的bloc会在stage进场动画结束时立即进场，而不必等待用户交互。

stage的内部一般包含bloc，但这并不是必需的，stage中没有bloc类名的子元素会随着stage一起进场，不会有任何动画效果。

二、Javascript

使用smooth你只要书写很少的Javascript代码，即声明一个smooth对象和做相关的配置。

```javascript

//实例化一个smooth对象，并传入参数
var smooth = new Smooth('.selector'[, options])

```
smooth还提供一个`anchor`的方法，用于自定义stage的跳转。例如：

```javascript

smooth.anchor('#back', 'tap', '#stage-1')

```
这样当用户轻触`id`为`back`的元素时，smooth会立即跳转到`id`为`stage-1`的单页。

在线演示，请点击[这里]()