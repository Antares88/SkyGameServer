SkyGameServer.MAIN = METHOD({

	run : () => {
		
		SkyGameServer.MATCH_VIEW({
			uri : '__ADMIN',
			target : SkyGameServer.Admin
		});
	}
});
