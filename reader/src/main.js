import Epub from 'epubjs'
import './style.css'
import { renderToc } from './src/toc'
import { md5sum } from './src/md5'

/**
 * @type {import('epubjs/types/rendition').default}
 */
let rendition

/**
 * @type {File}
 */
let file

/**
 * @type {import('epubjs/types/book').default}
 */
let book

document.getElementById('choose').addEventListener('change', async (e) => {
  closeBook()

  file = e.target.files[0]

  book = Epub(file)
  rendition = book.renderTo("area", {
    flow: "paginated",
    height: document.getElementById('area').offsetHeight,
    width: document.getElementById('area').offsetWidth,
  })

  const location = localStorage.getItem(await md5sum(file))

  try {
    await rendition.display(location)
  } catch {
    await rendition.display()
  }

  updateToc()

  rendition.hooks.render.register(() => {
    document.querySelector('iframe').contentDocument.addEventListener('wheel', async e => {
      if (e.deltaY > 0) {
        await rendition.next()
      } else {
        await rendition.prev()
      }

      updateToc()
    })
  })

  document.querySelector('iframe').contentDocument.addEventListener('wheel', async e => {
    if (e.deltaY > 0) {
      await rendition.next()
    } else {
      await rendition.prev()
    }

    updateToc()
  })

  await book.ready

  const toc = document.getElementById('toc')
  console.log(book.navigation.toc)
  renderToc(book.navigation.toc, toc)
})

document.getElementById('toc').addEventListener('click', async (e) => {
  if (e.target.classList.contains('nav_a')) {
    e.preventDefault()
    await rendition.display(e.target.dataset.toc)
    updateToc()
  }
})

window.addEventListener('beforeunload', (event) => {
  mark()
})

async function mark() {
  try {
    const cfi = rendition.currentLocation().start.cfi
    localStorage.setItem(await md5sum(file), cfi)
  } catch { }
}

async function updateToc() {
  const currentCfi = rendition.currentLocation().end.cfi
  const currentNode = rendition.getRange(currentCfi).startContainer.parentNode
  const rootNode = rendition.getRange(currentCfi).startContainer.ownerDocument.body
  const nodes = []

  walk(rootNode, node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      nodes.push(node)
    }
  })

  const toc = document.getElementById('toc')
  const navs = Array.from(toc.querySelectorAll('.nav_a'))

  // 先按id查找
  for (let i = nodes.indexOf(currentNode); i > -1; i--) {
    if (nodes[i].hasAttribute('id')) {
      const currentNav = navs.find(n => n.dataset.toc.includes(nodes[i].getAttribute('id')))
      if (currentNav) {
        navs.forEach(n => n.classList.remove('toc_active'))
        currentNav.classList.add('toc_active')
        currentNav.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }
  }

  // 如果没有id，则按文档名查找
  const docName = rendition.getRange(currentCfi).startContainer.ownerDocument.baseURI.split('/').pop()
  if (docName) {
    const currentNav = navs.find(n => n.dataset.toc.includes(docName))
    if (currentNav) {
      navs.forEach(n => n.classList.remove('toc_active'))
      currentNav.classList.add('toc_active')
      currentNav.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
  }
}

function walk(node, callback) {
  callback(node)
  for (let i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback)
  }
}

function closeBook() {
  if (file) {
    mark()
  }
  rendition?.destroy()
  file = null
  book = null
  rendition = null
  document.getElementById('area').innerHTML = ''
  document.getElementById('toc').innerHTML = ''
}