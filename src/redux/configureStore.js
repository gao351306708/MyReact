/**
 * reducer和store配置
 * Created by gaoju on 2017/11/15.
 */

import { createStore,combineReducers, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as rootReducer from './reducers';
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { pendingTasksReducer } from 'react-redux-spinner'

export default function configureStore(history, initialState) {

    const reducer = combineReducers({
        ...rootReducer,
        routing: routerReducer,
        pendingTasks: pendingTasksReducer,
    })

    const loggerMiddleware = createLogger()

    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                thunkMiddleware,
                //loggerMiddleware,
                routerMiddleware(history)
            )
        )
    )
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers/index', () => {
            const nextRootReducer = require('./reducers/index');
            store.replaceReducer(nextRootReducer || nextRootReducer.default);
        });
    }

    return store
}
