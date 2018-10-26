import React from 'react';
import ConsortiumTable from './ConsortiumTable';
import { injectIntl  } from 'react-intl';


class Consortium extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:0,
            data: []
          };
    }

    callback =(state)=>{
        this.setState(state)
    }

    componentDidMount = () => {
        document.title = "Fabric Manager "+this.props.intl.formatMessage({id:'consortium_manage'});
        let that = this;
        var headers = new Headers();
    
        var url = 'api/entity/consortiums';
        fetch(url, {
          method: 'get',
        }).then(response => {
          return response.json();
        })
        .then(function (data) {
            that.setState({ data: data.consortiums==null?[]:data.consortiums });
        }).catch(function (e) {
            console.log(e);
        });
      }

    render() {

        const { history } = this.props;

        return (
            <div className='container'>
              <ConsortiumTable history={this.props.history} data={this.state.data} callback ={this.callback}/>
            </div>
        )
    }
}

export default injectIntl(Consortium);

