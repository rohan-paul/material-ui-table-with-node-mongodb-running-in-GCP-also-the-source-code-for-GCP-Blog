module.exports = {
  styles: theme => ({
    palette: {
      primary: { main: '#9E9E9E' },
      secondary: { main: '#ee0053' },
      error: { main: '#ee0053' }
    },
    root: {
      width: '100%',
      background: 'linear-gradient(45deg, #E91E63 30%, #FF8E53 90%)',
      marginTop: theme.spacing.unit * 10,
      backgroundColor: '#E0E0E0'
    },
    paper: {
      backgroundColor: '#F5F5F5',
      boxShadow: 'none',
      overflow: 'hidden'
    },
    table: {
      minWidth: 1020
    },
    tableWrapper: {
      overflowX: 'auto'
    },
    gutters: theme.mixins.gutters(),
    styledHeader: {
      background: '#66CCFF',
      '& h1': {
        color: '#f9f9f6'
      },
      color: '#f9f9f6',
      fontSize: 25
    },
    styledFooter: {
      background: '#FAFAFA',
      '& h2': {
        color: '#FAFAFA'
      }
    },
    space: {
      marginTop: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 4
    },
    spaceDialogAction: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    fab: {
      margin: theme.spacing.unit * 4
    },
    extendedIcon: {
      marginRight: theme.spacing.unit
    },
    margin: {
      margin: theme.spacing.unit * 4
    },

    lightTooltip: {
      background: theme.palette.common.white,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      fontSize: 16
    },
    close: {
      padding: theme.spacing.unit * 2,
      fontSize: 25
    },
    formControl: {
      margin: theme.spacing.unit,
      maxWidth: 300
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    notchedOutline: {
      border: '1px solid red'
    },
    overrides: {
      MuiOutlinedInput: {
        focused: {
          border: '1px solid #4A90E2'
        },
        '& $notchedOutline': {
          border: '1px solid #4A90E2'
        }
      }
    },
    underline: {
      '&:after': {
        borderBottomColor: 'rgb(70, 197, 29)',
        borderWidth: '1px'
      }
    }
  })
};

/*
1> In above, the 'space' will control the vertical line spacing between TestFields and DatePicker inside the Dialog (i.e. inside AddNewDevelopmentWork component)

And 'spaceDialogAction' will control the vertical space
 */
