//only for dev
require.config({
	baseUrl:'/',
	paths:{
		plus:'sign/js/index',
		vendor:'assets/js/vendor',
		API:'assets/js/service'
	}
})
require(['vendor', 'API'], function(vendor, API){
	var $ = vendor.$, $$ = vendor.$$;
	var signForm = $('#sign-form');
	var loginPost = function(e){
		e.preventDefault();
		if(!signForm[0].username.value || signForm[0].username.value.length < 2){
			return $$.alertInfo('用户名不能少于2个字符长度');
		}
		if(!signForm[0].password.value || signForm[0].password.value.length < 6){
			return $$.alertInfo('密码不能少于6个字符长度');
		}
		var obj = {
			remember:+signForm[0].remember.checked,
			account:signForm[0].username.value,
			password:signForm[0].password.value
		}
		API.login(obj).then(function(res){
			console.log(res,'fffffffffff')
		});
	}
	signForm.on('submit', loginPost);
});