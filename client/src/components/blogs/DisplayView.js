import React from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import { getFormattedDate, strTrunc } from "../../utils/GenUtils";

class DisplayView extends React.Component {

    handleClick = (e) => {
        if (e.target.tagName !== "TD") {
            this.props.confirmDelete(this.props.id, this.props.blog.title);
        } else {
            this.props.singleBlog(this.props.blog);
        }
    };

    render() {
        const userDisplayStyle = {
            // height: 'auto',
            // verticalAlign: 'middle',
            // cursor: 'pointer',
            // textAlign: 'center',
            // paddingTop: "8px",
            padding: '15px 1%'
            // paddingBottom: "8px"
        };
        const blog = this.props.blog;

        const title = blog.title;
        const desc = blog.description;
        const createdAt = blog.createdAt;
        const createdBy = blog.createdBy;

        return (
            <TableRow onClick={this.handleClick} style={{ cursor: 'pointer' }} id="tr-hover"
                      hover>
                <TableCell style={userDisplayStyle} id={this.props.id}>
                    {title ? strTrunc(title, 32) : "---"}
                </TableCell>
                <TableCell style={userDisplayStyle} id={this.props.id}>
                    {desc ? strTrunc(desc) : "---"}
                </TableCell>
                <TableCell style={userDisplayStyle} id={this.props.id}>
                    {createdAt ? getFormattedDate(createdAt) : "---"}
                </TableCell>
                <TableCell style={userDisplayStyle} id={this.props.id}>{createdBy ? createdBy : "---"}</TableCell>
                <TableCell className="delete-button" style={{ textAlign: 'right' }}>
                    <Delete onClick={this.handleClick}/>
                </TableCell>
            </TableRow>
        );
    }
}

export default DisplayView;
