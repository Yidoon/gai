const ai = require("./openai");

const DefaultFormat = "feat/xxxx-xxx-xxx-dyd";
module.exports = async function (params) {
  const { desc, format } = params;
  const _format = format || DefaultFormat;
  // const prompt = `帮我给分支取一个名字，描述是：${desc}，格式是：${format}，`;
  const prompt = `Please give me a branch name, the description is: ${desc}, the format is: ${_format}, no more than 30 characters`;
  console.log(prompt)
  const res = await ai(desc);
  console.log(res);
  return res;
};
