function arrowGenerator(color) {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.95em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${color} transparent`
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.95em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${color} transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: "-0.95em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${color} transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: "-0.95em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${color}`
      }
    }
  };
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  monthlyData: {
    marginRight: "12px",
    width: "650px",
    minHeight: "40px",
    paddingTop: "10px",
    verticalAlign: "center",
    textAlign: "center",
    borderRadius: "10px",
    cursor: "pointer"
  },
  todaysData: {
    marginRight: "12px",
    width: "200px",
    paddingTop: "6px",
    verticalAlign: "center",
    textAlign: "center",
    borderRadius: "10px",
    cursor: "pointer"
  },
  arrowPopper: arrowGenerator(theme.palette.common.black),
  arrow: {
    position: "absolute",
    fontSize: 6,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  },
  bootstrapPopper: arrowGenerator(theme.palette.common.black),
  bootstrapTooltip: {
    backgroundColor: theme.palette.common.black,
    paddingTop: "12px"
  },
  bootstrapPlacementLeft: {
    margin: "0 8px"
  },
  bootstrapPlacementRight: {
    margin: "0 8px"
  },
  bootstrapPlacementTop: {
    margin: "8px 0"
  },
  bootstrapPlacementBottom: {
    margin: "8px 0"
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: "#66CCFF"
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },

  spacer: {
    flex: "1 2 100%"
  },
  spacerCurrentMonth: {
    flex: "1 2 100%"
  },

  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

export default toolbarStyles;

/*
1> Explanation of < flex: 1 1 100% > - With this I am making 'spacer' to stay full-width of the available space. And then adding two 'spacer' class to both side of the '{currentMonth} month's Exports' to make the currentMonth get centered within the available space

A) The 100% in the above is the 'flex-basis', a sub-property of the Flexible Box Layout module. It specifies the initial size of the flexible item, before any available space is distributed according to the flex factors.

B) flex - This is the shorthand for flex-grow, flex-shrink and flex-basis combined. Defaults is 0 1 auto.

B) In other words, the general syntax -
flex : flex-grow | flex-shrink | flex-basis
(https://developer.mozilla.org/en-US/docs/Web/CSS/flex)

C) The general way flex work - I need to add display:flex to the parent tag and then flex:1 to the child to enable the child to expand to 100% of parent.

*/
