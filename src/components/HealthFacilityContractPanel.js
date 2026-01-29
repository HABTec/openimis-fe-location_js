import React, { use, useEffect } from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import { FormPanel, SearcherPane, withModulesManager, PublishedComponent, formatMessage, Searcher, convertToEthiopianDate } from "@openimis/fe-core";
import { Paper, Grid } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import AddIcon from "@material-ui/icons/Add";
import { injectIntl } from "react-intl";
import IconButton from '@material-ui/core/IconButton';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearLocations, fetchHealthFacilityContract, fetchLocations, createOrUpdateHealthFacilityContract } from "../actions";
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(location, startDate, endDate) {
  return { location, startDate, endDate };
}


function ContractList(props) {
  const classes = useStyles();
  const { healthFacilityContract, fetchedHealthFacilityContract, fetchingHealthFacilityContract } = props;
  function getParentAtDepth(location, depth) {
    if (depth == 0) return location
    if (!location || typeof location !== 'object' || depth < 1) return null;

    let current = location;
    let currentDepth = 0;
    while (current.parent && currentDepth < depth) {
      current = current.parent;
      currentDepth++;
    }

    // If we reached desired depth, return it
    return currentDepth === depth ? current : null;
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell>Zone/Subcity</TableCell>
              <TableCell>Wereda</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthFacilityContract?.map((row) => (
              <TableRow key={row.name}>
                <TableCell >{getParentAtDepth(row.location, 2).name}</TableCell>
                <TableCell >{getParentAtDepth(row.location, 1).name}</TableCell>
                <TableCell component="th" scope="row">
                  {getParentAtDepth(row.location, 0).name}
                </TableCell>
                <TableCell align="right">{convertToEthiopianDate(row.startDate.split('T')[0])}</TableCell>
                <TableCell align="right">{convertToEthiopianDate(row.endDate.split('T')[0])}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="delete" className={classes.margin} size="small">
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="delete" className={classes.margin} size="small">
                    <DeleteIcon  fontSize="inherit" />
                  </IconButton>
                  </TableCell>
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
    if (props.edited_id)
      props.fetchHealthFacilityContract(props.edited_id);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveContract = () => {
    console.log({ location: location.id, startDate, endDate })
    props.onSaveContract({ location: location.id, startDate, endDate, healthFacilityId: props.edited?.id }, "CreateHealthFacilityContract");
    setOpen(false);
  }
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
          resultsPane={<ContractList {...props} />}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add contract to facility</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={location?.parent?.parent?.parent ?? location?.parent?.parent ?? location?.parent ?? location}
                readOnly={readOnly}
                withNull={false}
                onChange={(location) => setLocation(location)}
              />
            </Grid>
            <Grid item xs={12}>
              <PublishedComponent
                region={location?.parent || location}
                value={location?.parent?.parent ? location.parent : null}
                pubRef="location.DistrictPicker"
                withNull={false}
                readOnly={readOnly}
                onChange={(location) => setLocation(location || location?.parent)}
              />
            </Grid>
            <Grid item xs={12}>
              <PublishedComponent
                pubRef="location.LocationPicker"
                onChange={(location) => setLocation(location || location?.parent?.parent)}
                required
                readOnly={readOnly}
                // filterOptions={filterParents}
                value={location?.parent?.parent ? location : null}
                locationLevel={2}
              />
            </Grid>
            <Grid item xs={12}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={!!setEndDate ? startDate : null}
                module="location"
                label="startedAt"
                readOnly={false}
                required={true}
                onChange={(v) => setStartDate(v)}
              />
            </Grid>
            <Grid item xs={12}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={!!setEndDate ? endDate : null}
                module="location"
                label="endedAt"
                readOnly={false}
                required={true}
                onChange={(v) => setEndDate(v)}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={saveContract} color="primary" disabled={!(location && startDate && endDate)}>
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
