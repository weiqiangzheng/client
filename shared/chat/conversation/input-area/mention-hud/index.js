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
  initial: boolean,
  filter: string,
  selectedIndex: number,

  visibleList: Array<RowProps>,
  indexToVisibleIndex: Array<number>,
  visibleIndexToIndex: Array<number>,
|}

class MentionHud<RowProps> extends React.Component<Props<RowProps>, State<RowProps>> {
  constructor(props: Props<RowProps>) {
    super(props)
    this.state = {
      initial: true,
      filter: '',
      selectedIndex: 0,

      visibleList: [],
      indexToVisibleIndex: [],
      visibleIndexToIndex: [],
    }
  }

  static getDerivedStateFromProps = (
    nextProps: Props<RowProps>,
    prevState: State<RowProps>
  ): null | State<RowProps> => {
    let {visibleList, indexToVisibleIndex, visibleIndexToIndex} = prevState
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
    } else if (nextProps.selectedIndex !== prevState.selectedIndex) {
      // Fall through.
    } else {
      // Nothing changed.
      return null
    }

    return {
      initial: false,
      filter: nextProps.filter,
      selectedIndex: nextProps.selectedIndex,

      visibleList,
      indexToVisibleIndex,
      visibleIndexToIndex,
    }
  }

  render = () => {
    const {visibleList, indexToVisibleIndex, visibleIndexToIndex} = this.state
    const selectedVisibleIndex = indexToVisibleIndex[this.props.selectedIndex]

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
