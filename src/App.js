import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/navbar";
import {Route, Switch, Redirect} from 'react-router-dom';
import ViewSites from "./components/view_sites";
import AddNewSites from "./components/add_new_sites";
import EditSite from "./components/edit_site";
import NotFound from "./components/not-found";
import {Component} from "react";
import Login from "./components/login";
import ReactModal from 'react-modal';
import {getAllSites} from "./services/dataService";
import {toast, ToastContainer, Slide} from "react-toastify";
import '@fortawesome/fontawesome-free/css/all.css'
import httpService from "./services/httpService";

import _ from 'lodash'

ReactModal.setAppElement(document.getElementById("root"))


class App extends Component {

    state = {
        data: [],
        isLogin: false,
        showProgress: false,
        showDialog: false,
        siteToDelete:"",
        showDialogProgress:false,
        sortColumn: {
            path: "site_id",
            orderBy:"asc"
        }

    }
    customStyles = {
        content: {
            padding:0,
            width: '400px',
            height: '350px',
            margin: '0 auto',
            background: '#3d3d56',
            lineHeight: 2,
            boxShadow: '0 0 10px #ccc',
            textAlign:'centre'
        }
    };

    handleDelete = (site) => {
        this.setState({showDialog: true, siteToDelete:site.site_id})

    }

    handleSortEvent = (column) =>{
        const sortColumn = {...this.state.sortColumn}
        if (column.path){
            if (column.path ===sortColumn.path ){
                sortColumn.orderBy = sortColumn.orderBy ==='asc'?"desc":"asc"
            }else {
                sortColumn.path = column.path
                sortColumn.orderBy="asc"
            }
            this.setState({sortColumn})
        }
    }

    handleUpdateData = async () => {
        console.log("update data")
        await this.getSitesData()
    }

    handleLogOut = () => {
        localStorage.clear();
        window.location = "/"
    }

    handleFormSubmission = (data) => {
        this.setState({data})
    }

    async componentDidMount() {
        const jwt = localStorage.getItem("token");
        if (jwt) {
            this.setState({isLogin: true})
            await this.getSitesData()
        }
    }

    async getSitesData() {
        try {
            this.setState({showProgress: true})
            const {data} = await getAllSites();
            this.setState({data, showProgress: false})
        } catch (ex) {
            if (ex.response && ex.response.data) {
                toast.error(ex.response.data, {position: "top-center", autoClose: 1500})
            } else {
                toast.error(ex.message, {position: "top-center", autoClose: 1500})

            }
        } finally {
            this.setState({showProgress: false})
        }

    }
    handleCancelDialog = () =>{
        this.setState({showDialog:false, siteToDelete:""})
    }

    handleDialogProceed =async () =>{
        const  URL =`http://172.25.33.141:3900/sites/${this.state.siteToDelete}`;
        this.setState({showDialogProgress:true})
        try {
            const {data} = await httpService.delete(URL);
            this.setState({data});
            toast.success("Successfully deleted",{position: "top-center",autoClose: 1500})
        } catch (ex) {
            if (ex.response && ex.response.data){
                toast.error(ex.response.data,{position: "top-center", autoClose: 1500})
            }else {
                toast.error(ex.message,{position: "top-center", autoClose: 1500})

            }

        } finally {
            this.setState({showDialogProgress:false})
        }

    }


    render() {
        const {isLogin, showProgress, showDialog,siteToDelete,showDialogProgress, sortColumn} = this.state;
        let {data} = this.state;
        data = _.orderBy(data,[sortColumn.path],sortColumn.orderBy)
        if (!isLogin) return <Login/>
        return (
            <div>
                <div className="logout-container">
                    <button onClick={this.handleLogOut} className="logout-btn"><i
                        className="fa fa-power-off"/>&nbsp;LogOut
                    </button>
                </div>
                <Navbar UpdateData={this.handleUpdateData}/>
                <div className="toast-container">
                    <ToastContainer transition={Slide}/>
                </div>
                <main className="content">
                    <ReactModal isOpen={showDialog}
                                contentLabel="Example"
                                style={this.customStyles}>
                        <div className="message-box-container">
                            <h3><i className="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;ALERT</h3>
                            <div className="message-box">
                                Are you sure you want to delete <span className="message-box-siteId">{`"${siteToDelete}"`}</span>
                            </div>
                            {showDialogProgress &&  <div  className="progressIndicator">
                                <img src="/images/ajax-loader.gif" alt="Processing"/>
                            </div>}

                            <div className="button-group">
                                <button id="cancel-btn" className="cancel-btn"onClick={this.handleCancelDialog}>Cancel</button>
                                <button id="proceed-btn" className="proceed-btn" onClick={this.handleDialogProceed}>Proceed</button>
                            </div>
                        </div>

                    </ReactModal>
                    <Switch>
                        <Route
                            path="/view-sites"
                            render={(props) => <ViewSites data={data} sortColumn={sortColumn} onSort={this.handleSortEvent} showProgress={showProgress}{...props}
                                                          onDelete={this.handleDelete}/>}/>

                        <Route path="/edit-site/:site_id?"
                               render={(props) => <EditSite onFormSubmitted={this.handleFormSubmission}
                                                            data={data} {...props}/>}/>
                        <Route path="/add-site" render={(props) => <AddNewSites
                            onFormSubmitted={this.handleFormSubmission} {...props}/>}/>
                        <Route path="/not-found" component={NotFound}/>
                        <Redirect from="/" exact to="/view-sites"/>
                        <Redirect to="/not-found"/>
                    </Switch>
                </main>


            </div>
        );
    }
}

export default App;
