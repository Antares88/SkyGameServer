SkyGameServer.Admin = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {

		let adminRoom = SkyGameServer.ROOM('Admin');

		let wrapper;
		let footer;
		
		let passwordStore = SkyGameServer.COOKIE_STORE('passwordStore');
		let password = passwordStore.get('password');
		
		if (password === undefined) {
			password = prompt('관리자');
		}
		
		adminRoom.send({
			methodName : 'auth',
			data : password
		}, (isOk) => {
			if (isOk === true) {
				
				passwordStore.save({
					name : 'password',
					value : password,
					isToSession : true
				});
				
				wrapper = DIV({
					style : {
						backgroundColor : '#191971',
						borderBottom : '1px solid #fff'
					},
					c : [
					H1({
						style : {
							textAlign : 'center',
							padding : 10,
							fontWeight : 'bold',
							fontSize : 15,
							borderBottom : '1px solid #fff'
						},
						c : 'Sky Game Server 관리자 콘솔'
					}),
					
					A({
						style : {
							flt : 'left',
							padding : 10
						},
						c : '푸시 메시지 보내기',
						on : {
							tap : () => {
								
								let form;
								let modal = UUI.MODAL({
									style : {
										backgroundColor : '#191971',
										width : 280,
										border : '1px solid #fff',
										padding : 10
									},
									xIcon : IMG({
										src : SkyGameServer.R('x.png')
									}),
									c : [H2({
										c : MSG({
											ko : '푸시 메시지 보내기'
										})
									}), form = UUI.VALID_FORM({
										c : [
										UUI.FULL_SELECT({
											style : {
												marginTop : 10
											},
											name : 'os',
											options : [OPTION({
												c : '전체'
											}), OPTION({
												value : 'android',
												c : 'Android'
											}), OPTION({
												value : 'ios',
												c : 'iOS'
											})]
										}),
										
										UUI.FULL_INPUT({
											style : {
												marginTop : 5
											},
											name : 'language',
											placeholder : '언어 (예: ko-KR, 입력하지 않으면 전체)'
										}),
										
										UUI.FULL_TEXTAREA({
											style : {
												marginTop : 5
											},
											name : 'message',
											placeholder : '메시지'
										}),
										
										UUI.FULL_SUBMIT({
											style : {
												marginTop : 5
											}
										})],
										on : {
											submit : () => {
												
												let data = form.getData();
												
												adminRoom.send({
													methodName : 'sendPushMessage',
													data : data
												});
												
												modal.close();
											}
										}
									})]
								});
							}
						}
					}),
					
					CLEAR_BOTH()]
				}).appendTo(BODY);
			}
		});
		
		inner.on('close', () => {
			adminRoom.exit();
			if (wrapper !== undefined) {
				wrapper.remove();
			}
			if (footer !== undefined) {
				footer.remove();
			}
		});
	}
});
