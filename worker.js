var apiPort;
function postAPIMessage(topic, data) {
  try {
    apiPort.postMessage({topic: topic, data: data});
  } catch (ex) {
    log("failed to post api message: " + ex);
  }
}

onconnect = function(e) {
  var port = e.ports[0];
  port.onmessage = function(e) {
    var msg = e.data;
    if (msg.topic == "social.port-closing") {
      if (port == apiPort) {
        apiPort.close();
        apiPort = null;
      }
      return;
    }
    if (msg.topic == "social.initialize") {
      apiPort = port;
    }
    if (msg.topic == "yam.currentUser") {
      // bounce the user data into the socialAPI
      postAPIMessage('social.user-profile',
		     {
		      portrait: msg.data.mugshot_url,
		      userName: msg.data.name,
		      displayName: msg.data.full_name,
		      profileURL: msg.data.web_url
		     });
      if (msg.data.name) {
        initializeAmbientNotifications();
      }
    }

  }
}

function initializeAmbientNotifications() {

	postAPIMessage('social.ambient-notification-update',
		{
		  name: "private-msg",
		  counter: 2,
		  iconURL: 'yammer-dm.png',
		  contentPanel: "/private_msg.htm"
	 });


	postAPIMessage('social.ambient-notification-update',
		{
		  name: "network-update",
		  counter: 1,
		  background: 'yammer-net.png', 
		  contentPanel: "/network_update.htm"
	 });

}
