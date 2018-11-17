
import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/msp'
import { injectIntl  } from 'react-intl';


class MspCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           formData:{},
           formMode:"edit",
           schema:schema,
           isInit:false
        }
    }
  
    getData = (orgCommonName) => {
        let that=this;
        var url = `api/entity/organizations/${orgCommonName}`;
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
            let allca=[], rootca=[],ca=[],tlsrootca=[],tlsca = [];
            data.PEMs.forEach(function (PEM) {
                if(PEM.Type == "ca.root"){
                    rootca.push(PEM.Name)
                }else if(PEM.Type == "ca.common"){
                    ca.push(PEM.Name)
                }else if(PEM.Type == "tlsca.root"){
                    tlsrootca.push(PEM.Name)
                }else if(PEM.Type == "tlsca.common"){
                    tlsca.push(PEM.Name)
                }
                allca.push(PEM.Name)
            });
            schema.properties.CRL.items.enum = allca;
            schema.properties.Roots.items.enum = rootca;
            schema.properties.Intermediates.items.enum = ca;
            schema.properties.Administrators.items.enum = ca;
            schema.properties.NodeId.enum = ca;
            schema.properties.TlsRoots.items.enum = tlsrootca;
            schema.properties.TlsIntermediates.items.enum = tlsca;
            that.setState({schema:schema,isInit:true});
        }).catch(function(e) {
            console.log(e);
        });
    }

    

     componentWillMount =  () => {
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,key,commonName} = data;
        this.getData(commonName);
        if(key){
            var url = 'api/organizations/'+commonName;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                data.MSPs.forEach(function (MSP) {
                    if(MSP.Name == key){

                    }
                })
                let formData = {Cert:data.ca,Key:data.key}
                that.setState({formData:formData,formMode:formMode});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }else{
            this.setState({formMode:formMode,orgCommonName:commonName});
        }
    }

    render() {
        const {intl } = this.props;

        let that = this;
        const handleFormSubmit = ({formData}) => {
            formData["Oper"] = "add_msp";
            var url = `api/entity/organizations/${orgCommonName}`;
            fetch(url,{
                method: 'put',
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/Organizations',
                  });
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }
        return (
            <div className='container'>

                <div >
                        <div className='col-sm-3    '/>
                        <div className='col-sm-6    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_msp'}) }</div>
                                <div className='panel-body'>
                                { this.state.isInit &&  <JsonForm schema={this.state.schema} uiSchema={uiSchema} handleForm={handleFormSubmit} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history}/>}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3 '/>
                </div>

              
            </div>
        )
    }
}

export default injectIntl(MspCard);

