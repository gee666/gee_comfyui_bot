export const message_no_workflows = (variables = {}) => {
  return `
  4️⃣0️⃣4️⃣

  Sorry, but there are no workflows available for playing at the moment.
  Tell my creator about it!
 `;
};


export const message = (variables = {}) => {
  return `
  Choose a workflow:

${variables.workflows}
 `;
};

export const message_examples = (variables = {}) => {
  return `
  My examples made with this workflow:
  `;
}
