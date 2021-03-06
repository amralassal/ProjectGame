var Explosion = cc.Sprite.extend({
    tmpWidth:0,
    tmpHeight:0,
    ctor:function () {
        this._super();
        this.tmpWidth = this.getContentSize().width;
        this.tmpHeight = this.getContentSize().height;

        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame("explosion_1.png");
        this.initWithSpriteFrame(pFrame);

        var animation = cc.AnimationCache.getInstance().getAnimation("Explosion");
        this.runAction(cc.Sequence.create(
            cc.Animate.create(animation, false),
            cc.CallFunc.create(this, this.destroy)
        ));
        //this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    },
    destroy:function () {
        this.getParent().removeChild(this,true);
    }
});

Explosion.sharedExplosion = function () {
    cc.SpriteFrameCache.getInstance().addSpriteFrames(hero_rs.p_1);
    var animFrames = [];
    var str = "";
    for (var i = 1; i < 35; i++) {
        str = "explosion_" + i + ".png";
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
        animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 0.04);
    cc.AnimationCache.getInstance().addAnimation(animation, "Explosion");
};
