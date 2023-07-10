export const message_no_models = (variables = {}) => {
  return `
  4️⃣0️⃣4️⃣

  Sorry, but there are no models available for playing at the moment.
  Tell my creator about it!
 `;
};


export const message = (variables = {}) => {
  return `
  Choose a model you want to play with:

${variables.models}
 `;
};
