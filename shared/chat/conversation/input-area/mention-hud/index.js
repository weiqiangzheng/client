// @flow
import * as React from 'react'
import {List} from '../../../../common-adapters/index'
import {type StylesCrossPlatform} from '../../../../styles'

type Props<RowProps> = {|
  // Assumed to be constant.
  rowPropsList: Array<RowProps>,
  rowFilterer: (rowProps: RowProps, filter: string) => boolean,

  rowRenderer: (index: number, selected: boolean, rowProps: RowProps) => React.Node,

  filter: string,
  selectedIndex: number,
  selectVisibleUpToggle: boolean,
  selectVisibleDownToggle: boolean,

  style?: StylesCrossPlatform,

  debugLog?: string => void,
|}

type State<RowProps> = {|
  // True only in the constructor.
  initial: boolean,

  // Mirrored from props.
  filter: string,
  selectedIndex: number,
  selectVisibleUpToggle: boolean,
  selectVisibleDownToggle: boolean,

  // Derived state.
  visibleList: Array<RowProps>,
  indexToVisibleIndex: Array<number>,
  visibleIndexToIndex: Array<number>,
  selectedVisibleIndex: number,
|}

class MentionHud<RowProps> extends React.Component<Props<RowProps>, State<RowProps>> {
  constructor(props: Props<RowProps>) {
    super(props)
    this.state = {
      initial: true,
      filter: '',
      selectedIndex: 0,
      selectVisibleUpToggle: false,
      selectVisibleDownToggle: false,

      visibleList: [],
      indexToVisibleIndex: [],
      visibleIndexToIndex: [],
      selectedVisibleIndex: 0,
    }
  }

  static getDerivedStateFromProps = (
    nextProps: Props<RowProps>,
    prevState: State<RowProps>
  ): null | State<RowProps> => {
    let {visibleList, indexToVisibleIndex, visibleIndexToIndex, selectedVisibleIndex} = prevState
    const {
      rowPropsList,
      filter,
      selectedIndex,
      selectVisibleUpToggle,
      selectVisibleDownToggle,
      debugLog,
    } = nextProps
    if (prevState.initial || filter !== prevState.filter) {
      visibleList = []
      indexToVisibleIndex = []
      visibleIndexToIndex = []
      for (let i = 0; i < rowPropsList.length; i++) {
        const rowProps = rowPropsList[i]
        const show = nextProps.rowFilterer(rowProps, filter)
        if (show) {
          visibleList.push(rowProps)
          visibleIndexToIndex.push(i)
        }
        indexToVisibleIndex.push(Math.max(0, visibleList.length - 1))
      }
      selectedVisibleIndex = indexToVisibleIndex[selectedIndex]
      if (debugLog) {
        const reason = prevState.initial
          ? 'initial'
          : `filter changed from "${prevState.filter}" to "${filter}"`
        const dump = {
          visibleList,
          indexToVisibleIndex,
          visibleIndexToIndex,
          selectedVisibleIndex,
        }
        debugLog(`${reason}: ${JSON.stringify(dump)}`)
      }
    } else if (selectedIndex !== prevState.selectedIndex) {
      selectedVisibleIndex = indexToVisibleIndex[selectedIndex]
      if (debugLog) {
        debugLog(
          `selected index changed from ${
            prevState.selectedIndex
          } to ${selectedIndex}: visible index is now ${selectedVisibleIndex}`
        )
      }
    } else if (selectVisibleUpToggle !== prevState.selectVisibleUpToggle && visibleList.length > 0) {
      selectedVisibleIndex = (selectedVisibleIndex + (visibleList.length - 1)) % visibleList.length
      if (debugLog) {
        debugLog(`select visible up toggled: visible index is now ${selectedVisibleIndex}`)
      }
    } else if (selectVisibleDownToggle !== prevState.selectVisibleDownToggle && visibleList.length > 0) {
      selectedVisibleIndex = (selectedVisibleIndex + 1) % visibleList.length
      if (debugLog) {
        debugLog(`select visible down toggled: visible index is now ${selectedVisibleIndex}`)
      }
    } else {
      // Nothing changed.
      return null
    }

    return {
      initial: false,
      filter,
      selectedIndex,
      selectVisibleUpToggle,
      selectVisibleDownToggle,

      visibleList,
      indexToVisibleIndex,
      visibleIndexToIndex,
      selectedVisibleIndex,
    }
  }

  render = () => {
    const {visibleList, visibleIndexToIndex, selectedVisibleIndex} = this.state

    return (
      <List
        items={visibleList}
        renderItem={(visibleIndex: number, rowProps: RowProps) => {
          const index = visibleIndexToIndex[visibleIndex]
          return this.props.rowRenderer(index, visibleIndex === selectedVisibleIndex, rowProps)
        }}
        selectedIndex={selectedVisibleIndex}
        fixedHeight={40}
        keyboardShouldPersistTaps="always"
        style={this.props.style}
      />
    )
  }
}

export default MentionHud
