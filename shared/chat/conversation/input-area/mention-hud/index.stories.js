// @flow
import React from 'react'
import MentionHud from '.'
import {Box, Text} from '../../../../common-adapters'
import {storiesOf} from '../../../../stories/storybook'
import {globalMargins} from '../../../../styles'

const Row = (props: {index: number, selected: boolean, data: string}) => (
  <Box
    style={{
      border: '1px solid black',
      paddingLeft: globalMargins.tiny,
      backgroundColor: props.selected ? 'grey' : 'white',
    }}
  >
    <Text type="Body">
      {props.index}: {props.data}
    </Text>
  </Box>
)

const load = () => {
  storiesOf('Chat/Mention Hud', module).add('Basic', () => (
    <MentionHud
      data={['some data', 'some other data', 'third data']}
      filter="third"
      rowFilterer={(data, filter) =>
        data
          .filter(s => s.indexOf(filter) >= 0)
          .concat(['footer'])
          .map(data => ({data}))
      }
      rowRenderer={(index, selected, rowProps) => <Row index={index} selected={selected} {...rowProps} />}
      selectedIndex={0}
      style={{height: 300, width: 240, backgroundColor: 'lightgrey'}}
    />
  ))
}

export default load
