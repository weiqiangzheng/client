// @flow
import React from 'react'
import MentionHud from '.'
import {Box, Text} from '../../../../common-adapters'
import {storiesOf} from '../../../../stories/storybook'
import {globalMargins, globalStyles} from '../../../../styles'

const Row = (props: {index: number, data: string}) => (
  <Box style={{backgroundColor: 'green', border: '1px solid black', paddingLeft: globalMargins.tiny}}>
    <Text type="Body" style={{backgroundColor: 'white'}}>
      {props.index}: {props.data}
    </Text>
  </Box>
)

const load = () => {
  storiesOf('Chat/Mention Hud', module).add('Basic', () => (
    <Box style={{...globalStyles.flexBoxColumn, height: 300, width: 240}}>
      <MentionHud
        data={['some data', 'some other data', 'third data']}
        rowRenderer={(index, item) => <Row index={index} data={item} />}
        selectedIndex={0}
        style={{flex: 1}}
      />
    </Box>
  ))
}

export default load
