import React from 'react';
import { IconButton, InputAdornment, Table, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import Close from "@material-ui/icons/Close";

class Filter extends React.Component {

    state = {
        fields: ['title', 'description'],
        snackbarOpen: false,
        snackbarMessage: '',
        cancelApiCall: ''
    };

    handleChange = (e, field) => {
        let filterObject = { ...this.props.filter };
        if (e.target.value.length === 1 && e.target.value === " ") {
            return;
        }
        filterObject[field] = e.target.value;
        this.props.setFilter(filterObject);
        clearTimeout(this.state.cancelApiCall);
        this.setState(() => ({
            cancelApiCall: setTimeout(() => {
                this.props.loadEntity(0);
            }, 300)
        }))
    };

    handleSnackBarClick = () => {
        this.setState(prevState => ({
            snackbarOpen: !prevState.snackbarOpen
        }));
    };

    onButtonClick = (e) => {
        e.preventDefault();
        this.props.loadEntity(0);
    }

    onPressEnter = (e) => {
        if (e.which === 13) {
            this.onButtonClick(e);
        }
    };

    clearIndividualFilter = (field) => {
        let filterObject = { ...this.props.filter };
        if (filterObject[field] && filterObject[field].length !== 0) {
            filterObject[field] = "";
            this.props.loadEntity(0, filterObject);
            this.props.setFilter(filterObject);
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            filter: nextProps.filter
        })
    };

    render() {
        return (
            <div>
                <form>
                    <Table onKeyPress={this.onPressEnter}>
                        <TableHead>
                            <TableRow>
                                <TableCell key={this.state.fields[0]}
                                           style={{ width: '25%', padding: '0px 1% 1vh 0px' }}>
                                    <TextField
                                        name={this.state.fields[0]}
                                        id="title-filter"
                                        type="text"
                                        label="Title"
                                        variant="outlined"
                                        value={this.props.filter[this.state.fields[0]]}
                                        placeholder="Enter title to search..."
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        style={{ padding: '3px' }}
                                                        onClick={() => this.clearIndividualFilter(this.state.fields[0])}
                                                    >
                                                        <Close/>
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) => this.handleChange(e, e.target.name)}
                                    />
                                </TableCell>
                                <TableCell key={this.state.fields[1]}
                                           style={{ width: '25%', padding: '0px 1% 1vh 0px' }}>
                                    <TextField
                                        name={this.state.fields[1]}
                                        id="desc-filter"
                                        label="Description"
                                        variant="outlined"
                                        type="text"
                                        style={{ width: '100%' }}
                                        value={this.props.filter[this.state.fields[1]]}
                                        placeholder="Enter desc to search..."
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        style={{ padding: '3px' }}
                                                        onClick={() => this.clearIndividualFilter(this.state.fields[1])}
                                                    >
                                                        <Close/>
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) => this.handleChange(e, e.target.name)}
                                    />
                                </TableCell>
                                <TableCell key={this.state.fields[2]}
                                           style={{ width: '25%', padding: '0px 1% 1vh 0px' }}>
                                </TableCell>
                                <TableCell key={this.state.fields[3]}
                                           style={{ width: '25%', padding: '0px 1% 1vh 0px' }}>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </form>
            </div>
        );
    }

}

export default Filter;
