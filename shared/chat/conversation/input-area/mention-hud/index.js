// @flow
import * as React from 'react'
import {List} from '../../../../common-adapters/index'
import {type StylesCrossPlatform} from '../../../../styles'

type Props<RowProps> = {|
  rowPropsList: Array<RowProps>,

  // Assumed to be constant.
  rowFilterer: (rowProps: RowProps, filter: string) => boolean,

  rowRenderer: (index: number, selected: boolean, rowProps: RowProps) => React.Node,

  filter: string,
  selectedIndex: number,
  selectVisibleUpToggle: boolean,
  selectVisibleDownToggle: boolean,

  style?: StylesCrossPlatform,
|}

type State<RowProps> = {|
  initial: boolean,
  filter: string,
  selectedIndex: number,
  selectVisibleUpToggle: boolean,
  selectVisibleDownToggle: boolean,

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
    let {selectedIndex} = nextProps
    if (prevState.initial || nextProps.filter !== prevState.filter) {
      visibleList = []
      indexToVisibleIndex = []
      visibleIndexToIndex = []
      for (let i = 0; i < nextProps.rowPropsList.length; i++) {
        const rowProps = nextProps.rowPropsList[i]
        const show = nextProps.rowFilterer(rowProps, nextProps.filter)
        if (show) {
          visibleList.push(rowProps)
          visibleIndexToIndex.push(i)
        }
        indexToVisibleIndex.push(Math.max(0, visibleList.length - 1))
      }
      selectedVisibleIndex = indexToVisibleIndex[selectedIndex]
    } else if (selectedIndex !== prevState.selectedIndex) {
      selectedVisibleIndex = indexToVisibleIndex[selectedIndex]
    } else if (nextProps.selectVisibleUpToggle !== prevState.selectVisibleUpToggle) {
      if (visibleList.length > 0) {
        selectedVisibleIndex = (selectedVisibleIndex + (visibleList.length - 1)) % visibleList.length
      }
    } else if (nextProps.selectVisibleDownToggle !== prevState.selectVisibleDownToggle) {
      if (visibleList.length > 0) {
        selectedVisibleIndex = (selectedVisibleIndex + 1) % visibleList.length
      }
    } else {
      // Nothing changed.
      return null
    }

    return {
      initial: false,
      filter: nextProps.filter,
      selectedIndex,
      selectVisibleUpToggle: nextProps.selectVisibleUpToggle,
      selectVisibleDownToggle: nextProps.selectVisibleDownToggle,

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
