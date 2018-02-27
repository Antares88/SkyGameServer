require(process.env['UPPERCASE_PATH'] + '/UPPERCASE-CORE/NODE.js');

CPU_CLUSTERING(() => {
	
	const PORT = 8919;
	
	let sharedWaiterStore = SHARED_STORE('sharedWaiterStore');
	
	let server = require('dgram').createSocket('udp4');
	
	server.on('message', (message, info) => {
		
		let content = message.toString();
		
		let ip = info.address;
		let port = info.port;
		
		let send = (data, ip, port) => {
			
			if (data !== undefined) {
			
				let message = new Buffer(CHECK_IS_DATA(data) === true ? STRINGIFY(data) : '' + data);
				
				if (port > 0 && port < 65536) {
					server.send(message, 0, message.length, port, ip);
				}
			}
		};
		
		let response = (data) => {
			
			if (data !== undefined) {
			
				let message = new Buffer(CHECK_IS_DATA(data) === true ? STRINGIFY(data) : '' + data);
				
				server.send(message, 0, message.length, port, ip);
			}
		};
		
		let index;
		let data;
		
		while ((index = content.indexOf('\r\n')) !== -1) {

			data = PARSE_STR(content.substring(0, index));
			
			if (data !== undefined) {
				break;
			}

			content = content.substring(index + 1);
		}
		
		if (data !== undefined) {
				
			let waiterId = 'waiter-' + data.version + '-' + (data.roomId === undefined ? data.difficulty : data.roomId);
			
			// order
			if (data.methodName === 'order') {
				
				data.enemyIP = ip;
				data.enemyPort = port;
				
				send(data, data.ip, data.port);
			}
			
			// check player waiting
			else if (data.methodName === 'checkPlayerWaiting') {
				
				sharedWaiterStore.checkExists(waiterId, (exists) => {
					response(exists);
				});
			}
			
			// for find player
			else if (data.methodName === 'findPlayer') {
				
				sharedWaiterStore.get(waiterId, {
					
					notExists : () => {
						
						// wait.
						response('waiting');
						
						sharedWaiterStore.save({
							id : waiterId,
							data : {
								ip : ip,
								port : port,
								localIP : data.localIP,
								localPort : data.localPort
							},
							removeAfterSeconds : 3
						});
					},
					
					success : (waiterInfo) => {
						
						// if waiter
						if (waiterInfo.ip === ip && waiterInfo.port === port && waiterInfo.localIP === data.localIP && waiterInfo.localPort === data.localPort) {
							response('waiting');
						}
						
						// match.
						else {
							
							send('knock', waiterInfo.ip, waiterInfo.port);
							
							response(waiterInfo);
							
							sharedWaiterStore.remove(waiterId, {
								notExists : () => {
									// ignore.
								}
							});
						}
					}
				});
			}
			
			// leave player
			else if (data.methodName === 'leavePlayer') {
				sharedWaiterStore.remove(waiterId, {
					notExists : () => {
						// ignore.
					}
				});
			}
		}
	});
	
	server.on('listening', () => {
		console.log('RUNNING P2P SERVER... (PORT:' + PORT + ')');
	});
	
	server.bind(PORT);
});
