// @flow
import React from 'react'
import MentionHud from '.'
import {Box, Button, ButtonBar, ClickableBox, Input, Text} from '../../../../common-adapters'
import {storiesOf, action} from '../../../../stories/storybook'
import {globalMargins, globalStyles} from '../../../../styles'

const Row = (props: {index: number, selected: boolean, data: string, onClick: () => void}) => (
  <ClickableBox
    onClick={props.onClick}
    style={{
      paddingLeft: globalMargins.tiny,
      backgroundColor: props.selected ? 'grey' : 'white',
    }}
  >
    <Text type="Body">
      {props.index}: {props.data}
    </Text>
  </ClickableBox>
)

type State = {
  filter: string,
  selectedIndex: number,
  selectVisibleUpToggle: boolean,
  selectVisibleDownToggle: boolean,
}

class MentionHudContainer extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      selectedIndex: 0,
      selectVisibleUpToggle: false,
      selectVisibleDownToggle: false,
    }
  }

  _selectVisibleUp = () => {
    this.setState(({selectVisibleUpToggle}) => ({selectVisibleUpToggle: !selectVisibleUpToggle}))
  }

  _selectVisibleDown = () => {
    this.setState(({selectVisibleDownToggle}) => ({selectVisibleDownToggle: !selectVisibleDownToggle}))
  }

  _setFilter = (filter: string) => {
    this.setState({filter})
  }

  _onRowClick = (index: number) => {
    this.setState({selectedIndex: index})
  }

  render() {
    return (
      <Box style={{...globalStyles.flexBoxColumn, height: 400, width: 240}}>
        <MentionHud
          rowPropsList={['some data', 'some other data', 'third data']}
          rowFilterer={(data, filter) => data.indexOf(filter) >= 0}
          rowRenderer={(index, selected, data) => (
            <Row
              key={index}
              index={index}
              selected={selected}
              onClick={() => this._onRowClick(index)}
              data={data}
            />
          )}
          filter={this.state.filter}
          selectedIndex={this.state.selectedIndex}
          selectVisibleUpToggle={this.state.selectVisibleUpToggle}
          selectVisibleDownToggle={this.state.selectVisibleDownToggle}
          style={{backgroundColor: 'lightgrey'}}
          debugLog={action('debugLog')}
        />
        <ButtonBar>
          <Button label="Up" type="Primary" onClick={this._selectVisibleUp} />
          <Button label="Down" type="Primary" onClick={this._selectVisibleDown} />
        </ButtonBar>
        <Input onChangeText={this._setFilter} hintText="Filter" />
      </Box>
    )
  }
}

const load = () => {
  storiesOf('Chat/Mention HUD', module).add('Basic', () => <MentionHudContainer />)
}

export default load
