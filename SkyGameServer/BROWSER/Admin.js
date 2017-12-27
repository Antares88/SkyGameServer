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
								
								let message = prompt('메시지 내용을 입력해주세요.');
								
								if (message !== null && message !== '') {
									adminRoom.send({
										methodName : 'sendPushMessage',
										data : {
											message : message
										}
									});
								}
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
