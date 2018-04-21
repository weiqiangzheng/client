// @flow
import * as React from 'react'
import {List} from '../../../../common-adapters/index'
import {globalColors, globalStyles, collapseStyles, type StylesCrossPlatform} from '../../../../styles'

type Props<Item> = {|
  data: Array<Item>,
  selectedIndex: number,
  style?: StylesCrossPlatform,
  rowRenderer: (index: number, selected: boolean, item: Item) => React.Node,
|}

const MentionHud = <Item>(props: Props<Item>) =>
  props.data.length ? (
    <List
      items={props.data}
      renderItem={(index: number, item: Item) =>
        props.rowRenderer(index, index === props.selectedIndex, item)
      }
      selectedIndex={props.selectedIndex}
      fixedHeight={40}
      keyboardShouldPersistTaps="always"
      style={collapseStyles([hudStyle, props.style])}
    />
  ) : null

const hudStyle = {
  ...globalStyles.flexBoxColumn,
  backgroundColor: globalColors.white,
}

export default MentionHud
