// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'
import type { BrowserHistory, HashHistory, MemoryHistory } from 'history'

import type { ActionSetting, StateSetting } from './setting.model'
import type { ActionInfo, StateInfo } from './info.model'

export type RouterHistory = BrowserHistory | HashHistory | MemoryHistory

export type ReduxInitAction = { type: '@@INIT' }

export type RootState = { setting: StateSetting, info: StateInfo }

export type Action = ReduxInitAction | ActionSetting | ActionInfo

export type Store = ReduxStore<RootState, Action>

export type Dispatch = ReduxDispatch<Action>
