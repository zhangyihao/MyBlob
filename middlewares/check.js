/**
 * Created by zhangyihao on 2017-01-13.
 */
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if(!req.session.user) {
            req.flash('error', '未登录');
            return res.redirect('/singin');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if(req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('back');
        }
        next();
    }
}