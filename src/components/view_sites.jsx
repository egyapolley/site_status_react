import React, {Component} from 'react';

class ViewSites extends Component {

    columnHeading =[{path:"site_id",title:"Site ID"},
        {path:"site_name",title:"Site Name"},
        {path:"status",title:"Site Status"},
        {path:"loc_latitude",title:"Site Loc. Latitude"},
        {path:"loc_longitude",title:"Site Loc. Longitude"},
        {key:"edit",content: item =><button onClick={() =>this.handleEdit(item)}><i className="fas fa-edit edit"/></button>},
        {key:"delete",content: item =><button onClick={() =>this.handleDelete(item)}><i className="fas fa-trash-alt delete"/></button>}]


    renderCellData =(item, column) =>{
        if (column.content) return column.content(item);
        return  item[column.path]

    }

    handleDelete = (item) => {
        this.props.onDelete(item)

    }

    getClasses =(item, column) =>{
        if (column.path ==='status'){
            if (item[column.path] ==='online'){
                return "online"
            }else {
                return "offline"
            }
        }
        return ""

    }

    handleEdit = (item) => {
        console.log(item);
        let path = `/edit-site/${item.site_id}`;
        this.props.history.push(path);
    }

    renderKey =(index, column) =>{
        return  column && column.key?`${index}${column.key}`:`${index}${column.path}`

    }




    render() {
        const {data, showProgress} = this.props;
        return (
            <div >
                { showProgress && <div className="progress-bar" ><img src="/images/ajax-loader.gif" alt="Processing"/></div>}
                {data.length >0 &&   <div className="vertical-container"><table>
                    <thead>
                    <tr>
                        {this.columnHeading.map(columnHeading =><th key={columnHeading.path||columnHeading.key}>{columnHeading.title}</th>)}
                    </tr>

                    </thead>
                    <tbody>
                    {data.map((item, index) => <tr key={index}>
                        {this.columnHeading.map(column =><td key={this.renderKey(index,column)} className={this.getClasses(item,column)} >{this.renderCellData(item,column)}</td>)}
                    </tr>)}
                    </tbody>
                </table></div>}
            </div>
        );
    }
}
export default ViewSites;
