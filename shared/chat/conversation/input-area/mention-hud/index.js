// @flow
import * as React from 'react'
import {List} from '../../../../common-adapters/index'
import {type StylesCrossPlatform} from '../../../../styles'

type Props<RowProps> = {|
  rowPropsList: Array<RowProps>,
  filter: string,
  rowFilterer: (rowProps: RowProps, filter: string) => boolean,
  selectedIndex: number,
  style?: StylesCrossPlatform,
  rowRenderer: (index: number, selected: boolean, rowProps: RowProps) => React.Node,
|}

type State<RowProps> = {|
  filter: string,
  selectedIndex: number,

  visibleIndexToIndex: Array<number>,
  filteredList: Array<RowProps>,
  selectedVisibleIndex: number,
|}

class MentionHud<RowProps> extends React.Component<Props<RowProps>, State<RowProps>> {
  constructor(props: Props<RowProps>) {
    super(props)
    this.state = {
      filter: '',
      selectedIndex: 0,

      visibleIndexToIndex: [],
      filteredList: [],
      selectedVisibleIndex: 0,
    }
  }

  static getDerivedStateFromProps = (
    nextProps: Props<RowProps>,
    prevState: State<RowProps>
  ): null | State<RowProps> => {
    let {visibleIndexToIndex, filteredList, selectedVisibleIndex} = prevState
    if (nextProps.filter !== prevState.filter) {
      selectedVisibleIndex = 0
      for (let i = 0; i < nextProps.rowPropsList.length; i++) {
        const rowProps = nextProps.rowPropsList[i]
        const show = nextProps.rowFilterer(rowProps, nextProps.filter)
        if (show) {
          visibleIndexToIndex.push(i)
          filteredList.push(rowProps)
          if (i <= nextProps.selectedIndex) {
            selectedVisibleIndex = filteredList.length - 1
          }
        }
      }
    } else if (nextProps.selectedIndex !== prevState.selectedIndex) {
      selectedVisibleIndex = 0
      for (let i = 0; i < filteredList.length; i++) {
        if (visibleIndexToIndex[i] <= nextProps.selectedIndex) {
          selectedVisibleIndex = i
        }
      }
    } else {
      // Nothing changed.
      return null
    }

    return {
      filter: nextProps.filter,
      selectedIndex: nextProps.selectedIndex,

      visibleIndexToIndex,
      filteredList,
      selectedVisibleIndex,
    }
  }

  render = () => {
    const {visibleIndexToIndex, filteredList, selectedVisibleIndex} = this.state

    return (
      <List
        items={filteredList}
        renderItem={(visibleIndex: number, rowProps: RowProps) => {
          const index = visibleIndexToIndex[visibleIndex]
          return this.props.rowRenderer(index, visibleIndex === this.state.selectedVisibleIndex, rowProps)
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
