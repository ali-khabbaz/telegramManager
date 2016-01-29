(function () {
	'use strict';
	define(['app'], function (app) {
		app.controller('uploadCtrl', uploadCtrl);
		app.controller('picCtrl', picCtrl);
		app.controller('textCtrl', textCtrl);
		app.controller('videoCtrl', videoCtrl);
		app.controller('advertiseCtrl', advertiseCtrl);
		uploadCtrl.$inject = ['mainViewFactory', '$timeout', '$scope', '$http', '$location', '$sce',
			'AppMessagesManager', 'AppUsersManager', '$q', 'AppPeersManager', 'MtpApiFileManager'
		];
		picCtrl.$inject = [];
		videoCtrl.$inject = ['$http', 'mainViewFactory'];
		advertiseCtrl.$inject = ['$http', 'mainViewFactory'];
		textCtrl.$inject = ['mainViewFactory', '$timeout', '$scope', '$http', '$location', '$sce',
			'AppMessagesManager', 'AppUsersManager', '$q', 'AppPeersManager', 'MtpApiFileManager'
		];


		function uploadCtrl(mainFac, $timeout, $scope, $http, $location, $sce, AppMessagesManager,
			AppUsersManager, $q, AppPeersManager, MtpApiFileManager) {

			$scope.tab = 1;
			$scope.authenticated = false;
			$scope.flag = false;
			$scope.complete = false;
			$scope.progress = 0;
			$scope.files = [];
			$scope.contacts = [];
			$scope.showSendFile = false;
			$scope.uploadMessageId = 0;
			$scope.search = '';
			var userId = JSON.parse(mainFac.getUserTelegramToken()).id,
				condor = {
					id: 125756687,
					hash: 9037127352230318756
				};
			main();
			$scope.$broadcast('getChanel');

			function getUserDialogMessage(userId, accessHash) {
				var dfd = $q.defer();
				$scope.peerHistory = {};
				$scope.peerHistory.messages = [];
				$scope.peerHistory.ids = [];
				$scope.video = [];
				$scope.image = [];
				var peerHistory = {
					messages: []
				};
				/*hamid 'user_id': '93893642',
				 'access_hash': '7853010939461100141'*/
				AppMessagesManager.getHistory({
						_: 'inputPeerUser',
						'user_id': userId,
						'access_hash': accessHash
					}, 0, 0)
					.then(function (historyResult) {
						angular.forEach(historyResult.history, function (id) {
							peerHistory.messages.unshift(AppMessagesManager.wrapForHistory(id));
							//peerHistory.ids.unshift(id);
						});
						/*ali :93893642, access_hash : 7853010939461100141 */
						////console.log('conversations----11111', peerHistory);
						AppMessagesManager.getHistory({
								_: 'inputPeerUser',
								'user_id': userId,
								'access_hash': accessHash
							}, peerHistory.messages[0].id, Number.MAX_SAFE_INTEGER)
							.then(function (historyResult2) {
								angular.forEach(historyResult2.history, function (id) {
									peerHistory.messages.unshift(AppMessagesManager.wrapForHistory(id));
									//peerHistory.ids.unshift(id);
								});
								////console.log('conversations----222222', peerHistory);
								dfd.resolve(peerHistory);
							});
					});
				return dfd.promise;
			}

			function main() {
				$scope.authenticated = mainFac.isAuthenticated();
				if (!$scope.authenticated) {
					$location.url('/home');
				}
				$q.all([getAllDialogs(),
						getUserDialogMessage(condor.id, condor.hash)
					])
					.then(function (res) {
						var i, data, temp = {};
						$scope.files = []; ///movie
						$scope.images = [];
						$scope.contacts = []; //res[0];
						for (var j = 0; j < res[0].length; j++) {
							if (res[0][j].peerData.title) {
								$scope.contacts.push(res[0][j]);
							} else if (res[0][j].peerData.first_name) {
								$scope.contacts.push(res[0][j]);
							} else if (res[0][j].peerData.username) {
								$scope.contacts.push(res[0][j]);
							}

						}
						//console.log('contactssss:', $scope.contacts);
						data = res[1].messages;
						for (i = 0; i < data.length; i++) {
							if (!data[i].message) {
								temp = {};
								if (data[i].media.document) {
									////console.log('temp-----------', data[i].media.document['file_name']);
									temp.id = data[i].id;
									temp.date = data[i].date;
									temp.name = data[i].media.document['file_name'];
									temp.size = data[i].media.document.size;
									temp.id2nd = data[i].media.document.id;
									temp.type = data[i].media.document['mime_type'].split('/')[0];
									if (data[i].media.views) {
										temp.views = data[i].media.views;
									}
									if (temp.type == 'image') {
										$scope.images.push(temp);
									} else if (temp.type == 'video') {
										$scope.files.push(temp);
									}
								}
							}
						}
						//console.log('files--------', $scope.files);
						//console.log('contacts--------', $scope.contacts);
					});
			}

			function uploadfile(fileObject) {

				fileObject.lastModified = new Date();
				fileObject.webkitRelativePath = '';
				//console.log('file recieved', fileObject[0]);
				//92476023    93893642///ali ...//36282101 hosein   ///iman81412715
				AppMessagesManager.sendFile(92476023, fileObject[0], {
					replyToMsgID: undefined,
					isMedia: false
				});
				$scope.$watch(function () {
					return MtpApiFileManager.getProgress()
				}, function (newVal, oldVal) {
					//console.log('>>>>>', newVal);
					if (newVal != oldVal) {
						$scope.progress = newVal * 100;
						if ($scope.progress > 90) {
							$scope.progress = 100;
							$scope.complete = true;
							$scope.flag = false;
						}
					}
				});


			}

			$timeout(function () {
				$('.mCustomScrollbar').mCustomScrollbar({
					theme: "dark-thin",
					scrollInertia: 0,
					live: "once"
				});
			}, 10);
			$scope.typeDividerSelect = function (type) {
				$scope.tab = type;
			};
			////////////////////////////////////////////////////////////////////////////////
			//$scope.getVideos = getVideos;
			//$scope.getImages = getImages;
			$scope.fadeOut = function () {
				$('.overlay').fadeOut(function () {
					$scope.showSendFile = false;
				});
				$('.upload_contacts').fadeOut(function () {
					$scope.showSendFile = false;
				});
			};
			var getFileBlob = function (url, cb) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = 'blob';
				xhr.addEventListener('load', function () {
					cb(xhr.response);
				});
				xhr.send();
			};

			var blobToFile = function (blob, name) {
				blob.lastModifiedDate = new Date();
				blob.name = name;
				return blob;
			};

			var getFileObject = function (filePathOrUrl, cb) {
				getFileBlob(filePathOrUrl, function (blob) {
					var fileType = filePathOrUrl.slice(25).slice(filePathOrUrl.slice(25).indexOf('.') + 1);
					var fileNeme = filePathOrUrl.slice(25).slice(0, filePathOrUrl.slice(25).indexOf('.') + 1);
					cb(blobToFile(blob, fileNeme + fileType));
				});
			};

			//getDialogs();
			/*-------------for send video or image--------------------------*/
			$scope.draftMessage = {
				text: '',
				send: sendMessage //,
					//replyClear: replyClear,
					//fwdsClear: fwdsClear
			};
			$scope.mentions = {};
			$scope.commands = {};
			$scope.$watch('draftMessage.files', onFilesSelected);


			function onFilesSelected(newVal) {
				if (!angular.isArray(newVal) || !newVal.length) {
					return;
				}
				var options = {
					replyToMsgID: $scope.draftMessage.replyToMessage && $scope.draftMessage.replyToMessage.mid,
					isMedia: $scope.draftMessage.isMedia
				};

				delete $scope.draftMessage.replyToMessage;

				if (newVal[0].lastModified) {
					newVal.sort(function (file1, file2) {
						return file1.lastModified - file2.lastModified;
					});
				}
				//console.log('----------------- P H O T O ----------------', 94030292,
				//'%%%%%%%%%%%%%', newVal, '%%%%%%%%%%%%', options);
				for (var i = 0; i < newVal.length; i++) {
					AppMessagesManager.sendFile(94030292, newVal[i], options);
					$scope.$broadcast('ui_message_send');
				}
				fwdsSend();
			}

			function fwdsClear() {
				if ($scope.draftMessage.fwdMessages &&
					$scope.draftMessage.fwdMessages.length) {
					delete $scope.draftMessage.fwdMessages;
					$scope.$broadcast('ui_peer_reply');

				}
			}

			function fwdsSend() {
				if ($scope.draftMessage.fwdMessages &&
					$scope.draftMessage.fwdMessages.length) {
					var ids = $scope.draftMessage.fwdMessages.slice();
					fwdsClear();
					setTimeout(function () {
						AppMessagesManager.forwardMessages($scope.curDialog.peerID, ids);
					}, 0);
				}
			}

			function sendMessage(e) {
				$scope.$broadcast('ui_message_before_send');
				//console.log('----------------- P H O T O ------1----------', e);

				$timeout(function () {
					var text = $scope.draftMessage.text;

					if (angular.isString(text) && text.length > 0) {
						text = text.replace(/:([a-z0-9\-\+\*_]+?):/gi, function (all, shortcut) {
							var emojiCode = EmojiHelper.shortcuts[shortcut];
							if (emojiCode !== undefined) {
								return EmojiHelper.emojis[emojiCode][0];
							}
							return all;
						});

						var timeout = 0;
						var options = {
							replyToMsgID: $scope.draftMessage.replyToMessage &&
								$scope.draftMessage.replyToMessage.mid
						};
						do {
							(function (peerID, curText, curTimeout) {
								setTimeout(function () {
									AppMessagesManager.sendText(peerID, curText, options);
								}, curTimeout)
							})($scope.curDialog.peerID, text.substr(0, 4096), timeout);

							text = text.substr(4096);
							timeout += 100;

						} while (text.length);
					}
					fwdsSend();
					if (forceDraft == $scope.curDialog.peer) {
						forceDraft = false;
					}
					resetDraft();
					$scope.$broadcast('ui_message_send');
				});

				return cancelEvent(e);
			}

			/*-------------for send video or image--------------------------*/


			function getVideos() {
				$scope.videos = [];
				var url = mainFac.getApiUrl() + 'app/videos/',
					i;
				$http.post(url)
					.success(function (data) {
						for (i = 0; i < data.length; i++) {
							$scope.videos.push({});
							$scope.videos[i].trustAddress = $sce.trustAsResourceUrl('upload/' + data[i].name);
							$scope.videos[i].address = mainFac.getApiUrl() + '/upload/' + data[i].name;
						}
						//console.log($scope.videos);
					})
					.error(function (data) {
						//console.log(data);
					});
			}

			function getImages() {

				$scope.images = [];
				var url = mainFac.getApiUrl() + 'app/images/',
					i;
				$http.post(url)
					.success(function (data) {
						for (i = 0; i < data.length; i++) {
							$scope.images.push({});
							//$scope.images[i].trustAddress = $sce.trustAsResourceUrl('upload/' + data[i].name);
							$scope.images[i].address = mainFac.getApiUrl() + '/upload/' + data[i].name;
						}
						//console.log($scope.images);
					})
					.error(function (data) {
						//console.log(data);
					});
			}

			$scope.sendFile = function (messageId, sendContactId) {
				//console.log('>>>>>>>>>>>>>>>>>', messageId, sendContactId);
				if (!sendContactId) {
					$('.upload_contacts').fadeIn();
					$('.overlay').fadeIn();
					$scope.showSendFile = true;
					$scope.uploadMessageId = messageId;
				} else {
					//mahmod mzfr 178589339 .//morteza :101777442      vahid///92476023
					////poorya 111035748   94030292
					////console.log('messageId', AppPeersManager.isChannel(1023510054));
					AppMessagesManager.forwardMessages(sendContactId, [$scope.uploadMessageId]);
					$scope.showSendFile = false;
				}
			};

			$scope.uploadedFile = function (element) {
				$scope.$apply(function ($scope) {
					if (element.files[0]) {
						$scope.flag = true;
						$scope.complete = false;
						$scope.progress = 0;
						$scope.add_files = element.files;
						var t = {};
						t.date = element.files[0].lastModified;
						t.name = element.files[0].name;
						$scope.files.push(t);
						$scope.addFile();
					}
				});
			};
			$scope.addFile = function () {
				uploadfile($scope.add_files,
					function (res) {
						//console.log('ploaded', res);
					},
					function (err) {
						//console.log('error', err);
					});
			};

			function getAllDialogs() {
				var dfd = $q.defer(),
					i;
				getDialogs(0).then(function (result) {
					for (i = 0; i < result.length; i++) {
						result[i].peerData = AppPeersManager.getPeer(result[i].peerID);
					}
					mainFac.setDialogs(result);
					////console.log('dialogs------', result);
					dfd.resolve(result);
				});
				return dfd.promise;
			}

			function getDialogs(offsetIndex) {
				var dfd = $q.defer(),
					i, temp;
				AppMessagesManager.getConversations('', offsetIndex, 500).then(function (result) {
					////console.log('conversationnnnnssnsn', result);

					if (result.dialogs.length) {
						offsetIndex = result.dialogs[result.dialogs.length - 1].index;
						temp = mainFac.getDialogs();
						for (i = 0; i < result.dialogs.length; i++) {
							temp.push(result.dialogs[i]);
						}


						mainFac.setDialogs(temp);
						dfd.resolve(temp);
					} else {
						dfd.resolve();
					}
				});
				return dfd.promise;
			}
		}

		function picCtrl() {
			var vm = this;
			vm.vahid = 'vahid';
		};

		function textCtrl(mainViewFactory, $timeout, $scope, $http, $location, $sce,
			AppMessagesManager,
			AppUsersManager, $q, AppPeersManager, MtpApiFileManager) {
			var vm = this;
			vm.sendText = sendText;
			vm.text = '';
			vm.creator_channel = [];
			var userId = JSON.parse(mainViewFactory.getUserTelegramToken()).id;
			angular.forEach(mainViewFactory.getDialogs(), function (dialog) {
				if (AppPeersManager.isChannel(dialog.peerID)) {
					if (dialog.peerData.pFlags.creator) {
						vm.creator_channel.push({
							id: dialog.peerID,
							title: dialog.peerData.title
						});
					}
				}
			});
			vm.selected_chanel = vm.creator_channel[0];

			function sendText() { //1003313974    //-1023510054
				AppMessagesManager.sendText(vm.selected_chanel.id, vm.text, {
					replyToMsgID: undefined,
					isMedia: false
				});
			}
		}


		function videoCtrl($http, mvf) {

		}

		function advertiseCtrl($http, mvf) {
			var vm = this;
			var telegram_Id = JSON.parse(mvf.getUserTelegramToken()).id;
			vm.advertise = {
				text1: '',
				text2: '',
				text3: '',
				text4: '',
				title: ''
			};
			vm.count = '1';
			vm.sendAdvertise = sendAdvertise;
			vm.accordion = accordion;

			function sendAdvertise(day) {
				if (vm.advertise.text1 != '' && vm.advertise.text2 != '' && vm.advertise.title != '') {
					var all_advertise = vm.advertise.text1 + ';' + vm.advertise.text2 + ';' + vm.advertise.text3 +
						';' + vm.advertise.text4;
					var params = {
						content: all_advertise,
						title: vm.advertise.title,
						regionId: +mvf.getUser().split(',')[1],
						candidaId: telegram_Id,
						day: day,
						count: +vm.count,
						iconUrl: '',
						id: +mvf.getUser().split(',')[2]
					};
					var url = mvf.apiUrl + 'app/advertise_insert';
					$http({
						method: 'POST',
						url: url,
						params: params
					}).success(function (res) {
						if (res.advertise == 'exist') {
							alert('شعار های شما به روز شد.');
						} else {
							alert('شعارهای شما بدرستی ثبت شد و در نرم افزار مشاهده میشود ')
						}
					}).error(function (err) {
						//console.log('error is', err);
					});
				} else {
					alert('لطفا عنوان پیام و حداقل دو شعار تبلیغاتی وارد نمایید');
				}

			}

			function accordion(e) {
				var target = $(event.target).parent();
				$(".accordion_header").parent().removeClass("open");
				$(".accordion_header").parent().children(".accordion_main").slideUp();
				if (target.children("div.accordion_main").css("display") == "block") {
					target.removeClass("open");
					target.children("div.accordion_main").slideUp();
				} else {
					target.addClass("open");
					target.children("div.accordion_main").slideDown();
				}
			}


		}

	});
}());