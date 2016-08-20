#LeanCloud文档笔记
=======

##创建
=======
1. 创建新行
```javascript
//-创建表（对象）
var Todo = AV.Object.extend('Todo')

//-创建行
var todo = new Todo()

//-或者直接创建某个表中的行
var todo = new AV.Object('Todo')
```
2. 获取已经存在的行
```javascript
var todo = new Todo()
todo.id = '5745557f71cfe40068c6abe0'
todo.fetch()

//或者
var todo = AV.Object.createWithoutDate('Todo', '5745557f71cfe40068c6abe0')
```

3. 保存
```javascript
todo.set({
    a: 'A',
    b: 2,
    c: new Date()
}).save().then(function(todo){
    console.log(todo.id)
})
```
##一般查询
========
先创建query对象，然后可以设置条件，最后调用`get()`，`find()`等方法获取结果。

1. 根据id查询
```javascript
var query = new AV.Query('Todo')
query.get('5745557f71cfe40068c6abe0').then(function(todo){
    //得到todo
})
```
2. 根据条件查询
```javascript
//创建查询对象
var query = new AV.Query('Todo')

//设置条件缓存起来
query.equalTo('name', 'qi')
query.notEqualTo('gender', 'male')
query.matches('title', /RegExp/)
query.limit(10)
query.select('title', 'data')
query.ascending('date')

//获取结果
query.find() //找到所有结果
query.first() //只要第一个
query.count() //只要个数
```
##CQ查询
===========

##关联 Relation&Pointer
============
1. 关联设置
```javascript
AV.Object.saveAll(AVObjectArray).then(function(cloudObjects){
    var todo = AV.Object.createWithoutDate('Todo', '5745557f71cfe40068c6abe0')

    var relation = todo.relation('comments')
    for(var i = 0; i < cloudObjects.length; i++){

        //“一”方设置归属关系
        relation.add(cloudObjects[i])

        //“多”方设置指针
        cloudObjects[i].set('targetTodo', todo)
    }
    todo.save()
})
```
2. 关联查询
```javascript

//relation实际上是一个虚拟表

var todo = AV.Object.createWithoutDate('Todo', '5745557f71cfe40068c6abe0')
var relation = todo.relation('comments')

var query = relation.query()

query.find()

//pointer实际上仅仅是一个普通的指针属性，所以和一般查询无异
var query = new AV.Query('Comment')
var todo = AV.Object.createWithoutDate('Todo', '5745557f71cfe40068c6abe0')
query.equalTo('targetTodo', todo)
query.find()
```








