// @flow
import * as React from 'react'
import {Box, List} from '../../../../common-adapters/index'
import {globalColors, globalStyles, collapseStyles, type StylesCrossPlatform} from '../../../../styles'

type Props<Item> = {|
  data: Array<Item>,
  selectedIndex: number,
  style?: StylesCrossPlatform,
  rowRenderer: (index: number, item: Item) => React.Node,
|}

const MentionHud = <Item>(props: Props<Item>) =>
  props.data.length ? (
    <Box style={collapseStyles([hudStyle, props.style])}>
      <List
        items={props.data}
        renderItem={props.rowRenderer}
        selectedIndex={props.selectedIndex}
        fixedHeight={40}
        keyboardShouldPersistTaps="always"
      />
    </Box>
  ) : null

const hudStyle = {
  ...globalStyles.flexBoxRow,
  backgroundColor: globalColors.white,
}

export default MentionHud
