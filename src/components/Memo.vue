<template>
  <div class="column is-4" tabindex="0" @keyup.enter="openEdit" @keyup.esc="closeEdit" @keyup.delete="deleteMemo">
    <a v-if="!isEditing" @click="openEdit" class="box">
        <span @click.stop="deleteMemo" class="delete is-pulled-right"></span>
        <div v-html='memoHtml' style="word-break: break-all;"></div>
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
        <div @click="speech" class="card-footer-item" :class="{ 'has-background-danger': isRecording }">
          <i class="fas fa-microphone"></i>
        </div>
        <a @click="closeEdit" class="card-footer-item">Cancel</a>
      </footer>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import { setTimeout } from 'timers'

export default {
  name: 'Memo',
  props: ['id', 'memo', 'created', 'uid', 'collection', 'SpeechToText'],
  data () {
    return {
      isEditing: false,
      draft: this.memo,
      isRecording: false,
      listener: null
    }
  },
  computed: {
    memoHtml () {
      const memoBreak = this.memo.replace(/\r?\n/g, '<br>')
      const memoAnchor = memoBreak.replace(
        /((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi,
        "<a class='stop' target='_blank' href='$1' style='z-index:99999'>$1</a>"
      )
      return memoAnchor
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
      this.collection.doc(this.id)
        .set({
          uid: this.uid,
          memo: this.draft,
          created: moment().format('YYYY/MM/DD HH:mm:ss')
        })
        .then(() => {
          this.closeEdit()
        })
    },
    deleteMemo () {
      if (this.isEditing) return
      this.collection.doc(this.id).delete()
    },
    speech () {
      if (this.isRecording) {
        if (this.listener !== null) {
          this.listener.stopListening()
        }
        this.isRecording = false
        return
      }

      this.isRecording = true

      if (!('webkitSpeechRecognition' in window)) {
        alert('Your brouser doesn\'t support speech recognitin. Please Try Google Chrome browser.')
        this.isRecording = false
        return
      }

      const originalDraft = this.draft

      const onSpeechFinished = (text) => {
        this.memo = (originalDraft + '\n' + text).trim()
        this.isRecording = false
        this.listener.stopListening()
      }

      const onSpeechDetected = (text) => {
        this.draft = (originalDraft + '\n' + text).trim()
      }

      try {
        this.listener = new this.SpeechToText(onSpeechFinished, onSpeechDetected, 'ja')
        this.listener.startListening()
      } catch (error) {
        alert(error)
      }
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
