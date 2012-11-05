var apiPort;
function postAPIMessage(topic, data) {
  try {
    apiPort.postMessage({topic: topic, data: data});
  } catch (ex) {
    log("failed to post api message: " + ex);
  }
}

onconnect = function(e) {
  dump("yammerer port onconnect\n");
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
      //dump("got a user "+JSON.stringify(msg)+"\n");
      if (msg.data) {
	postAPIMessage('social.user-profile',
		     {
		      portrait: msg.data.mugshot_url,
		      userName: msg.data.name,
		      displayName: msg.data.full_name,
		      profileURL: msg.data.web_url
		     });
      } else {
	postAPIMessage('social.user-profile')
      }
    }
    if (msg.topic == "yam.currentNetwork") {
      postAPIMessage('social.ambient-notification', {
	name: "private_unseen_message_count",
	counter: msg.data.private_unseen_message_count,
	iconURL: location.protocol+"//"+location.host+'/yammer-dm.png',
	contentPanel: location.protocol+"//"+location.host+"/private_msg.htm"
      });
      postAPIMessage('social.ambient-notification', {
	name: "unseen_notification_count",
	counter: msg.data.unseen_notification_count,
	iconURL: location.protocol+"//"+location.host+'/yammer-dm.png',
	contentPanel: location.protocol+"//"+location.host+"/notifications.htm"
      });

    }
  }
}

