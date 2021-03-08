import React, {Component} from 'react';
import AddSiteForm from "./add-site-form";

class AddNewSites extends Component {
    render() {
        return (
            <AddSiteForm {...this.props}/>
        );
    }
}

export default AddNewSites;
