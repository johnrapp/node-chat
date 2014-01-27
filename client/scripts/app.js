var app = angular.module('app', ['socket.io'])
.constant('messages', [])
.constant('nickname', '')

.controller('nicknameCtrl', ['$scope', 'nickname',
	function($scope, nickname) {
		$scope.nickname = nickname;
		$scope.randomName = function() {
			$scope.nickname = 'lol';
		}
	}]
)
.controller('messagesCtrl', ['$scope', 'messages', 'socket',
	function($scope, messages, socket) {
		$scope.messages = messages;
		socket.on('new message', function(message) {
			message.own = false;
			messages.push(message);
		});
	}]
)
.controller('newCtrl', ['$scope', 'messages', 'socket', 'nickname',
	function($scope, messages, socket, nickname) {
		var MAX_LENGTH = 128;

		$scope.keyDown = function(e) {
			if(!$scope.message) return false;
			if(e.keyCode === 13 && !e.shiftKey) {
				messages.push({content: $scope.message, own: true});
				socket.emit('broadcast message', {content: $scope.message, author: nickname || 'anonymous'});
				$scope.message = '';
				e.preventDefault();	
			} else if($scope.message.length >= MAX_LENGTH && e.keyCode !== 8)
				e.preventDefault();
		}
	}]
);