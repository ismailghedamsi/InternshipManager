import React, { Component } from "react";
import axios from 'axios';


class UploadCV extends Component {
    state = {
        selectedFile: null
    }

    onChange = event => {
        this.setState({
            selectedFile: event.target.files[0], loaded: 0,
        })
    }
/*
    onClick = () => {
        const data = FormData()
        data.append('file', this.state.selectedFile)
        axios.post("", data, {}).then(res => {
            console.log(res.statusTest)
        })
    }
*/

    render() {
        return (
            <div>
                <input type="file" onChange={this.onChange} />
                {/* <button type="button" onClick={this.onClick}>Upload</button> */}
            </div>
        )
    }
}
export default UploadCV