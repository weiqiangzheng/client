// @flow
import React from 'react'
import MentionHud from '.'
import {Box, Input, Text} from '../../../../common-adapters'
import {storiesOf} from '../../../../stories/storybook'
import {globalMargins, globalStyles} from '../../../../styles'

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

type State = {
  filter: string,
}

class MentionHudContainer extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {filter: ''}
  }

  _setFilter = (filter: string) => {
    this.setState({filter})
  }

  render() {
    return (
      <Box style={{...globalStyles.flexBoxColumn, height: 400, width: 240}}>
        <MentionHud
          data={['some data', 'some other data', 'third data']}
          filter={this.state.filter}
          rowFilterer={(data, filter) =>
            data
              .filter(s => s.indexOf(filter) >= 0)
              .concat(['footer'])
              .map(data => ({data}))
          }
          rowRenderer={(index, selected, rowProps) => (
            <Row key={index} index={index} selected={selected} {...rowProps} />
          )}
          selectedIndex={0}
          style={{backgroundColor: 'lightgrey'}}
        />
        <Input onChangeText={this._setFilter} hintText="Filter" />
      </Box>
    )
  }
}

const load = () => {
  storiesOf('Chat/Mention Hud', module).add('Basic', () => <MentionHudContainer />)
}

export default load
