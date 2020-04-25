import { combineReducers } from "redux";
import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters,
} from "./actions";
const { SHOW_ALL } = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action: any) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

interface Polygon {
  id: string;
  pts: [number, number][];
}

function todos(state: Polygon[] = [], action: any) {
  switch (action.type) {
    case ADD_TODO:
      return [...state];
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        // if (index === action.index) {
        //   return Object.assign({}, todo, {
        //     completed: !todo.completed,
        //   });
        // }
        return todo;
      });
    default:
      return state;
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos,
});

export default todoApp;