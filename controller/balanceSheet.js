module.exports.home = function(req, res){
    return res.render('balanceSheet', {admin:req.user.isAdmin, role:req.user.role});
}