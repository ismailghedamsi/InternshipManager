import { ErrorMessage, Field, Form, Formik } from 'formik';
import React,{Component} from 'react';
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
                       className="form-control" type="text" name="username"/>
            </fieldset>

            <fieldset className="form-group">
                <label>Password : </label>
                <Field style={props.errors.password ? {border: "1px solid tomato", borderWidth: "thick"} : {}}
                       className="form-control" type="password" name="password"/>
            </fieldset>

        </div>
    }


    render() {

        const initialValuesJson = {
            username: "",
            password: "",
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