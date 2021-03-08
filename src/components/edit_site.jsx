import React, {Component} from 'react';
import EditSiteForm from "./edit-site-form";


class EditSite extends Component {
    render() {
        return (

            <EditSiteForm {...this.props}/>
        );
    }
}

export default EditSite;
