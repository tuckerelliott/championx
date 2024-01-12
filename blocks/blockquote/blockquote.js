export default function decorate(block) {
  const quoteDiv = block.querySelector('div:last-of-type');
  const blockquote = document.createElement('blockquote');
  blockquote.innerHTML = `<strong>${quoteDiv.innerHTML}</strong>`;
  quoteDiv.replaceWith(blockquote);


}
