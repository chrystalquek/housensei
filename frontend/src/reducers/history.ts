import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BTOGraphDataResponse,
  getBTOGraph,
  getResaleGraph,
  ResaleGraphDataResponse,
} from '../api/history';
import type { RootState } from '../app/store';
import { Group } from '../types/groups';
import { BTOProject, ChartDataPoint, PriceDataPoint } from '../types/history';
import { getChartData } from '../utils/history';

interface HistoryState {
  groups: Record<string, Group>;
  resaleRawData: Record<string, PriceDataPoint[]>;
  chartData: ChartDataPoint[];
  btoProjectsRecord: Record<string, BTOProject[]>;
}

const initialState: HistoryState = {
  groups: {},
  resaleRawData: {},
  chartData: [],
  btoProjectsRecord: {},
};

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<Group>) => {
      state.groups[action.payload.id] = action.payload;
    },
    updateGroup: (
      state,
      action: PayloadAction<{ id: string; group: Group }>
    ) => {
      state.groups[action.payload.id] = action.payload.group;
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      const { type } = state.groups[action.payload];
      delete state.groups[action.payload];
      if (type === 'resale') {
        delete state.resaleRawData[action.payload];
        state.chartData = getChartData(state.resaleRawData, state.groups);
      } else {
        delete state.btoProjectsRecord[action.payload];
      }
    },
    resetGroups: (state) => {
      state.groups = initialState.groups;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        getResaleGraph.matchFulfilled,
        (state, action: PayloadAction<ResaleGraphDataResponse>) => {
          state.resaleRawData[action.payload.id] = action.payload.data;
          state.chartData = getChartData(state.resaleRawData, state.groups);
        }
      )
      .addMatcher(
        getBTOGraph.matchFulfilled,
        (state, action: PayloadAction<BTOGraphDataResponse>) => {
          state.btoProjectsRecord[action.payload.id] = action.payload.data;
        }
      );
  },
});

export const { createGroup, updateGroup, removeGroup, resetGroups } =
  slice.actions;

export const selectGroups = (state: RootState): Group[] =>
  Object.values(state.history.groups).sort((left, right) =>
    left.name.localeCompare(right.name)
  );

export const selectChartData = (state: RootState): ChartDataPoint[] =>
  state.history.chartData;
export const selectBTOProjectsRecord = (
  state: RootState
): Record<string, BTOProject[]> => state.history.btoProjectsRecord;
export const selectBTOProjects =
  (id: string) =>
  (state: RootState): BTOProject[] =>
    state.history.btoProjectsRecord[id];

export default slice.reducer;
