import React, { use, useEffect } from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import { FormPanel, SearcherPane, withModulesManager, PublishedComponent,formatMessage , Searcher} from "@openimis/fe-core";
import { Paper } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import AddIcon from "@material-ui/icons/Add";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearLocations, fetchHealthFacilityContract, fetchLocations } from "../actions";
const styles = (theme) => ({
  item: theme.paper.item,
});
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(location , startDate, endDate) {
  return { location , startDate, endDate };
}


function ContractList(props) {
  const classes = useStyles();
  const {healthFacilityContract ,fetchedHealthFacilityContract , fetchingHealthFacilityContract} = props;

  return (
    <>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Region</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {healthFacilityContract?.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.location}
              </TableCell>
              <TableCell align="right">{row.startDate}</TableCell>
              <TableCell align="right">{row.endDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
    </>
  );
}

function HealthFacilityContractPanel(props) {
  
  const { intl, classes, readOnly = false } = props;
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [location, setLocation] = React.useState();

  useEffect(() => {
    console.log(props)
    if(props.edited_id  )
    props.fetchHealthFacilityContract(props.edited_id);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let actions = [];
  if (
    !readOnly
    // &&
    // Boolean(onEdit) &&
    // (
    //   createRegionLocationRight ||
    //   rights.includes(RIGHT_LOCATION_ADD) &&
    //   isNotRegionOrDistrict
    // )
  ) {
    actions.push({
      action: handleClickOpen,
      icon: <AddIcon />,
    });
  }
    return (
      <>
        
        <Paper className={classes.paper}>
          <SearcherPane
            module="location"
            title={`healthFacilities.contract.title`}
            // refresh={onRefresh}
            SearchIcon={ReplayIcon}
            actions={actions}
            readOnly={false}
            resultsPane={<ContractList {...props}/>}
          />
        </Paper>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add contract to facility</DialogTitle>
          <DialogContent>
            <PublishedComponent
              pubRef="core.DatePicker"
              value={!!setEndDate ? startDate : null}
              module="location"
              label="Policy.enrollDate"
              readOnly={false}
              required={true}
              onChange={(v) => setStartDate(v)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }


const mapStateToProps = (state) => ({
  healthFacilityContract: state.loc.healthFacilityContract,
  fetchingHealthFacilityContract: state.loc.fetchingHealthFacilityContract,
  fetchedHealthFacilityContract: state.loc.fetchedHealthFacilityContract,
  errorFacilityContract: state.loc.errorFacilityContract,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchHealthFacilityContract,
      clearLocations,
    },
    dispatch,
  );
};

export default withModulesManager(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(withTheme(withStyles(styles)(HealthFacilityContractPanel)))),
);
