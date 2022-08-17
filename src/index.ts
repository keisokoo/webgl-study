console.log('hi')

function main() {
  let firstDom = document.createElement('div')
  firstDom.innerHTML = 'Hello World!'
  return firstDom
}
document.body.appendChild(main())
