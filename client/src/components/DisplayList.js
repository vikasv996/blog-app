import React from 'react';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@material-ui/core';
import Loader from '../utils/Loader';
import Error from '../utils/Error';
import NoEntity from "./NoEntity";
import DisplayView from "./blogs/DisplayView";

class DisplayList extends React.Component {

    viewBlog = (item) => {
        let cookies = new Cookies();
        cookies.set('cache', {
            filter: this.props.filter,
            pageNum: this.props.pageNum
        });
        this.props.singleBlog(item);
    };

    render() {
        let cwString = '';
        const stickyTableHeadStyle = {
            backgroundColor: '#03005e'
        };
        switch (this.props.page) {
            case 'blog':
                cwString = "Blogs";
                break;
            default:
                cwString = "";
        }

        if (this.props.loading) {
            return <Loader/>
        } else if (this.props.error) {
            return <Error/>
        } else if (this.props.noEntity) {
            return <NoEntity compString={cwString}/>
        } else {
            return (
                <Paper elevation={1} style={{ backgroundColor: '#fff' }}>
                    <Table style={{ minWidth: '700px' }}>
                        <TableHead style={stickyTableHeadStyle}>
                            {
                                this.props.page === 'blog' ? (
                                    <TableRow style={{ textAlign: 'left' }}>
                                        <TableCell
                                            style={{
                                                width: '22%',
                                                padding: '15px 1%',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 'medium'
                                            }}>
                                            Title
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                width: '32%',
                                                padding: '15px 1%',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 'medium'
                                            }}>
                                            Description
                                        </TableCell>
                                        <TableCell style={{
                                            width: '18%',
                                            padding: '15px 1%',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 'medium'
                                        }}>Created On</TableCell>
                                        <TableCell
                                            style={{
                                                width: '18%',
                                                padding: '15px 1%',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 'medium'
                                            }}>
                                            Created By
                                        </TableCell>
                                        <TableCell style={{
                                            width: '10%',
                                            padding: '0 1%',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 'medium'
                                        }}>
                                        </TableCell>
                                    </TableRow>
                                ) : ""
                            }
                        </TableHead>
                        <TableBody>
                            {
                                this.props.page === 'blog' ? (
                                    this.props.blogList.map(blog => (
                                        <DisplayView
                                            key={blog.blogId}
                                            blog={blog}
                                            id={blog.blogId}
                                            // onClickCheckBox={this.props.onClickCheckBox}
                                            singleBlog={this.viewBlog}
                                            confirmDelete={this.props.confirmDelete}
                                        />
                                    ))
                                ) : ""
                            }
                        </TableBody>
                    </Table>
                    <TablePagination style={{ borderBottom: '0px' }}
                                     count={this.props.totalCount} onChangePage={this.props.handlePageChange}
                                     page={this.props.pageNum} onChangeRowsPerPage={this.props.handleRowPerPageChange}
                                     rowsPerPage={this.props.rowsPerPage} rowsPerPageOptions={[5, 10, 20]}/>
                </Paper>
            );
        }
    }

}

export default withRouter(DisplayList);
