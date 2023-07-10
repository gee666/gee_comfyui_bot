const emoji = {
  numbers: '0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣'.split(' '),
  hearts: '💔 🧡 ❤️ 💛 💚 💙 💜 🖤 🤍 🤎'.split(' '),
  stars: '⛎ ♈️ ♉️ ♊️ ♋️ ♌️ ♍️ ♎️ ♏️ ♐️ ♑️ ♒️ ♓️'.split(' '),
  moon: '🌝 🌚 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔'.split(' '),
  wheather: '☀️ 🌤 ⛅️ 🌥 ☁️ 🌦 🌧 ⛈ 🌩 🌨'.split(' '),
  stationery: '🧷 🔗 📎 🖇 📐 📏 📌 📍 ✂️ 🖊'.split(' '),
  face: '😂 🤣 🥲 😊 😇 🙃 😉 😍 😘 😎'.split(' '),
  animals: '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐻‍❄️ 🐨'.split(' '),
  balls: '⚽️ 🏀 🏈 ⚾️ 🥎 🎾 🏐 🏉 🥏 🎱'.split(' '),
};

export const get_random_emoji_type = () => {
  return Object.keys(emoji)[Math.floor(Math.random() * Object.keys(emoji).length)];
};

export const number_2_emoji = (number, type) => {
  let _emoji = emoji[type] || emoji['numbers'];

  return number.toString().split('').map((n) => _emoji[n]).join('');
};
