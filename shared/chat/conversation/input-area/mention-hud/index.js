// @flow
import * as React from 'react'
import {List} from '../../../../common-adapters/index'
import {type StylesCrossPlatform} from '../../../../styles'

type Props<RowData, RowProps> = {|
  data: Array<RowData>,
  filter: string,
  rowFilterer: (data: Array<RowData>, filter: string) => Array<RowProps>,
  selectedIndex: number,
  style?: StylesCrossPlatform,
  rowRenderer: (index: number, selected: boolean, rowProps: RowProps) => React.Node,
|}

const MentionHud = <RowData, RowProps>(props: Props<RowData, RowProps>) => {
  const filtered = props.rowFilterer(props.data, props.filter)
  if (filtered.length === 0) {
    return null
  }

  return (
    <List
      items={filtered}
      renderItem={(index: number, rowProps: RowProps) =>
        props.rowRenderer(index, index === props.selectedIndex, rowProps)
      }
      selectedIndex={props.selectedIndex}
      fixedHeight={40}
      keyboardShouldPersistTaps="always"
      style={props.style}
    />
  )
}

export default MentionHud
