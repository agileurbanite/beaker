import yo from 'yo-yo'
import closeIcon from '../icon/close'

// globals
// =

let resolve
let reject

let title
let newTitle
let archive
let hasUnpublishedRevisions // TODO

// exported api
// =

export function create (opts = {}) {
  archive = opts.archive
  title = archive.info.title

  // render interface
  var popup = render()
  document.body.appendChild(popup)
  document.addEventListener('keyup', onKeyUp)
  archive.progress.addEventListener('changed', update)
  popup.querySelector('input').focus()

  // return promise
  return new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
}

export function destroy () {
  var popup = document.getElementById('library-deletedraft-popup')
  document.body.removeChild(popup)
  document.removeEventListener('keyup', onKeyUp)
  archive.progress.removeEventListener('changed', update)
  reject()
}

// rendering
// =

function update () {
  yo.update(document.getElementById('library-deletedraft-popup'), render())
}

function render () {
  return yo`
    <div id="library-deletedraft-popup" class="popup-wrapper" onclick=${onClickWrapper}>
      <form class="popup-inner" onsubmit=${onSubmit}>
        <div class="head">
          <span class="title">
            Delete this draft
          </span>

          <button title="Cancel" onclick=${destroy} class="close-btn square">
            ${closeIcon()}
          </button>
        </div>

        <div class="body">
          ${hasUnpublishedRevisions
            ? yo`
              <p>
                This draft has<strong> 3 unpublished revisions</strong>. Are you
                sure you want to delete it from Beaker?
              </p>`
            : yo`
              <p>
                This draft is up-to-date with ${title}. Delete this draft from Beaker.
              </p>`
          }

          <label for="deleteSyncPath" class="checkbox-container">
            <input type="checkbox" name="deleteSyncPath"/>
            Also delete the files at TODO localSyncPath
          </label>

          <div class="actions">
            <div class="left">
              This draft can be safely deleted
              <span class="fa fa-check"></span>
            </div>

            <button type="submit" class="btn ${hasUnpublishedRevisions ? 'warning' : ''}">
              Delete ${title}
            </button>
          </div>
        </div>
      </form>
    </div>
  `
}

// event handlers
// =

function onKeyUp (e) {
  e.preventDefault()
  e.stopPropagation()

  if (e.keyCode === 27) {
    destroy()
  }
}

/*
function onChange (e) {
  deleteSyncPath = e.target.value
  console.log(deleteSyncPath)
  console.log('checked', e.target.checked)
}
*/

function onClickWrapper (e) {
  if (e.target.id === 'library-deletedraft-popup') {
    destroy()
  }
}

function onSubmit (e) {
  e.preventDefault()
  resolve({deleteSyncPath: e.target.deleteSyncPath.checked})
  destroy()
}
