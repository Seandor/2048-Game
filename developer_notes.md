# 开发手记

### Notes

 - [X] 增加icon
 - [X] 使用canvas画游戏面板
 - [X] null + null === 0
 - [ ] 必须要理解callback函数的原理
 - [x] 使用Object存储键值的方式能做到和使用`which` 或 `if else`语句一样的效果，但是避免了语句的重复。
 - [x] callback函数就像是自己写一个函数写了一半，后面不写了，交给另外一个函数取执行，有点像放出一个编程接口。
 - [x] canvas重绘应该需要清除原有的格子内容，否则原有的格子边缘看起来很脏。
 - [x] 圆角矩形的边角不那么圆润导致填充颜色看起来有点模糊，需修改。这个很难解决，暂时就不修改了，影响不是很大。
 - [x] canvas的文本看起来也比较模糊，这个应该是可以解决的。

2016-07-05
项目重启:

- [x] 1. 增加计分及游戏结束判断条件，仅逻辑层面，控制台显示。
- [ ] 2. 让分数和游戏的开始结束在页面上正确显示。
- [ ] 3. 让字体大小随着数字位数的增大而减小，就像font-responsive.
- [ ] 4. 增加动画。
- [ ] 5. 增加触屏支持。

### 关于高DPI
这跟放大图片是一个道理。你放大图片后，图片占的面积上有更多的像素点了，但是图片本身的像素不变，所以中间很多像素点都是空的，所以图片变模糊了。当你把一个图片放在高分屏上，同样，如果图片没有缩小显示，那么图片所在的面积上像素点就会变多，而图片本身没有足够多的像素去填充，所以图片也变模糊了。