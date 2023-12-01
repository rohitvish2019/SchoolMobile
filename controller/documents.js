module.exports.documentsHome = function(req, res){
    return res.render('documents', {admin:req.user.isAdmin, role:req.user.role});
}