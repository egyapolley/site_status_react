import React, {Component} from 'react';
import {allSitesURL} from  "../config.json"
import httpService from "../services/httpService";
import {toast} from "react-toastify";

class AddSiteForm extends Component {

    state={
        data :{
            site_id:"",
            site_name:"",
            site_loc_lat:"",
            site_loc_long:"",
            site_status:""
        },

        showProgress:false

    }

    site_status =[
        {path: "online" ,label:"In-Service"},
        {path: "offline" ,label:"Out-Of-Service"},
    ]

    handleInputChange =(event) =>{
        const data ={...this.state.data}
        let name = event.currentTarget.name;
        let value = event.currentTarget.value;
        data[name]=value;
        this.setState({data})

    }

    handleFormSubmit = async (event) =>{
        event.preventDefault();
        await this.doSubmit();

    }

    doSubmit =async () =>{
        const {site_id, site_name, site_status, site_loc_lat:lat, site_loc_long:long} = this.state.data
        try {
            this.setState({showProgress:true})
            const {data} = await httpService.post(allSitesURL, {site_id,site_name,site_status,lat,long});
            this.props.onFormSubmitted(data);
            toast.success("Successfully added",{position: "top-center", autoClose: 1500})
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.data){
                toast.error(ex.response.data,{position: "top-center", autoClose: 1500})
            }else {
                toast.error(ex.message,{position: "top-center", autoClose: 1500})

            }


        }finally {
            this.setState({showProgress:false})
        }



    }




    render() {

        const {site_id, site_name, site_loc_lat, site_loc_long, site_status} = this.state.data;
        return (
            <div className="container">
                <form action="" onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="site_id" className="input-label">Site ID:</label>
                        <input type="text" id="site_id"  onChange={this.handleInputChange} name="site_id" value={site_id} className="input-text" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="site_name" className="input-label">Site Name:</label>
                        <input type="text" id="site_name" onChange={this.handleInputChange}  name="site_name" value={site_name} className="input-text" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="site_loc_lat" className="input-label">Site Loc. Latitude:</label>
                        <input type="text" id="site_loc_lat" onChange={this.handleInputChange}  name="site_loc_lat" value={site_loc_lat} className="input-text" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="site_loc_long" className="input-label">Site Loc. Longitude:</label>
                        <input type="text" id="site_loc_long"  onChange={this.handleInputChange}  name="site_loc_long" value={site_loc_long} className="input-text" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="site_status" className="input-label">Site Status:</label>
                        <select  id="site_status" value={site_status} name="site_status" onChange={this.handleInputChange} required>
                            <option value=""></option>
                            {this.site_status.map(status => <option value={status.path}>{status.label}</option>)}
                        </select>
                    </div>

                    {this.state.showProgress && <div  className="progressIndicator">
                        <img src="/images/ajax-loader.gif" alt="Processing"/>
                    </div>}
                    <div className="form-group-btn">
                        <button className="btn-submit">Save</button>
                    </div>


                </form>
            </div>
        );
    }
}

export default AddSiteForm;
