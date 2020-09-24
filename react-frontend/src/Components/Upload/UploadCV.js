import React, { Component } from "react";
import axios from 'axios';

// class UploadCV extends Component {
//     state = {
//         selectedFile: null
//     };

//     onFileChange = event => {
//         this.setState({ selectedFile: event.target.files[0] });
//     };

//     onFileUpload = () => {
//         const formData = new FormData();

//         formData.append(
//             "myFile",
//             this.state.selectedFile,
//             this.state.selectedFile.name
//         );

//         console.log(this.state.selectedFile);
//     };

//     fileData = () => {
//         if (this.state.selectedFile) {
//             return (
//                 <div>
//                     <h2>File Details:</h2>
//                     <p>File Name: {this.state.selectedFile.name}</p>
//                     <p>File Type: {this.state.selectedFile.type}</p>
//                     <p>
//                         Last Modified:{" "}
//                         {this.state.selectedFile.lastModifiedDate.toDateString()}
//                     </p>
//                 </div>
//             );
//         } else {
//             return (
//                 <div>
//                     <br />
//                     <h4>Choose before Pressing the Upload button</h4>
//                 </div>
//             );
//         }
//     };
//     render() {

//         return (
//             <div>
//                 <h3>
//                     File Upload using React!
//               </h3>
//                 <div>
//                     <input type="file" onChange={this.onFileChange} />
//                     <button onClick={this.onFileUpload}>
//                         Upload!
//                   </button>
//                 </div>
//                 {this.fileData()}
//             </div>
//         );
//     }
// }
class UploadCV extends Component {
    state = {
        selectedFile: null
    }

    onChange = event => {
        this.setState({
            selectedFile: event.target.files[0], loaded: 0,
        })
    }

    onClick = () => {
        const data = FormData()
        data.append('file', this.state.selectedFile)
        axios.post("", data, {}).then(res => {
            console.log(res.statusTest)
        })
    }


    render() {
        return (
            <div>
                <input type="file" onChange={this.onChange} />
                <button type="button" onClick={this.onClick}>Upload</button>
            </div>
        )
    }
}
export default UploadCV