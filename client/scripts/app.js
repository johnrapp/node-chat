var app = angular.module('app', ['socket.io'])
//.constant('alphabet', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
.constant('vowels', ['a', 'e', 'i', 'o', 'u', 'y'])
.constant('consonants', ['a', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'])
.constant('rooms', ['Default room', 'Awesome room'])

.constant('messages', [])
.constant('profile', {})
.service('Color', function() {
	return function(name, backgroundColor, textColor) {
		this.style = {}
		this.style['background-color'] = backgroundColor;
		this.style['color'] = textColor;
		this.name = name;
	}
})

.controller('channelCtrl', ['$scope', 'messages', 'rooms', 'socket',
	function($scope, messages, rooms, socket) {
		$scope.rooms = rooms;
		$scope.selected = $scope.rooms[0];
		$scope.select = function(room) {
			$scope.selected = room;
			messages = [];
			socket.emit('select room', room);
		}
	}]
)
.controller('nicknameCtrl', ['$scope', 'profile', 'consonants', 'vowels',
	function($scope, profile, consonants, vowels) {
		$scope.$watch('nickname', function() {
			profile.nickname = $scope.nickname;
		});
		$scope.random = function() {
			$scope.nickname = function generate(string, amount) {
				var array = Math.random() > 0.6 ? consonants : vowels;
				string += array[Math.floor(Math.random() * array.length)];
				if(amount > 0) return generate(string, --amount);
				else return string;
			}('', Math.floor(Math.random() * 4) + 2);
		}
		$scope.clear = function() {
			$scope.nickname = '';
		}
	}]
)
.controller('colorCtrl', ['$scope', 'profile', 'Color',
	function($scope, profile, Color) {
		$scope.colors = [
			new Color('Gray', '#222', '#fff'),
			new Color('Green', '#08FD00', '#fff'),
			new Color('Silver', '#DDDDDD', '#000'),
			new Color('Gold', '#FFD700', '#000'),
			new Color('Blue', '#3377C2', '#fff'),
			new Color('Red', '#BA0001', '#fff'),
			new Color('White', '#fff', '#000')
		];
		$scope.current = $scope.colors[0];
		profile.style = $scope.current.style;
		$scope.toggle = function() {
			$scope.expanded = !$scope.expanded;
		}
		$scope.select = function(color) {
			profile.style = color.style;
			$scope.current = color;
			$scope.expanded = false;
		}
	}]
)
.controller('messagesCtrl', ['$scope', 'messages', 'socket', 'rooms',
	function($scope, messages, socket, rooms) {
		$scope.messages = messages;
		socket.on('new message', function(message) {
			messages.push(message);
		});
	}]
)
.controller('newCtrl', ['$scope', 'messages', 'socket', 'profile',
	function($scope, messages, socket, profile) {
		var MAX_LENGTH = 128;

		$scope.keyDown = function(e) {
			if(!$scope.message) return false;
			if(e.keyCode === 13 && !e.shiftKey) {
				var message = {content: $scope.message, sender: profile};
				socket.emit('broadcast message', message);
				message.own = true;
				messages.push(message);

				$scope.message = '';
				e.preventDefault();	
			} else if($scope.message.length >= MAX_LENGTH && e.keyCode !== 8)
				e.preventDefault();
		}
	}]
);