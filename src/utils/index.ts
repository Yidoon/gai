/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 */
export function copyToClipboard(text: string) {
  // 创建一个临时输入框来选择文本
  const tempInput: any = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = text;
  document.body.appendChild(tempInput);

  // 选择输入框中的内容
  tempInput.select();
  // 执行复制命令
  document.execCommand("copy");
  // 摧毁输入框
  document.body.removeChild(tempInput);
}
