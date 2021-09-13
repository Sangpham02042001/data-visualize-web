import React, {
    useState,
    useReducer,
    useEffect,
    useMemo,
} from 'react';
import {nanoid } from 'nanoid';
import Paper from '@material-ui/core/Paper';
import {
    VirtualTableState,
    createRowCache,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    VirtualTable,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import { axiosInstance } from '../../utils/axios.utils';

const VIRTUAL_PAGE_SIZE = 50;
const buildQueryString = (skip, take, fileCached) => (
    `/api/scroll?fileCached=${fileCached}&offset=${skip}&range=${take}`
);

const initialState = {
    rows: [],
    skip: 0,
    requestedSkip: 0,
    take: VIRTUAL_PAGE_SIZE * 2,
    totalCount: 0,
    loading: false,
    lastQuery: '',
};

function reducer(state, { type, payload }) {
    switch (type) {
        case 'UPDATE_ROWS':
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case 'START_LOADING':
            return {
                ...state,
                requestedSkip: payload.requestedSkip,
                take: payload.take,
            };
        case 'REQUEST_ERROR':
            return {
                ...state,
                loading: false,
            };
        case 'FETCH_INIT':
            return {
                ...state,
                loading: true,
            };
        case 'UPDATE_QUERY':
            return {
                ...state,
                lastQuery: payload,
            };
        default:
            return state;
    }
}

export default function Test({ fileCached, fileLength }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [columns, setColumns] = useState([]);

    const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);
    const updateRows = (skip, count, newTotalCount) => {
        dispatch({
            type: 'UPDATE_ROWS',
            payload: {
                skip,
                rows: cache.getRows(skip, count),
                totalCount: fileLength,
            },
        });
    };

    const getRemoteRows = (requestedSkip, take) => {
        dispatch({ type: 'START_LOADING', payload: { requestedSkip, take } });
    };

    const loadData = () => {
        const {
            requestedSkip, take, lastQuery, loading,
        } = state;
        const query = buildQueryString(requestedSkip, take, fileCached);
        if (query !== lastQuery && !loading) {
            const cached = cache.getRows(requestedSkip, take);
            if (cached.length === take) {
                updateRows(requestedSkip, take);
            } else {

                dispatch({ type: 'FETCH_INIT' });
                axiosInstance.get(query)
                    .then((res) => {
                        const {data} = res.data;
                        cache.setRows(requestedSkip, data);
                        updateRows(requestedSkip, take);
                        const cols = Object.keys(data[0]).map((key) => {
                            return {
                                name: key,
                                title: key,
                                getCellValue: row => row[key]
                            }
                        })
                        
                        setColumns(cols);
                    })
                    .catch(() => dispatch({ type: 'REQUEST_ERROR' }));
            }
            dispatch({ type: 'UPDATE_QUERY', payload: query });
        }
    };

    useEffect(() => loadData());

    const {
        rows, skip, totalCount, loading,
    } = state;
    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={() => nanoid()}
            >
                <VirtualTableState
                    infiniteScrolling
                    loading={loading}
                    totalRowCount={totalCount}
                    pageSize={VIRTUAL_PAGE_SIZE}
                    skip={skip}
                    getRows={getRemoteRows}
                />
                <VirtualTable />
                <TableHeaderRow />
            </Grid>
        </Paper>
    );
};
