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

class MentionHud<RowProps> extends React.Component<Props<RowProps>> {
  render = () => {
    const props = this.props

    const visibleIndexToIndex = []
    const filteredList = []
    let selectedVisibleIndex = 0
    for (let i = 0; i < props.rowPropsList.length; i++) {
      const rowProps = props.rowPropsList[i]
      const show = props.rowFilterer(rowProps, props.filter)
      if (show) {
        visibleIndexToIndex.push(i)
        filteredList.push(rowProps)
        if (i <= props.selectedIndex) {
          selectedVisibleIndex = filteredList.length - 1
        }
      }
    }

    return (
      <List
        items={filteredList}
        renderItem={(visibleIndex: number, rowProps: RowProps) => {
          const index = visibleIndexToIndex[visibleIndex]
          return props.rowRenderer(index, visibleIndex === selectedVisibleIndex, rowProps)
        }}
        selectedIndex={selectedVisibleIndex}
        fixedHeight={40}
        keyboardShouldPersistTaps="always"
        style={props.style}
      />
    )
  }
}

export default MentionHud
