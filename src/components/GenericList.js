import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Collapse,
  Box,
  Button,
  Checkbox,
  Paper,
} from "@mui/material";
import {
  DeleteOutline as Delete,
  EditOutlined as Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add,
  WhatsApp as WhatsAppIcon,
  EmailOutlined as EmailIcon,
  Download,
} from "@mui/icons-material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { getActionHandler } from "./actionHandlers";
import { ACTION_BUTTONS } from "../utils";
import ExportToExcel from "./ExportToExcel";

import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";

const rowStyle = {
  fontSize: "0.79rem", // Smaller font size
  padding: "5px 8px", // Reduced padding for smaller height
};

const cellStyle = {
  fontSize: "0.79rem", // Smaller font size
  padding: "5px 8px", // Reduced padding for smaller height
};

const actionsCellStyle = {
  display: "flex",

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
  padding: "5px 8px", // Reduced padding for smaller height
};

const GenericList = ({
  columns,
  data,
  actions,
  onCreateButtonClick,
  onActivity,
  pagination,
  selectable = false,
  onEditAction,
  onDeleteAction,
  title,
  onPageChange,
  page,
  onPageSizeChange,
  itemsToShow,
  totalPages,
  detailPanel,
  onCompleteAction,
  onDownloadDocument,
  onSeeDetail,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleExpandClick = (row) => {
    setExpandedRow(expandedRow === row ? null : row);
  };

  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(event, newPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(event);
    }
    if (pagination && pagination.rowsPerPage !== newRowsPerPage) {
      // Reset page to 0 when changing rows per page
      handlePageChange(null, 0);
    }
  };

  function sendWhatsappAction(row) {
    if (row?.mobileNumber) {
      window.open(`https://wa.me/${row.mobileNumber.replace(/[\s-]/g, "")}`);
    }
  }

  function sendEmailAction(row) {
    const mailto = `mailto:${row.email}`;
    window.open(mailto);
  }

  const paginatedData = totalPages
    ? data
    : data.slice(page * itemsToShow, page * itemsToShow + itemsToShow);

  return (
    <Paper style={{ padding: 16, border: "1px solid #ddd", borderRadius: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <ExportToExcel dataList={data} columns={columns} />

        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", minHeight: 25 }}>
          {onCreateButtonClick && (
            <Button
              variant="contained"
              color="primary"
              onClick={onCreateButtonClick}
              style={{ marginRight: 10 }}
            >
              <Add />
            </Button>
          )}
        </div>
      </div>
      <TableContainer style={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {detailPanel && (
                <TableCell style={{ ...cellStyle, fontWeight: "bold" }} />
              )}
              {selectable && (
                <TableCell
                  padding="checkbox"
                  style={{ ...cellStyle, fontWeight: "bold" }}
                />
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  style={{ ...cellStyle, fontWeight: "bold", fontSize: 14 }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {column.title}
                  </div>
                </TableCell>
              ))}
              {actions?.length > 0 && (
                <TableCell
                  style={{
                    ...cellStyle,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.length > 0 ? (
              paginatedData.map((row) => (
                <React.Fragment key={row._id}>
                  <TableRow key={row._id} style={rowStyle}>
                    {detailPanel && (
                      <TableCell width={5} style={{ ...cellStyle }}>
                        <IconButton onClick={() => handleExpandClick(row)}>
                          {expandedRow === row ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    {selectable && (
                      <TableCell padding="checkbox" style={{ ...cellStyle }}>
                        <Checkbox />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.field} style={{ ...cellStyle }}>
                        {column.render ? column.render(row) : row[column.field]}
                      </TableCell>
                    ))}
                    {actions?.length > 0 && (
                      <TableCell style={actionsCellStyle}>
                        {actions.map((action) => {
                          const actionHandler = getActionHandler(
                            action,
                            onEditAction,
                            onDeleteAction,
                            sendWhatsappAction,
                            sendEmailAction,
                            onCompleteAction,
                            onActivity,
                            onDownloadDocument,
                            onSeeDetail
                          );
                          return (
                            <IconButton
                              key={action} // Key added here for each action
                              onClick={() => actionHandler(row)}
                            >
                              {action === ACTION_BUTTONS.EDIT ? (
                                <Edit />
                              ) : action === ACTION_BUTTONS.DELETE ? (
                                <Delete />
                              ) : action === ACTION_BUTTONS.DOWNLOAD ? (
                                <Download />
                              ) : action === ACTION_BUTTONS.COMPLETEACTIVITY ? (
                                <AssignmentTurnedInOutlinedIcon />
                              ) : action === ACTION_BUTTONS.WHATSAPP ? (
                                <WhatsAppIcon />
                              ) : action === ACTION_BUTTONS.ACTIVITY ? (
                                <AccessTimeIcon />
                              ) : action === ACTION_BUTTONS.SEEDETAIL ? (
                                <RemoveRedEyeOutlinedIcon />
                              ) : action === ACTION_BUTTONS.EMAIL ? (
                                <EmailIcon />
                              ) : null}
                            </IconButton>
                          );
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                  {detailPanel && expandedRow === row && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          columns?.length +
                          (actions?.length > 0 ? 1 : 0) +
                          (detailPanel ? 1 : 0)
                        }
                        style={{ ...cellStyle }}
                      >
                        <Collapse
                          in={expandedRow === row}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>{detailPanel(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns?.length +
                    (actions?.length > 0 ? 1 : 0) +
                    (detailPanel ? 1 : 0)
                  }
                  // style={{ textAlign: "center" }}
                  style={{ ...cellStyle }}
                >
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={totalPages ? totalPages : data?.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={itemsToShow || 10}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 50]}
          labelRowsPerPage="Filas por página:"
          ActionsComponent={PaginationActions}
        />
      )}
    </Paper>
  );
};

export default GenericList;

const PaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: "16px" }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};
