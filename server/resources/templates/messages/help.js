export const message = (variables = {}) => {
  return `
Hi! I know it might be a bit confusing at first, so here are some tips.

<b>what is Workflow?</b>
<i>Workflow is a particular sequence of job, that Stable Diffusion will do for you. For example in the HighRes Fix workflow it takes your prompts, generates an image with tham, then upscapes this image, then reruns another layer of model sampler, which gives more fine details to the picture. I am planing to add more and more different workflows to this bot.</i>

<b>what is negative prompt?</b>
<i>Negative prompt describes what you don't want to see on the picture. Negatice prompt is much more important for Stable Diffusion than for, say, MidJourney, because SD actually generates a negative image, using this prompt, and then substracts this image from the actual image</i>

<b>Why my pictures look bad?</b>
<i>You may use a wrong model, try different ones. Also note that for each model you need slightly (or sometimes a lot) different prompting. Use more descriptive words like "8k, high resolution, soft professional light, sumer color pallette" etc. Go to https://lexica.art/ and look up the prompts people use there. Yes, it takes time. Use negative prompting.</i>

<b>Why stability AI models are so bad?</b>
<i>They are basic general universal models, more for teaching than for actual pictures generation. All these models in the list and many more are trained based on the 1.5 model for narrow specific purposes (like photorealism or anime etc). The base model 1.5 is universal and actually not so easy for pictures generation. Use fine-tunes models.</i>
`;
};


/*
commands

play - start generating pictures
rerun - run the last prompt again
start - start from the beginning
id - see your id
help - see this message
*/
