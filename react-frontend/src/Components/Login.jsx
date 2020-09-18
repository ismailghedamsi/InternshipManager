import { ErrorMessage, Field, Form, Formik } from 'formik';
import React,{Component} from 'react';
const axios = require("axios");

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        }
    }

    componentDidMount = () => {

    }

    onSubmit = (values) => {
        this.setState({
            username : values.username,
            password : values.password
        });
        
        console.log(this.state.username + ":" + this.state.password);
        console.log(window.btoa(this.state.username + ":" + this.state.password));

        axios({
            method: "GET",
            url: "http://localhost:8080/auth/basic",
            headers: {
                authorization: "Basic " + window.btoa(this.state.username + ":" + this.state.password)
            }
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }


    validate = (values) => {
        let errors = {}
        return errors
    }


    errorBlocks = () => {
        return <div>
            <ErrorMessage name="username" component="div" className="alert alert-warning" style={{color: 'red'}}/>
            <ErrorMessage name="password" component="div" className="alert alert-warning" style={{color: 'red'}}/>
        </div>

    }

    formFields = (props) => {
        return <div>
            <fieldset className="form-group">
                <label>Username : </label>
                <Field style={props.errors.username ? {border: "1px solid tomato", borderWidth: "thick"} : {}}
                       className="form-control" type="text" name="username" id="username"/>
            </fieldset>

            <fieldset className="form-group">
                <label>Password : </label>
                <Field style={props.errors.password ? {border: "1px solid tomato", borderWidth: "thick"} : {}}
                       className="form-control" type="password" name="password" id="password"/>
            </fieldset>

        </div>
    }


    render() {

        const initialValuesJson = {
            username: "",
            password: ""
        }


        return (
            <div>
                <div className="container">
                    <Formik
                        onSubmit={this.onSubmit}
                        validate={this.validate}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize={true}
                        initialValues={initialValuesJson}
                    >

                        {/* anonymus method
                        tous les attribu name doivent avoir le meme nom que les variables du  state
                        */
                        }
                        {
                            (props) => (
                                <Form>
                                    {this.errorBlocks()}
                                    {this.formFields(props)}
                                    <button onSubmit={this.onSubmit} className="btn btn-success" type="submit">Login
                                        Student
                                    </button>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        );
    }
}
   
 
export default Login;