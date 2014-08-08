'use strict';

pcsoLotto.controller('DashboardCtrl', function($scope) {
	var d = new Date();
	$scope.date = d.getMonth() +'/'+ d.getDate() + '/' + d.getFullYear();
	
	/*
	$http.get(url).then(function(resp) {
		
	});
	*/
	$scope.results = [
	                 {'draw' : '6/45 MegaLotto', 'result' : '12-34-23-12-15-30'},
	                 {'draw' : 'Swertres 11 AM', 'result' : '12-34-23'},
	                 {'draw' : 'Swertres 4 PM', 'result' : '12-34-23'},
	                 {'draw' : 'Swertres 9 PM', 'result' : '12-34-23'} 
	                ]
	
	$scope.checkResult = function() {
		alert('test');
	}
	
	
});

