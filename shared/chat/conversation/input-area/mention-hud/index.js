// @flow
import * as React from 'react'
import {List} from '../../../../common-adapters/index'
import {type StylesCrossPlatform} from '../../../../styles'

type Props<RowData, RowProps> = {|
  rowDataList: Array<RowData>,
  filter: string,
  rowFilterer: (rowDataList: Array<RowData>, filter: string) => Array<RowProps>,
  selectedIndex: number,
  style?: StylesCrossPlatform,
  rowRenderer: (index: number, selected: boolean, rowProps: RowProps) => React.Node,
|}

const MentionHud = <RowData, RowProps>(props: Props<RowData, RowProps>) => {
  const rowPropList = props.rowFilterer(props.rowDataList, props.filter)
  if (rowPropList.length === 0) {
    return null
  }

  return (
    <List
      items={rowPropList}
      renderItem={(index: number, rowProps: RowProps) => {
        let selectedIndex = props.selectedIndex % rowPropList.length
        if (selectedIndex < 0) {
          selectedIndex += rowPropList.length
        }
        return props.rowRenderer(index, index === selectedIndex, rowProps)
      }}
      selectedIndex={props.selectedIndex}
      fixedHeight={40}
      keyboardShouldPersistTaps="always"
      style={props.style}
    />
  )
}

export default MentionHud
