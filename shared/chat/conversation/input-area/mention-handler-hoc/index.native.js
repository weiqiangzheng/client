// @flow
import * as React from 'react'
import {type Props} from '../normal'
import {type PropsFromContainer} from '.'
import {Input} from '../../../../common-adapters'

type MentionHocState = {
  pickSelectedCounter: number,
  mentionFilter: string,
  channelMentionFilter: string,
  mentionPopupOpen: boolean,
  channelMentionPopupOpen: boolean,

  // Mobile only.
  _selection: {selectionStart: number, selectionEnd: number},
}

const mentionHoc = (InputComponent: React.ComponentType<Props>) => {
  class MentionHoc extends React.Component<PropsFromContainer, MentionHocState> {
    state: MentionHocState
    _inputRef: ?Input

    constructor(props: PropsFromContainer) {
      super(props)
      this.state = {
        pickSelectedCounter: 0,
        mentionFilter: '',
        channelMentionFilter: '',
        mentionPopupOpen: false,
        channelMentionPopupOpen: false,

        // Mobile only.
        _selection: {selectionStart: 0, selectionEnd: 0},
      }
    }

    inputSetRef = (input: Input) => {
      this.props._inputSetRef(input)
      this._inputRef = input
    }

    _setMentionPopupOpen = (mentionPopupOpen: boolean) => {
      this.setState({mentionPopupOpen})
    }

    _setChannelMentionPopupOpen = (channelMentionPopupOpen: boolean) => {
      this.setState({channelMentionPopupOpen})
    }

    _setMentionFilter = (mentionFilter: string) => {
      this.setState({mentionFilter})
    }

    _setChannelMentionFilter = (channelMentionFilter: string) => {
      this.setState({channelMentionFilter})
    }

    _triggerPickSelectedCounter = () => {
      this.setState(({pickSelectedCounter}) => ({pickSelectedCounter: pickSelectedCounter + 1}))
    }

    // TODO: Needed?
    onEnterKeyDown = (e: SyntheticKeyboardEvent<>) => {
      e.preventDefault()
      if (this.state.mentionPopupOpen || this.state.channelMentionPopupOpen) {
        this._triggerPickSelectedCounter()
      }
    }

    _isPopupOpen = () => this.state.mentionPopupOpen || this.state.channelMentionPopupOpen

    _getWordAtCursor = (text: string) => {
      const {selectionStart} = this.state._selection
      const upToCursor = text.substring(0, selectionStart)
      const words = upToCursor.split(/ |\n/)
      return words[words.length - 1]
    }

    onChangeText = (nextText: string) => {
      this.props.setText(nextText)
      const word = this._getWordAtCursor(nextText)
      const selection = this.state._selection
      if (!this._isPopupOpen() && selection.selectionStart === selection.selectionEnd) {
        if (word[0] === '@') {
          this._setMentionPopupOpen(true)
          this._setMentionFilter(word.substring(1))
        } else if (word[0] === '#') {
          this._setChannelMentionPopupOpen(true)
          this._setChannelMentionFilter(word.substring(1))
        }
      } else if (selection.selectionStart !== selection.selectionEnd) {
        this.state.mentionPopupOpen && this._setMentionPopupOpen(false) && this._setMentionFilter('')
        this.state.channelMentionPopupOpen &&
          this._setChannelMentionPopupOpen(false) &&
          this._setChannelMentionFilter('')
      } else {
        // Close popups if word doesn't begin with marker anymore
        if (this.state.mentionPopupOpen && word[0] !== '@') {
          this._setMentionFilter('')
          this._setMentionPopupOpen(false)
          return
        } else if (this.state.channelMentionPopupOpen && word[0] !== '#') {
          this._setChannelMentionFilter('')
          this._setChannelMentionPopupOpen(false)
          return
        }

        // we haven't exited a mention, set filters
        if (this.state.mentionPopupOpen) {
          this._setMentionFilter(word.substring(1))
        } else if (this.state.channelMentionPopupOpen) {
          this._setChannelMentionFilter(word.substring(1))
        }
      }
    }

    onBlur = () => {
      this.state.channelMentionPopupOpen && this._setChannelMentionPopupOpen(false)
      this.state.mentionPopupOpen && this._setMentionPopupOpen(false)
    }

    onFocus = () => {
      this.onChangeText(this.props.text)
    }

    insertMentionMarker = () => {
      this._replaceWordAtCursor('@')
      this._inputRef && this._inputRef.focus()
    }

    insertMention = (u: string) => {
      this._replaceWordAtCursor(`@${u} `)
    }

    insertChannelMention = (c: string) => {
      this._replaceWordAtCursor(`#${c} `)
    }

    _replaceWordAtCursor = (newWord: string) => {
      const selections = this.state._selection
      const word = this._getWordAtCursor(this.props.text)

      if (selections && selections.selectionStart === selections.selectionEnd) {
        const startOfWordIdx = selections.selectionStart - word.length
        if (startOfWordIdx >= 0) {
          // Put the cursor at the end of newWord.
          // NOTE: This doesn't work yet; see comments in input.native.js.
          const newSelectionIndex = startOfWordIdx + newWord.length
          this._inputRef &&
            this._inputRef.replaceText(
              newWord,
              startOfWordIdx,
              selections.selectionStart,
              newSelectionIndex,
              newSelectionIndex
            )
        }
      }
    }

    onSelectionChange = (selection: {selectionStart: number, selectionEnd: number}) =>
      this.setState(
        {
          _selection: selection,
        },
        () => this.onChangeText(this.props.text)
      )

    render = () => (
      <InputComponent
        {...this.props}
        {...this.state}
        insertChannelMention={this.insertChannelMention}
        insertMention={this.insertMention}
        setMentionPopupOpen={this._setMentionPopupOpen}
        setChannelMentionPopupOpen={this._setChannelMentionPopupOpen}
        inputSetRef={this.inputSetRef}
        insertMentionMarker={this.insertMentionMarker}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onEnterKeyDown={this.onEnterKeyDown}
        onChangeText={this.onChangeText}
        onSelectionChange={this.onSelectionChange}
      />
    )
  }

  return MentionHoc
}

export default mentionHoc
