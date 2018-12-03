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
          <textarea v-model="draft" @keyup.enter.ctrl="editMemo" class="textarea" placeholder="Write your memo!"></textarea>
          <small v-if="!isMobile()" class="is-pulled-right has-text-grey-light">ctrl + Enter to save</small>
        </div>
      </div>
      <footer class="card-footer">
        <a @click="editMemo" class="card-footer-item">Save</a>
        <div @click="speech" class="card-footer-item" :class="{ 'has-background-danger': isRecording }" style="cursor: pointer">
          <i class="fas fa-microphone"></i>
        </div>
        <a @click="closeEdit" class="card-footer-item">Cancel</a>
      </footer>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import isMobile from 'ismobilejs'
import { setTimeout } from 'timers'

function modifySpeechText (text) {
  text = text.replace(/(改行|ブレイク|ブレーク|break )/g, '\n')
  text = text.replace(/(空白|スペース|space )/g, ' ')
  text = text.replace(/(シャープ|タグ|sharp |tag )/g, '#')
  text = text.replace(/([^ \n])#/gi, '$1 #')
  return text
}

export default {
  name: 'Memo',
  props: ['id', 'memo', 'created', 'collection', 'SpeechToText', 'speechLang'],
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
      const memoTag = this.memo
        .replace(
          /(#[^ \n]+\n)/gi,
          "<a class='stop tag is-primary' style='z-index:99999'>$1</a><br/>"
        )
        .replace(
          /(#[^ \n]+ )/gi,
          "<a class='stop tag is-primary' style='z-index:99999'>$1</a>&nbsp"
        )
        .replace(
          /(#[^ \n]+$)/gi,
          "<a class='stop tag is-primary' style='z-index:99999'>$1</a>"
        )
      const memoAnchor = memoTag
        .replace(
          /((http:|https:)\/\/[^ \n$]+)( |\n|$)/gi,
          "<a class='stop' target='_blank' href='$1' style='z-index:99999'>$1</a>$3"
        )
      const memoBreak = memoAnchor.replace(/\r?\n/g, '<br>')
      return memoBreak
    }
  },
  methods: {
    openEdit () {
      this.isEditing = true
      setTimeout(() => {
        this.$el.querySelector('textarea').focus()
      }, 1)
    },
    closeEdit () {
      this.isEditing = false
      this.stopSpeech()
      setTimeout(() => {
        this.$el.focus()
        this.applyEvents()
      }, 10)
    },
    editMemo () {
      this.stopSpeech()
      this.collection.doc(this.id)
        .set({
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
    stopSpeech () {
      if (this.isRecording) {
        if (this.listener !== null) {
          this.listener.stopListening()
        }
        this.isRecording = false
        return true
      }
      return false
    },
    speech () {
      if (this.stopSpeech()) return

      this.isRecording = true

      if (!('webkitSpeechRecognition' in window)) {
        alert('Your brouser doesn\'t support speech recognitin. Please Try Google Chrome browser.')
        this.isRecording = false
        return
      }

      const originalDraft = this.draft

      const onSpeechFinished = (text) => {
        if (!this.isRecording) return
        this.listener.stopListening()
        this.isRecording = false
        const modifiedText = modifySpeechText(text)
        this.draft = (originalDraft + '\n' + modifiedText).trim()
      }

      const onSpeechDetected = (text) => {
        if (!this.isRecording) return
        const modifiedText = modifySpeechText(text)
        this.draft = (originalDraft + '\n' + modifiedText).trim()
      }

      try {
        this.listener = new this.SpeechToText(onSpeechFinished, onSpeechDetected, this.speechLang)
        this.listener.startListening()
      } catch (error) {
        alert(error)
      }
    },
    applyEvents () {
      this.$el.querySelectorAll('.stop').forEach(dom => dom.addEventListener('click', ev => {
        ev.stopPropagation()
      }))

      this.$el.querySelectorAll('.tag').forEach(dom => dom.addEventListener('click', ev => {
        this.$emit('search-tag', ev.target.text)
      }))
    },
    isMobile () {
      return isMobile.any
    }
  },
  mounted () {
    this.applyEvents()
  }
}
</script>
