// @flow
/* eslint-env jest */
import MentionHud, {type Props, type State} from '..'

type RowProps = {|
  key: string,
  data: string,
|}

describe('getDerivedStateFromProps', () => {
  const gdsfp = MentionHud.getDerivedStateFromProps
  const rowFilterer = (obj, filter) => obj.data.indexOf(filter) >= 0
  const rowRenderer = () => null

  const initialState: State<RowProps> = {
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

  const initialProps: Props<RowProps> = {
    rowPropsList: [],
    rowFilterer,
    rowRenderer,

    filter: '',
    selectedIndex: 0,
    selectVisibleUpToggle: false,
    selectVisibleDownToggle: false,
  }

  it('initial empty', () => {
    const nextProps = initialProps

    const expectedState: State<RowProps> = {
      ...initialState,
      initial: false,
    }

    const state = gdsfp(nextProps, initialState)
    expect(state).toEqual(expectedState)
  })

  const rowPropsList = ['foo', 'bar', 'baz'].map(s => ({data: s, key: s}))

  it('initial non-empty', () => {
    const nextProps = {
      ...initialProps,
      rowPropsList,
    }

    const expectedState: State<RowProps> = {
      ...initialState,
      initial: false,

      visibleList: nextProps.rowPropsList,
      indexToVisibleIndex: [0, 1, 2],
      visibleIndexToIndex: [0, 1, 2],
    }

    const state = gdsfp(nextProps, initialState)
    expect(state).toEqual(expectedState)
  })

  it('change filter', () => {
    const prevState = {
      ...initialState,
      initial: false,

      visibleList: rowPropsList,
      indexToVisibleIndex: [0, 1, 2],
      visibleIndexToIndex: [0, 1, 2],
    }

    const nextProps = {
      ...initialProps,
      rowPropsList,
      filter: 'b',
    }

    const expectedState: State<RowProps> = {
      ...prevState,
      filter: nextProps.filter,
      visibleList: nextProps.rowPropsList.slice(1),
      indexToVisibleIndex: [0, 0, 1],
      visibleIndexToIndex: [1, 2],
    }

    const state = gdsfp(nextProps, initialState)
    expect(state).toEqual(expectedState)
  })
})
