import React, {Component} from 'react';
import httpService from "../services/httpService";
import {loginURL} from '../config.json'

class Login extends Component {

    state = {
        data: {
            username: "",
            password: ""
        },

        error: {},

    }

    handleOnChange = (event) => {
        const data = {...this.state.data}
        const {name, value} = event.currentTarget;
        data[name] = value;
        this.setState({data})

    }

    handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log("Form submission")
        await this.doSubmit();

    }

    doSubmit = async () => {
        try {
            const body = {...this.state.data}
            const {data: jwt} = await httpService.post(loginURL, body);
            localStorage.setItem("token", jwt);
            window.location = "/"

        } catch (ex) {
            const error = {};
            if (ex.response && ex.response.data) {
                error.message = ex.response.data
            } else {
                error.message = ex.message;
            }


            this.setState({error})

        }

    }


    render() {

        const {username, password} = this.state.data
        const {message} = this.state.error;
        return (

            <div className="login-body-container">
                <div className="header">
                    <h1>Coverage Checker Admin</h1>
                </div>
                <div className="login-main-container">
                    <div class="login-container">
                        <div class="form">
                            {message && <small className="login-error"><i className="fas fa-exclamation-triangle"/>{message}</small>}
                            <form onSubmit={this.handleFormSubmit}>
                                <div className="login-form-control textbox">
                                    <i className="fas fa-user"/>
                                    <input type="text" name="username" placeholder="Username" value={username}
                                           onChange={this.handleOnChange} required/>
                                </div>
                                <div className="login-form-control textbox">
                                    <i className="fas fa-lock"/>
                                    <input type="password" name="password" placeholder="Password" value={password}
                                           onChange={this.handleOnChange} required/>
                                </div>

                                <div className="login-form-control">
                                    <input type="submit" className="login-btn" value="Login"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>


        );
    }
}


export default Login;
