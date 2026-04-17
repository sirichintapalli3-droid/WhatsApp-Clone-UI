let chats = {
  Rahul: { msgs: [], img: "https://i.pravatar.cc/40?img=1" },
  Priya: { msgs: [], img: "https://i.pravatar.cc/40?img=2" },
  Arjun: { msgs: [], img: "https://i.pravatar.cc/40?img=3" },
  Sara: { msgs: [], img: "https://i.pravatar.cc/40?img=4" },
  Thara: { msgs: [], img: "https://i.pravatar.cc/40?img=5" },
  Karan: { msgs: [], img: "https://i.pravatar.cc/40?img=6" },
  Moksha: { msgs: [], img: "https://i.pravatar.cc/40?img=7" },
  Ananya: { msgs: [], img: "https://i.pravatar.cc/40?img=8" },
  Rohan: { msgs: [], img: "https://i.pravatar.cc/40?img=9" },
  Aisha: { msgs: [], img: "https://i.pravatar.cc/40?img=10" }
};

let currentChat = "";
let unread = {};
let stream;

/* ================= CHAT LIST ================= */
function loadChats(){
  let chatList = document.getElementById("chatList");
  chatList.innerHTML = "";

  Object.keys(chats).forEach(name => {

    let lastMsg = "";
    let msgs = chats[name].msgs;

    if(msgs.length > 0){
      lastMsg = msgs[msgs.length - 1].text;

      // remove HTML tags for preview (images etc.)
      lastMsg = lastMsg.replace(/<[^>]*>/g, "");
    }

    let count = unread[name] || 0;

    let div = document.createElement("div");
    div.className = "chat-item";

    div.innerHTML = `
      <img src="${chats[name].img}" class="chat-pic">
      <div class="chat-info">
        <div class="chat-name">${name}</div>
        <div class="chat-last">${lastMsg}</div>
      </div>

      ${count > 0 ? `<span class="badge">${count}</span>` : ""}
    `;

    div.onclick = () => {
      currentChat = name;
      unread[name] = 0;

      document.getElementById("chatHeader").innerText = name;

      renderMessages();
      loadChats();
    };

    chatList.appendChild(div);
  });
}

/* ================= SELECT CHAT ================= */

function selectChat(name){
  currentChat = name;

  // 🔥 header update (IMPORTANT)
  document.getElementById("chatHeader").innerText = name;

  renderMessages();
}

/* ================= SEND MESSAGE ================= */
function sendMessage(){
  if(currentChat === "") return;

  let input = document.getElementById("messageInput");
  let text = input.value.trim();
  if(!text) return;

  let time = getTime();

  let msg = {
    type: "sent",
    text,
    time,
    status: "sent"
  };

  chats[currentChat].msgs.push(msg);

  input.value = "";
  renderMessages();

  // delivery + seen
  setTimeout(() => {
    msg.status = "delivered";
    renderMessages();
  }, 500);

  setTimeout(() => {
    msg.status = "seen";
    renderMessages();
  }, 1500);

  // AUTO REPLY
  setTimeout(() => {

    chats[currentChat].msgs.push({
      type: "received",
      text: getReply(text),
      time: getTime()
    });

    unread[currentChat] = (unread[currentChat] || 0) + 1;

    renderMessages();
    loadChats();

  }, 2000);
}

/* ================= RENDER ================= */
function renderMessages(){
  let box = document.getElementById("chatBox");
  box.innerHTML = "";

  if(currentChat === "") return;

  chats[currentChat].msgs.forEach(msg => {

    let tick = "";

    if(msg.type === "sent"){
      if(msg.status === "sent") tick = "✔";
      if(msg.status === "delivered") tick = "✔✔";
      if(msg.status === "seen") tick = `<span style="color:#4fc3f7">✔✔</span>`;
    }

    let div = document.createElement("div");
    div.className = "msg " + msg.type;

    div.innerHTML = `
      ${msg.text}
      <div class="meta">
        <span>${msg.time}</span>
        <span>${tick}</span>
      </div>
    `;

    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

/* ================= SMART REPLY ================= */
function getReply(msg){
  msg = msg.toLowerCase();

  if(msg.includes("hi") || msg.includes("hello")) return "Hello 👋";
  if(msg.includes("how are you")) return "Fine 👍 you?";
  if(msg.includes("tinnava")) return "Tinnanu 😋 nuvvu?";
  if(msg.includes("em chesthunav")) return "IPL chusthuna 😄";
  if (msg.includes("ohhh eh team niku fav")) return "MI niku😎";
  if(msg.includes("MI lo yavaru fav")) return "hardik pandya 😎";
  if (msg.includes("pandya naku kuda fav")) return "pandya bro best allrounder 😎";
  if(msg.includes("pandya bro best allrounder")) return "yes 😎";
  if(msg.includes("inkenti")) return "nuvve cheppali 😎";
  if (msg.includes("oka pata padu")) return "priyathama ni vachata kusalama nenu icchata kusalameee ";
  if(msg.includes("bye")) return "Bye 👋 take care!";
  if(msg.includes("em chesthunav")) return "Just chilling 😄";

  return random(["Okay 👍","Hmm 🤔","Nice 😎","Got it 😄"]);
}

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

/* ================= TIME ================= */
function getTime(){
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ================= PROFILE ================= */
function openProfile(){
  document.getElementById("profilePanel").style.right = "0";
}

function closeProfile(){
  document.getElementById("profilePanel").style.right = "-360px";
}

/* ================= SEARCH ================= */
function searchChats(){
  let input = document.getElementById("searchInput").value.toLowerCase();
  let items = document.getElementsByClassName("chat-item");

  for(let i=0;i<items.length;i++){
    let name = items[i].innerText.toLowerCase();
    items[i].style.display = name.includes(input) ? "flex" : "none";
  }
}

/* ================= VOICE ================= */
function startVoice(){
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    alert("Voice not supported");
    return;
  }

  let recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  document.getElementById("messageInput").placeholder = "🎤 Listening...";

  recognition.start();

  recognition.onresult = function(e){
    document.getElementById("messageInput").value =
      e.results[0][0].transcript;
  };

  recognition.onspeechend = function(){
    recognition.stop();
    document.getElementById("messageInput").placeholder = "Type message...";
  };
}

/* ================= DARK MODE ================= */
function toggleDark(){
  document.body.classList.toggle("dark");
}

/* ================= IMAGE UPLOAD ================= */
function sendImage(event){
  let file = event.target.files[0];
  if(!file || currentChat==="") return;

  let reader = new FileReader();

  reader.onload = function(){

    chats[currentChat].msgs.push({
      type: "sent",
      text: `<img src="${reader.result}" class="chat-img">`,
      time: getTime()
    });

    renderMessages();
  };

  reader.readAsDataURL(file);
}

/* ================= CAMERA ================= */
function openCamera(){
  let video = document.getElementById("video");
  document.getElementById("cameraBox").style.display = "block";

  navigator.mediaDevices.getUserMedia({ video:true })
  .then(s=>{
    stream = s;
    video.srcObject = stream;
  });
}

function capturePhoto(){
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video,0,0);

  let img = canvas.toDataURL("image/png");

  chats[currentChat].msgs.push({
    type:"sent",
    text:`<img src="${img}" class="chat-img">`,
    time:getTime()
  });

  renderMessages();
}

function closeCamera(){
  if(stream){
    stream.getTracks().forEach(t=>t.stop());
  }
  document.getElementById("cameraBox").style.display="none";
}

/* INIT */
loadChats();

