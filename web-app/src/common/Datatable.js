import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  TableFooter,
  Button,
} from "@mui/material";
import moment from "moment";
import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const Row = ({
  headings,
  row,
  onDeleteRow,
  onUpdateRow,
  customActionButton,
}) => {
  return (
    <TableRow>
      {headings.map((header, idx) =>
        header?.type && header?.type === "object" ? (
          <TableCell>
            {Object.keys(row[header.field]).map((obj_key, idx) => (
              <Typography component="p" key={idx}>
                {obj_key + ": " + row[header.field][obj_key]}
              </Typography>
            ))}
          </TableCell>
        ) : header?.type && header?.type === "date" ? (
          <TableCell key={idx}>
            {moment(row[header.field]).format("DD-MM-YYYY")}
          </TableCell>
        ) : header.field === "action" ? (
          <TableCell>
            <Button
              sx={{ minHeight: 0, minWidth: 0 }}
              onClick={() => onDeleteRow(row.uuid)}
            >
              <Delete />
            </Button>
            <Button
              sx={{ minHeight: 0, minWidth: 0 }}
              onClick={() => onUpdateRow(row.uuid)}
            >
              <Edit />
            </Button>
            {customActionButton && row?.connection && row?.connection?.uuid && (
              <LoadingButton
                sx={{
                  borderRadius: "5px",
                  background: "black",
                  minHeight: 0,
                  minWidth: 0,
                  ":hover": {
                    background: "lightgrey",
                    color: "black",
                  },
                }}
                variant="contained"
                loading={customActionButton.loading}
                type="button"
                onClick={() =>
                  customActionButton.handler(row["connection"]["uuid"])
                }
              >
                {customActionButton.label}
              </LoadingButton>
            )}
          </TableCell>
        ) : (
          <TableCell key={idx}>{row[header.field]}</TableCell>
        )
      )}
    </TableRow>
  );
};

const DataTable = ({
  headings,
  rows,
  onDeleteRow,
  onUpdateRow,
  customActionButton,
}) => {
  return (
    <Box sx={{}}>
      <Table>
        <TableHead>
          <TableRow>
            {headings.map((header, idx) => (
              <TableCell key={idx} sx={{ textAlign: "center" }}>
                {header.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <Row
              key={idx}
              headings={headings}
              row={row}
              onDeleteRow={onDeleteRow}
              onUpdateRow={onUpdateRow}
              customActionButton={customActionButton}
            />
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </Box>
  );
};

export default DataTable;
