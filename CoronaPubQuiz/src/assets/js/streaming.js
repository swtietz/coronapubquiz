function setupStreams(firebase, quiz, group, user, isModerator, videoElement, audioParent) {
  if(isModerator) {
    user = "moderator";
  }
  console.log(firebase);
  //var database = firebase.database().ref();
  var database = firebase.database.app.firebase_.database().ref();
  var pubsubQuiz = database.child('quizzes/' + quiz);
  var pubsubGroup = database.child('groups/' + group);
  var mediaStream = null;
  var pcs = {};
  var mediaObjects = {};

  /*var servers = {
      'iceServers': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.google.com:19302'}]};*/

  var servers = {
    'iceServers': [
      {'urls': 'stun:34.89.152.107'},
      {'urls': 'turn:34.89.152.107','credential': 'wirvsvirus','username': 'wirvsvirus'}
    ]
  };
  
  function create_peer_connection(receiver, mediaObject) {
    var pc = new RTCPeerConnection(servers);
    pc.oniceconnectionstatechange = function(event) {
      if (pc.iceConnectionState === "failed" ||
          pc.iceConnectionState === "disconnected" ||
          pc.iceConnectionState === "closed") {
        console.log(receiver + " disconnected");

        delete pcs[receiver];

        if(receiver == "moderator") {
          videoElement.srcObject = undefined;
        } else if(mediaObjects[receiver]) {
          mediaObjects[receiver].remove();
          delete mediaObjects[receiver];
        }
      }
    };
    pc.onicecandidate = function(event) {
      if(event.candidate) {
        sendMessage(user, receiver, JSON.stringify({'ice': event.candidate}))
      } else {
        //console.log("sent all ice messages")
      }
    };
    if(!isModerator) {
      pc.onaddstream = function(event) {
        mediaObject.srcObject = event.stream;
        mediaObject.play();
      }
    }
    return pc;
  }

  function create_audio_element() {
    var audio = document.createElement("audio");
    audio.setAttribute('autoplay', "");
    audio.setAttribute('playsinline', "");
    audioParent.appendChild(audio);
    return audio;
  }

  function sendMessage(sender, receiver, data) {
    var msg = pubsubQuiz.push({ sender: sender, receiver: receiver, message: data });
    msg.remove();
  }

  function readMessage(data) {
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    var receiver = data.val().receiver;

    if (sender != user && ((isModerator && receiver == "moderator") || receiver == user || receiver == "all")) {
        if (isModerator && msg.request_video) {
          pcs[sender] = create_peer_connection(sender);
          pcs[sender].addStream(mediaStream);
          pcs[sender].createOffer()
            .then(offer => pcs[sender].setLocalDescription(offer) )
            .then(() => sendMessage(user, sender, JSON.stringify({'sdp': pcs[sender].localDescription})));
        } else if (msg.request_audio) {
          mediaObjects[sender] = create_audio_element();

          pcs[sender] = create_peer_connection(sender, mediaObjects[sender]);
          pcs[sender].addStream(mediaStream);
          pcs[sender].createOffer()
            .then(offer => pcs[sender].setLocalDescription(offer) )
            .then(() => sendMessage(user, sender, JSON.stringify({'sdp': pcs[sender].localDescription})));
        } else if (msg.new_moderator) {
          pcs["moderator"].close();
          pcs["moderator"] = create_peer_connection("moderator", videoElement);
          sendMessage(user, "moderator", JSON.stringify({request_video: true}));
        } else if (msg.ice != undefined) {
          pcs[sender].addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp != undefined) {
          if(msg.sdp.type == "offer") {
            pcs[sender].setRemoteDescription(new RTCSessionDescription(msg.sdp))
                .then(() => pcs[sender].createAnswer())
                .then(answer => pcs[sender].setLocalDescription(answer))
                .then(() => sendMessage(user, sender, JSON.stringify({'sdp': pcs[sender].localDescription})));
          } else if (msg.sdp.type == "answer") {
            pcs[sender].setRemoteDescription(new RTCSessionDescription(msg.sdp));
          }
        } else {
          console.error("unhandled pubsub message");
        }
    }
  };

  pubsubQuiz.on('child_added', readMessage);

  if(isModerator) {
    // moderator

    console.log("moderator");

    videoElement.muted = true;

    navigator.mediaDevices.getUserMedia({audio:true, video:true})
      .then(stream => videoElement.srcObject = stream) // show self
      .then(stream => mediaStream = stream); // save stream object for peer connections

    sendMessage("moderator", "all", JSON.stringify({new_moderator: true}));
  } else {
    // guest

    console.log("guest");

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => mediaStream = stream); // save stream object for peer connections

    pcs["moderator"] = create_peer_connection("moderator", videoElement);
    sendMessage(user, "moderator", JSON.stringify({request_video: true}));

    var msg = pubsubGroup.push({ "user": user });
    msg.remove();

    pubsubGroup.on('child_added', function(data) {
      var receiver = data.val().user;

      mediaObjects[receiver] = create_audio_element();

      pcs[receiver] = create_peer_connection(receiver, mediaObjects[receiver]);
      pcs[receiver].addStream(mediaStream);

      setTimeout(function() {
        if(pcs[receiver] && pcs[receiver].iceConnectionState == "new") {
          delete pcs[receiver];

          if(mediaObjects[receiver]) {
            mediaObjects[receiver].remove();
            delete mediaObjects[receiver];
          }
        }
      }, 10000);

      sendMessage(user, receiver, JSON.stringify({request_audio: true}));
    });
  }

}
