export default async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message({ userid: ctx.from.id }),
    {
      parse_mode: 'HTML',
    }
  );

}
