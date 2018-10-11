import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import LinearProgress from '@material-ui/core/LinearProgress';


const columnData = [
  { id: 'Name', numeric: true, disablePadding: false, label: '链码名称' },
  { id: 'Path', numeric: true, disablePadding: false, label: '路径' },
  { id: 'Lang', numeric: true, disablePadding: false, label: '语言' },
  { id: 'Version', numeric: true, disablePadding: false, label: '版本' },
  { id: 'PeerName', numeric: true, disablePadding: false, label: 'Peer节点' },
  { id: 'State', numeric: true, disablePadding: false, label: '是否启动' },
];


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class ChainCodeTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'Name',
      data: [],
      OrderName: '',
      loading:false
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.data !== newProps.data) {
      this.setState({ data: newProps.data });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleConsoleClick = (event, key) => {
    let data = JSON.stringify({ key: key });
    this.props.history.push({
      pathname: `/chainCodeconsolecard/${data}`
    });
  };


  handleViewClick = (event, key) => {
    let data = JSON.stringify({ key: key, formMode: "view" });
    this.props.history.push({
      pathname: `/chaincodecard/${data}`
    });
  };

  handleDelClick = (event, key) => {
    let that = this;

    var url = 'api/entity/chaincodes/' + key;
    fetch(url, {
      method: 'delete',
    }).then(response => {
      return response.json();
    })
      .then(function (data) {
        that.props.callback({ data: data == null ? [] : data, selected: 0 });
      }).catch(function (e) {
        console.log(e);
      });
  };


  handleCmdClick = (event,cmd,nodeName,peerName) => {
    let that = this;
    let data = {}
    data.Cmd = cmd;
    data.NodeName = nodeName;
    data.Peer = peerName;
    let key = nodeName+"."+peerName
    this.setState({ loading: true });
    var url = `api/entity/chaincodes/${key}/cmd`;
        fetch(url,{
            method: 'put',
            body:JSON.stringify(data)
        }).then(function(response) {
            return response.json()
        }).then(function(res) {
            if(res.msg=="ok"){
              let datas = that.state.data;
              let newDatas = [];
              datas.forEach(function(data){
                  if(data.Name+"."+data.PeerName == key){
                    if(cmd == "NODE_START"){
                      data.State = "enable";
                    }else{
                      data.State = "disable";
                    }
                      
                  }
                  newDatas.push(data)
              });
              console.log(newDatas);
              that.setState({ loading: false });
              that.props.callback({ data: newDatas });
          }else{
              that.setState({ loading: false });
              alert(res.msg);
          }
        }).catch(function(e) {
            console.log(e);
        });
};

  addChainCode = event => {
    let data = JSON.stringify({ formMode: "edit" });
    this.props.history.push({
      pathname: `/chaincodecard/${data}`
    });


  }


  render() {
    const { classes, history, data } = this.props;
    const { order, orderBy } = this.state;
    const tooltip = (<Tooltip title="添加链码">
      <Button variant="raised" color="primary" className={classes.button} onClick={this.addChainCode}>
        <AddIcon className={classes.leftIcon} />
        添加链码
    </Button>
    </Tooltip>
    )
    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            {this.state.loading && <LinearProgress />}
            <EnhancedTableToolbar title="链码" tooltip={tooltip} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  columnData={columnData}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((n, k) => {
                    return (
                      <TableRow hover key={n.Name}
                      >

                        <TableCell numeric>{n.Name}</TableCell>
                        <TableCell numeric>{n.Path}</TableCell>
                        <TableCell numeric>{n.Lang}</TableCell>
                        <TableCell numeric>{n.Version}</TableCell>
                        <TableCell numeric>{n.PeerName}</TableCell>
                        <TableCell numeric>{n.State=="enable"?"已启动":"未启动"}</TableCell>
                   
                        <TableCell>
                         {n.State !="enable" && <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.Name+"."+n.PeerName)} >  删除 </Button>}
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name+"."+n.PeerName)} >  查看 </Button>
                         {n.State =="disable" && <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleCmdClick(event,"NODE_START", n.Name,n.PeerName)} >  启动链码 </Button> }
                         {n.State =="enable" && <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleCmdClick(event,"NODE_STOP", n.Name,n.PeerName)} >  停止链码 </Button> }
                        </TableCell>
                      </TableRow>
                    );
                  })}


                </TableBody>
              </Table>
            </div>

          </Paper>
        </div>
      </div>
    );
  }
}

ChainCodeTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChainCodeTable);