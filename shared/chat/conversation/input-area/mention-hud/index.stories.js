// @flow
import React from 'react'
import MentionHud from '.'
import {Box, Text} from '../../../../common-adapters'
import {storiesOf} from '../../../../stories/storybook'
import {globalMargins} from '../../../../styles'

const Row = (props: {index: number, data: string}) => (
  <Box style={{border: '1px solid black', paddingLeft: globalMargins.tiny}}>
    <Text type="Body">
      {props.index}: {props.data}
    </Text>
  </Box>
)

const load = () => {
  storiesOf('Chat/Mention Hud', module).add('Basic', () => (
    <MentionHud
      data={['some data', 'some other data', 'third data']}
      rowRenderer={(index, item) => <Row index={index} data={item} />}
      selectedIndex={0}
      style={{height: 300, width: 240}}
    />
  ))
}

export default load
