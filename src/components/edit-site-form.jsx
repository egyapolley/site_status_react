import React, {Component} from 'react';
import httpService from "../services/httpService";
import {editSiteURl} from "../config.json";
import {toast} from "react-toastify";

class EditSiteForm extends Component {
    state = {
        data: {
            site_id: "",
            site_name: "",
            site_loc_lat: "",
            site_loc_long: "",
            site_status: ""
        },
        showProgress:false

    }

    site_status = [
        {path: "online", label: "In-Service"},
        {path: "offline", label: "Out-Of-Service"},
    ]

    componentDidMount() {
        const site_id = this.props.match.params.site_id;
        if (!site_id) return;
        const site = this.props.data.find(site => site.site_id === site_id);
        const data =site?this.mapToData(site):{...this.state.data};

        this.setState({data})
    }



    handleFormSubmit = async (event) =>{
        event.preventDefault();
        await this.doSubmit();

    }

    doSubmit =async () =>{

        const {site_id, site_name, site_status, site_loc_lat:lat, site_loc_long:long} = this.state.data;
        const URL = `${editSiteURl}/${site_id}`;
        console.log(URL)
        try {
            this.setState({showProgress:true})
            const {data} = await httpService.put(URL, {site_id,site_name,site_status,lat:lat.toString(),long:long.toString()});
            this.props.onFormSubmitted(data);
            toast.success("Successfully saved",{position: "top-center",autoClose: 1500})
        } catch (ex) {
            if (ex.response && ex.response.data){
                toast.error(ex.response.data,{position: "top-center", autoClose: 1500})
            }else {
                toast.error(ex.message,{position: "top-center", autoClose: 1500})

            }



        }finally {
            this.setState({showProgress:false})
        }



    }





    handleSelect = (event) => {

        const selectedSiteId = event.target.value;
        const site = this.props.data.find(site => site.site_id === selectedSiteId);
        const data =site?this.mapToData(site):{...this.state.data};
        
        this.setState({data})

    }

    mapToData(newData)  {
        return {
            site_id: newData.site_id,
            site_name: newData.site_name,
            site_loc_lat: newData.loc_latitude,
            site_loc_long: newData.loc_longitude,
            site_status: newData.status
        }

    }

    handleInputChange =(event) =>{
        const data ={...this.state.data}
        let name = event.currentTarget.name;
        data[name]=event.currentTarget.value;
        this.setState({data})

    }

    render() {

        const {site_id, site_name, site_loc_lat, site_loc_long, site_status} = this.state.data;
        const site_ids = this.props.data.map(site => site.site_id);

        return (
            <div className="container">
                <form action="" onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="site_id" className="input-label">Site ID:</label>
                        <select name="site_id" id="site_id" onChange={this.handleSelect} value={site_id}>
                            <option value=""/>
                            {site_ids.map(site_id => <option key={site_id} value={site_id}>{site_id}</option>)}
                        </select>

                    </div>
                    <div className="form-group">
                        <label htmlFor="site_name" className="input-label">Site Name:</label>
                        <input onChange={this.handleInputChange} type="text" id="site_name" name="site_name" value={site_name} className="input-text"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="site_loc_lat" className="input-label">Site Loc. Latitude:</label>
                        <input  onChange={this.handleInputChange}  type="text" id="site_loc_lat" name="site_loc_lat" value={site_loc_lat}
                               className="input-text"/>
                    </div>
                    <div className="form-group">
                        <label   htmlFor="site_loc_long" className="input-label">Site Loc. Longitude:</label>
                        <input onChange={this.handleInputChange} type="text" id="site_loc_long" name="site_loc_long" value={site_loc_long}
                               className="input-text"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="site_status" className="input-label">Site Status:</label>
                        <select  id="site_status" value={site_status} name="site_status" onChange={this.handleInputChange}>
                            <option value=""/>
                            {this.site_status.map(status => <option value={status.path}>{status.label}</option>)}
                        </select>
                    </div>
                    {this.state.showProgress && <div  className="progressIndicator">
                        <img src="images/ajax-loader.gif" alt="Processing"/>
                    </div>}
                    <div className="form-group-btn">
                        <button className="btn-submit">Save</button>
                    </div>

                </form>
            </div>
        );
    }
}

export default EditSiteForm;
