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
  { id: 'Name', numeric: true, disablePadding: false, label: '通道名称(ID)' },
  { id: 'Consortium', numeric: true, disablePadding: false, label: '联盟' },
  { id: 'OrdererName', numeric: true, disablePadding: false, label: 'Order节点' },
  { id: 'State', numeric: true, disablePadding: false, label: '是否启用' },
  { id: 'Desc', numeric: true, disablePadding: false, label: '通道描述' },
  
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

class ChannelTable extends React.Component {
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

  handleCmdClick = (event, key) => {

    let that = this;
    let data = {}
    data.Cmd = "CHANNEL_CREATE";
    data.NodeName = key;
    var url = `api/entity/channels/${key}/cmd`;
    this.setState({ loading: true });
    fetch(url,{
            method: 'put',
            body:JSON.stringify(data)
    }).then(function(response) {
            return response.json();
    }).then(function(res) {
       if(res.msg=="enable"){
          let datas = that.state.data;
          let newDatas = [];
          datas.forEach(function(data){
              if(data.Name == key){
                  data.State = "enable";
              }
              newDatas.push(data)
          });
          console.log(newDatas);
          that.setState({ loading: false });
          that.props.callback({ data: newDatas, selected: 0 });
       }else{
          that.setState({ loading: false });
          alert("启用通道失败，请确认 1.对应Order节点是否已经启动。 2.已经存在同名通道");
       }
       
    }).catch(function(e) {
            console.log(e);
    });


  };


  handleViewClick = (event, key) => {
    let data = JSON.stringify({ key: key, formMode: "view" });
    this.props.history.push({
      pathname: `/channelcard/${data}`
    });
  };

  handleDelClick = (event, key) => {
    let that = this;

    var url = 'api/entity/channels/' + key;
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


  addConsortium = event => {
    let data = JSON.stringify({ formMode: "edit" });
    this.props.history.push({
      pathname: `/channelcard/${data}`
    });


  }


  render() {
    const { classes, history, data } = this.props;
    const { order, orderBy } = this.state;
    const tooltip = (<Tooltip title="添加通道">
      <Button variant="raised" color="primary" className={classes.button} onClick={this.addConsortium}>
        <AddIcon className={classes.leftIcon} />
        添加通道
    </Button>
    </Tooltip>
    )
    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            {this.state.loading && <LinearProgress />}
            <EnhancedTableToolbar title="通道" tooltip={tooltip} />
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
                        <TableCell numeric>{n.Consortium}</TableCell>
                        <TableCell numeric>{n.OrdererName}</TableCell>
                        <TableCell numeric>{n.State=="enable"?"已启用":"未启用"}</TableCell>
                        <TableCell numeric>{n.Desc}</TableCell>
                        <TableCell>
                          {n.State!="enable" && <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.Name)} >  删除 </Button>}
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name)} >  查看 </Button>
                          {n.State!="enable" &&<Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleCmdClick(event, n.Name)} >  启用通道 </Button>}
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

ChannelTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelTable);