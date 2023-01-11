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

const Row = ({ headings, row, onDeleteConnection, onUpdateConnection }) => {
  return (
    <TableRow>
      {headings.map((header, idx) =>
        Object.keys(header)[0] === "creds" ? (
          <TableCell>
            {Object.keys(row["creds"]).map((obj_key, idx) => (
              <Typography component="p" key={idx}>
                {obj_key + ": " + row["creds"][obj_key]}
              </Typography>
            ))}
          </TableCell>
        ) : Object.keys(header)[0] === "action" ? (
          <TableCell>
            <Button
              sx={{ minHeight: 0, minWidth: 0 }}
              onClick={() => onDeleteConnection(row.uuid)}
            >
              <Delete />
            </Button>
            <Button
              sx={{ minHeight: 0, minWidth: 0 }}
              onClick={() => onUpdateConnection(row.uuid)}
            >
              <Edit />
            </Button>
          </TableCell>
        ) : (
          <TableCell key={idx}>{row[Object.keys(header)[0]]}</TableCell>
        )
      )}
    </TableRow>
  );
};

const DataTable = ({
  headings,
  rows,
  onDeleteConnection,
  onUpdateConnection,
}) => {
  rows = rows.map((row, idx) => {
    return {
      ...row,
      created_at: moment(row["created_at"]).format("DD-MM-YYYY"),
    };
  });

  return (
    <Box sx={{}}>
      <Table>
        <TableHead>
          <TableRow>
            {headings.map((header, idx) => (
              <TableCell key={idx}>{header[Object.keys(header)[0]]}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <Row
              key={idx}
              headings={headings}
              row={row}
              onDeleteConnection={onDeleteConnection}
              onUpdateConnection={onUpdateConnection}
            />
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </Box>
  );
};

export default DataTable;
