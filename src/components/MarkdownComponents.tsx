import { baseURL } from "@/lib/fetch-markdown";
import { Components, MergeComponents } from "@mdx-js/react/lib";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";

export const components: Components | MergeComponents = {
  img: (props) =>
    props.src && (
      <Image
        alt={props.alt || "image"}
        style={{ width: "100%", height: "auto" }}
        width={500}
        height={300}
        src={props.src.replace(new RegExp("[.]+/"), baseURL)}
      />
    ),
  h1: ({ children }) => (
    <Typography variant="h1" sx={{ mt: 4 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h2" sx={{ mt: 4 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h3" sx={{ mt: 4 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => <Typography variant="body1">{children}</Typography>,

  table: ({ children }) => (
    <TableContainer sx={{ mt: 4 }}>
      <Table>{children}</Table>
    </TableContainer>
  ),
  thead: ({ children }) => <TableHead>{children}</TableHead>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => <TableCell>{children}</TableCell>,
  td: ({ children }) => <TableCell>{children}</TableCell>,
};
