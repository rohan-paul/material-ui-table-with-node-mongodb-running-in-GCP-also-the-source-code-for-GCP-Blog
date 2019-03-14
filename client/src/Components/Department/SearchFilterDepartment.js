import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "material-ui/MenuItem";
import styles from "../commonStyles/SearchFilter-Styles.js";
import toolbarStyles from "../commonStyles/toolbarStyles";
import combineStyles from "../commonStyles/combineStyles";
import SelectField from "material-ui/SelectField";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import "../commonStyles/SearchFilter-InputField.css";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";

const NoOptionsMessage = props => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

const inputComponent = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />;
};

const Control = props => {
  return (
    <TextField
      fullWidth
      label=""
      InputLabelProps={{
        classes: { root: props.selectProps.classes.labelRoot },
        shrink: true
      }}
      InputProps={{
        inputComponent,
        disableUnderline: true,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
};

const Option = props => {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
};

const Placeholder = props => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

const SingleValue = props => {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

const ValueContainer = props => {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
};

const Menu = props => {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class SearchFilter extends React.Component {
  state = {
    query: "",
    columnToQuery: "name",
    arrowRef: null
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  render() {
    const { columnToQuery } = this.state;

    // conditionally set the value of 'suggestions' with and IIFE
    const suggestions = (() => {
      switch (columnToQuery) {
        case "name":
          return this.props.allDepartments.map(item => ({
            value: item.name,
            label: item.name
          }));
        case "type":
          return this.props.allDepartments.map(item => ({
            value: item.type,
            label: item.type
          }));
      }
    })();

    const {
      classes,
      theme,
      value,
      onChange,
      inputValue,
      onInputChange
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        width: "20em",
        marginTop: "20px",
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };

    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        alignContent="center"
        direction="row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Grid
          item
          xs={24}
          style={{
            marginRight: "700px"
          }}
        >
          <Paper className={classes.textSearchFilter}>
            <Select
              classes={classes}
              styles={selectStyles}
              options={suggestions}
              components={components}
              inputId="fb-gg-search"
              value={value}
              onChange={onChange}
              inputValue={inputValue}
              onInputChange={onInputChange}
              placeholder="Search"
              multi="true"
            />
            <SelectField
              style={{
                marginLeft: "1em"
              }}
              floatingLabelText="Select a column"
              value={this.state.columnToQuery}
              onChange={(event, index, value) =>
                this.setState({ columnToQuery: value }, () => {
                  this.props.handleColumnToQuery(this.state.columnToQuery);
                })
              }
            >
              <MenuItem value="name" primaryText="Name" />
              <MenuItem value="type" primaryText="Department Type" />
            </SelectField>

            <Tooltip
              title={
                <React.Fragment>
                  <h2>Clear the Search Filter</h2>
                  <span className={classes.arrow} ref={this.handleArrowRef} />
                </React.Fragment>
              }
              placement="top-end"
              classes={{
                tooltip: classes.bootstrapTooltip,
                popper: classes.bootstrapPopper,
                tooltipPlacementLeft: classes.bootstrapPlacementLeft,
                tooltipPlacementRight: classes.bootstrapPlacementRight,
                tooltipPlacementTop: classes.bootstrapPlacementTop,
                tooltipPlacementBottom: classes.bootstrapPlacementBottom
              }}
              PopperProps={{
                popperOptions: {
                  modifiers: {
                    arrow: {
                      enabled: Boolean(this.state.arrowRef),
                      element: this.state.arrowRef
                    }
                  }
                }
              }}
              onOpen={() =>
                this.props.setTextFilterTooltip("Clear the Search Filter")
              }
            >
              <IconButton
                variant="contained"
                size="small"
                color="primary"
                className={classes.margin}
                onClick={this.props.closeSearchFilterCompOnClick}
                style={{ marginLeft: "15px" }}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

SearchFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, toolbarStyles);

export default withStyles(combinedStyles, { withTheme: true })(SearchFilter);
