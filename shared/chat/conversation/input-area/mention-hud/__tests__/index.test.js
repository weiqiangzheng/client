// @flow
/* eslint-env jest */
import MentionHud, {type Props, type State} from '..'

type RowProps = {|
  key: string,
  data: string,
|}

describe('getDerivedStateFromProps', () => {
  const gdsfp = MentionHud.getDerivedStateFromProps
  it('steady to saving', () => {
    const prevState: State<RowProps> = {
      initial: true,
      filter: '',
      selectedIndex: 0,
      selectVisibleUpToggle: false,
      selectVisibleDownToggle: false,

      visibleList: [],
      indexToVisibleIndex: [],
      visibleIndexToIndex: [],
      selectedVisibleIndex: 0,
    }

    const nextProps: Props<RowProps> = {
      rowPropsList: [],
      rowFilterer: () => false,
      rowRenderer: () => null,

      filter: '',
      selectedIndex: 0,
      selectVisibleUpToggle: false,
      selectVisibleDownToggle: false,
    }

    const state = gdsfp(nextProps, prevState)
    expect(state).toEqual(null)
  })
})
