// how to connect to openAI to get prompts from it and
// actually provide intelligent answers based on what
//you type
import bot from "./assets/bog.svg";
import user from "./assets/user.svg";

// we are not working with React this time so we
// have to target out HTML elements manually by
// using document.Queryselector

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if(element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)

}

function typeText(element, text){
  let index=0;
  let interval = setInterval(() =>{
    if (index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId(){
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;

}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && ai}">
      <div class="chat">
        <div class="profile">
          <img
             src="${isAi ? bot : user}"
             alt=${isAi ? 'bot' : 'user'}
             />
        </div>
        <div class="message" id=${uniqueId}> ${value} </div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault(); // prevent default behavior of web page

  const data = new FormData(form);

  // user's chatStripe

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot's chatStripe

  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  // while user typing make page scroll down

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  // then load messageDiv

  loader(messageDiv);

// .. here we can fetch data from server -> bot's response

const response = await fetch('http://localhost:5500', {
  method:'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  bnody: JSON.stringify({
    prompt: data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = '';

if(response.ok) {
  const data = await response.json();
  const parseData = data.bot.trim();

  console.log({parseData});
  typeText(messageDiv, parseData);
} else {
  const err = await response.text();
  messageDiv.innerHTML = "Something was wrong ...";
  alert(err);
}


}

// to able to see change we can hold
// the load message
// raise submit event with the invoking function handle submit
//

form.addEventListener('submit', handleSubmit);
// to hanlde enter key

form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})




