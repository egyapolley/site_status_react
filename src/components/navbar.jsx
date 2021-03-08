import React, {Component} from 'react';
import { NavLink} from "react-router-dom";

class Navbar extends Component {



    render() {



        return (
            <div>
               <div className="navbar-container">
                   <ul className="navbar-list">
                       <li onClick={this.props.UpdateData} className="navbar-list-item"><NavLink className="hover" activeClassName="activeNavLink" to="/view-sites" >View All Sites</NavLink></li>
                       <li className="navbar-list-item"><NavLink  activeClassName="activeNavLink" to="/add-site">Add New Site</NavLink></li>
                       <li className="navbar-list-item"><NavLink activeClassName="activeNavLink" to="/edit-site">Edit Site</NavLink></li>
                   </ul>
               </div>

            </div>
        );
    }
}

export default Navbar;
