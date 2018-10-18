<template>
  <div class="column is-4" tabindex="0" @keyup.enter="openEdit" @keyup.esc="closeEdit" @keyup.delete="deleteMemo">
    <a v-if="!isEditing" @click="openEdit" class="box">
        <span @click.stop="deleteMemo" class="delete is-pulled-right"></span>
        <div v-html='memoWithLink' style="word-break: break-all;"></div>
        <br><small class="has-text-grey">{{ created }}</small>
    </a>

    <div v-else class="card">
      <div class="card-content">
        <div class="content">
          <textarea v-model="draft" @keyup.enter.ctrl="editMemo" :id="'draft_' + id" class="textarea" placeholder="Write your memo!"></textarea>
          <small class="is-pulled-right has-text-grey-light">ctrl + Enter to save</small>
        </div>
      </div>
      <footer class="card-footer">
        <a @click="editMemo" class="card-footer-item">Save</a>
        <a @click="closeEdit" class="card-footer-item">Cancel</a>
      </footer>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import firebase from 'firebase'
import db from './firebaseInit'
import { setTimeout } from 'timers'
const collection = db.collection('memos')

export default {
  name: 'Memo',
  props: ['id', 'memo', 'created'],
  data () {
    return {
      isEditing: false,
      draft: this.memo
    }
  },
  computed: {
    memoWithLink () {
      return this.memo.replace(
        /((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi,
        "<a class='stop' target='_blank' href='$1' style='z-index:99999'>$1</a>"
      )
    }
  },
  methods: {
    stop () {
      console.log('stop')
    },
    openEdit () {
      this.isEditing = true
      setTimeout(() => {
        document.getElementById('draft_' + this.id).focus()
      }, 1)
    },
    closeEdit () {
      this.isEditing = false
    },
    editMemo () {
      collection.doc(this.id)
        .set({
          uid: firebase.auth().currentUser.uid,
          memo: this.draft,
          created: moment().format('YYYY/MM/DD HH:mm:ss')
        })
        .then(() => {
          this.toggleEdit()
        })
    },
    deleteMemo () {
      collection.doc(this.id).delete()
    }
  },
  mounted () {
    [].forEach.call(document.getElementsByClassName('stop'), dom => {
      dom.addEventListener('click', ev => {
        ev.stopPropagation()
      })
    })
  }
}
</script>
