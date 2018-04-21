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

const MentionHud = <RowProps>(props: Props<RowProps>) => {
  const rowPropsList = props.rowPropsList.filter(rowProps => props.rowFilterer(rowProps, props.filter))
  if (rowPropsList.length === 0) {
    return null
  }

  return (
    <List
      items={rowPropsList}
      renderItem={(index: number, rowProps: RowProps) => {
        let selectedIndex = props.selectedIndex % rowPropsList.length
        if (selectedIndex < 0) {
          selectedIndex += rowPropsList.length
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
